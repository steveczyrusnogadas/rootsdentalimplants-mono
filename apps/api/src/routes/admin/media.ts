import {
  createMediaUploadPayloadSchema,
  finalizeMediaUploadPayloadSchema,
  updateMediaAssetPayloadSchema,
  type MediaAsset,
} from "@repo/types/admin/media";
import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../../database/client";
import { mediaAsset } from "../../database/schema";
import { adminAndManagerRoles, getAdminSession } from "../../shared/admin-session";
import {
  createMediaUploadUrl,
  deleteObject,
  getMediaImageUrl,
  getMediaObjectKey,
  isAllowedMediaContentType,
  maxMediaImageSizeBytes,
} from "../../storage/s3";
import { parseListQueryParams } from "./list-query";
import { getPaginationMeta, getPaginationOffset, parsePaginationParams } from "./pagination";

export const adminMediaRoutes = new Hono();

const mediaSortColumns = {
  fileName: mediaAsset.fileName,
  contentType: mediaAsset.contentType,
  size: mediaAsset.size,
  createdAt: mediaAsset.createdAt,
  updatedAt: mediaAsset.updatedAt,
} as const;
const mediaSortKeys = Object.keys(mediaSortColumns) as Array<keyof typeof mediaSortColumns>;

function serializeMediaAsset(record: typeof mediaAsset.$inferSelect): MediaAsset {
  return {
    id: record.id,
    fileName: record.fileName,
    altText: record.altText,
    assetType: record.assetType as MediaAsset["assetType"],
    contentType: record.contentType,
    size: record.size,
    width: record.width,
    height: record.height,
    durationSeconds: record.durationSeconds,
    tags: record.tags,
    objectKey: record.objectKey,
    url: record.url,
    createdBy: record.createdBy,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

function getSchemaError(error: { issues: Array<{ message: string }> }, fallback: string) {
  return error.issues[0]?.message ?? fallback;
}

function validateMedia(contentType: string, size: number) {
  if (!isAllowedMediaContentType(contentType)) {
    throw new Error("Media must be a JPEG, PNG, WebP, GIF, MP4, WebM, MOV, or PDF file.");
  }

  if (size > maxMediaImageSizeBytes) {
    throw new Error("Media asset must be smaller than 5 MB.");
  }
}

function getAssetType(contentType: string): MediaAsset["assetType"] {
  if (contentType.startsWith("image/")) {
    return "image";
  }

  if (contentType.startsWith("video/")) {
    return "video";
  }

  return "pdf";
}

function validateAssetType(contentType: string, assetType: MediaAsset["assetType"]) {
  if (getAssetType(contentType) !== assetType) {
    throw new Error("Media asset type does not match the file content type.");
  }
}

adminMediaRoutes.get("/api/admin/media", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const pagination = parsePaginationParams(c.req.query("page"), c.req.query("limit"));
  const listQuery = parseListQueryParams({
    search: c.req.query("search"),
    sortBy: c.req.query("sortBy"),
    sortDir: c.req.query("sortDir"),
    allowedSorts: mediaSortKeys,
    defaultSortBy: "createdAt",
  });
  const assetType = c.req.query("assetType");
  const assetTypeFilter =
    assetType === "image" || assetType === "video" || assetType === "pdf"
      ? eq(mediaAsset.assetType, assetType)
      : undefined;
  const searchFilter = listQuery.search
    ? or(
        ilike(mediaAsset.fileName, `%${listQuery.search}%`),
        ilike(mediaAsset.altText, `%${listQuery.search}%`),
        ilike(mediaAsset.contentType, `%${listQuery.search}%`),
        sql`${mediaAsset.tags}::text ilike ${`%${listQuery.search}%`}`,
      )
    : undefined;
  const whereFilter =
    searchFilter && assetTypeFilter
      ? and(searchFilter, assetTypeFilter)
      : searchFilter
        ? searchFilter
        : assetTypeFilter;
  const sortColumn = mediaSortColumns[listQuery.sortBy];
  const orderBy = listQuery.sortDir === "asc" ? asc(sortColumn) : desc(sortColumn);
  const [{ total }] = whereFilter
    ? await db.select({ total: count() }).from(mediaAsset).where(whereFilter)
    : await db.select({ total: count() }).from(mediaAsset);
  const records = whereFilter
    ? await db
        .select()
        .from(mediaAsset)
        .where(whereFilter)
        .orderBy(orderBy)
        .limit(pagination.pageSize)
        .offset(getPaginationOffset(pagination))
    : await db
        .select()
        .from(mediaAsset)
        .orderBy(orderBy)
        .limit(pagination.pageSize)
        .offset(getPaginationOffset(pagination));

  return c.json({
    assets: records.map(serializeMediaAsset),
    pagination: getPaginationMeta(total, pagination),
  });
});

adminMediaRoutes.post("/api/admin/media/uploads", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  try {
    const result = createMediaUploadPayloadSchema.safeParse(await c.req.json());

    if (!result.success) {
      return c.json({ error: getSchemaError(result.error, "Invalid media upload.") }, 400);
    }

    validateMedia(result.data.contentType, result.data.size);
    validateAssetType(result.data.contentType, result.data.assetType);

    const id = crypto.randomUUID();
    const upload = await createMediaUploadUrl({
      id,
      contentType: result.data.contentType,
    });

    return c.json({
      id,
      key: upload.key,
      uploadUrl: upload.uploadUrl,
      url: upload.imageUrl,
      method: "PUT" as const,
      headers: upload.headers,
      maxSize: maxMediaImageSizeBytes,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to prepare media upload.";

    return c.json({ error: message }, 400);
  }
});

adminMediaRoutes.post("/api/admin/media/:id/finalize", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  try {
    const result = finalizeMediaUploadPayloadSchema.safeParse({
      ...(await c.req.json()),
      id: c.req.param("id"),
    });

    if (!result.success) {
      return c.json({ error: getSchemaError(result.error, "Invalid media asset.") }, 400);
    }

    validateMedia(result.data.contentType, result.data.size);
    validateAssetType(result.data.contentType, result.data.assetType);

    const now = new Date();
    const [createdAsset] = await db
      .insert(mediaAsset)
      .values({
        id: result.data.id,
        fileName: result.data.fileName,
        altText: result.data.altText,
        assetType: result.data.assetType,
        contentType: result.data.contentType,
        size: result.data.size,
        width: result.data.width ?? null,
        height: result.data.height ?? null,
        durationSeconds: result.data.durationSeconds ? Math.round(result.data.durationSeconds) : null,
        tags: result.data.tags,
        objectKey: getMediaObjectKey(result.data.id),
        url: getMediaImageUrl(result.data.id),
        createdBy: admin.sessionUser.id,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return c.json({ asset: serializeMediaAsset(createdAsset) }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save media asset.";

    return c.json({ error: message }, 400);
  }
});

adminMediaRoutes.patch("/api/admin/media/:id", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  try {
    const result = updateMediaAssetPayloadSchema.safeParse(await c.req.json());

    if (!result.success) {
      return c.json({ error: getSchemaError(result.error, "Invalid media asset.") }, 400);
    }

    const [updatedAsset] = await db
      .update(mediaAsset)
      .set({
        ...result.data,
        updatedAt: new Date(),
      })
      .where(eq(mediaAsset.id, c.req.param("id")))
      .returning();

    if (!updatedAsset) {
      return c.json({ error: "Media asset not found." }, 404);
    }

    return c.json({ asset: serializeMediaAsset(updatedAsset) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update media asset.";

    return c.json({ error: message }, 400);
  }
});

adminMediaRoutes.delete("/api/admin/media/:id", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const [deletedAsset] = await db
    .delete(mediaAsset)
    .where(eq(mediaAsset.id, c.req.param("id")))
    .returning();

  if (!deletedAsset) {
    return c.json({ error: "Media asset not found." }, 404);
  }

  await deleteObject(deletedAsset.objectKey).catch(() => null);

  return c.json({ asset: serializeMediaAsset(deletedAsset) });
});

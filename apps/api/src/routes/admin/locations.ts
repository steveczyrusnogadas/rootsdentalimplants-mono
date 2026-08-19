import {
  createAdminLocationPayloadSchema,
  updateAdminLocationPayloadSchema,
} from "@repo/types/admin/location";
import { and, asc, count, desc, eq, ilike, ne, or } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../../database/client";
import { location } from "../../database/schema";
import { serializeAdminLocation } from "../../locations/serialize";
import { adminAndManagerRoles, getAdminSession } from "../../shared/admin-session";
import { parseListQueryParams } from "./list-query";
import { getPaginationMeta, getPaginationOffset, parsePaginationParams } from "./pagination";

export const adminLocationRoutes = new Hono();

const locationSortColumns = {
  displayName: location.displayName,
  slug: location.slug,
  city: location.city,
  sortOrder: location.sortOrder,
  published: location.published,
  updatedAt: location.updatedAt,
} as const;
const locationSortKeys = Object.keys(locationSortColumns) as Array<keyof typeof locationSortColumns>;

function getSchemaError(error: { issues: Array<{ message: string }> }, fallback: string) {
  return error.issues[0]?.message ?? fallback;
}

function parsePublishedFilter(value: string | undefined) {
  if (!value || value === "all") {
    return null;
  }

  if (value === "published") {
    return true;
  }

  if (value === "unpublished") {
    return false;
  }

  return null;
}

async function ensureUniqueSlug(slug: string, id?: string) {
  const existing = await db.query.location.findFirst({
    where: id ? and(eq(location.slug, slug), ne(location.id, id)) : eq(location.slug, slug),
  });

  if (existing) {
    throw new Error("Slug is already in use.");
  }
}

async function clearDefaultCall(exceptId?: string) {
  if (exceptId) {
    await db
      .update(location)
      .set({ isDefaultCall: false, updatedAt: new Date() })
      .where(and(eq(location.isDefaultCall, true), ne(location.id, exceptId)));
    return;
  }

  await db.update(location).set({ isDefaultCall: false, updatedAt: new Date() }).where(eq(location.isDefaultCall, true));
}

adminLocationRoutes.get("/api/admin/locations", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const pagination = parsePaginationParams(c.req.query("page"), c.req.query("limit"));
  const listQuery = parseListQueryParams({
    search: c.req.query("search"),
    sortBy: c.req.query("sortBy"),
    sortDir: c.req.query("sortDir"),
    allowedSorts: locationSortKeys,
    defaultSortBy: "sortOrder",
  });
  const published = parsePublishedFilter(c.req.query("published"));
  const publishedFilter = published === null ? undefined : eq(location.published, published);
  const searchFilter = listQuery.search
    ? or(
        ilike(location.displayName, `%${listQuery.search}%`),
        ilike(location.slug, `%${listQuery.search}%`),
        ilike(location.city, `%${listQuery.search}%`),
        ilike(location.phone, `%${listQuery.search}%`),
      )
    : undefined;
  const filter =
    publishedFilter && searchFilter ? and(publishedFilter, searchFilter) : (publishedFilter ?? searchFilter);
  const sortColumn = locationSortColumns[listQuery.sortBy];
  const sortDir = c.req.query("sortDir") === "desc" ? "desc" : "asc";
  const orderBy = sortDir === "desc" ? desc(sortColumn) : asc(sortColumn);
  const [{ total }] = filter
    ? await db.select({ total: count() }).from(location).where(filter)
    : await db.select({ total: count() }).from(location);
  const records = filter
    ? await db
        .select()
        .from(location)
        .where(filter)
        .orderBy(orderBy, asc(location.displayName))
        .limit(pagination.pageSize)
        .offset(getPaginationOffset(pagination))
    : await db
        .select()
        .from(location)
        .orderBy(orderBy, asc(location.displayName))
        .limit(pagination.pageSize)
        .offset(getPaginationOffset(pagination));

  return c.json({
    locations: records.map(serializeAdminLocation),
    pagination: getPaginationMeta(total, pagination),
  });
});

adminLocationRoutes.get("/api/admin/locations/:id", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const record = await db.query.location.findFirst({
    where: eq(location.id, c.req.param("id")),
  });

  if (!record) {
    return c.json({ error: "Location not found." }, 404);
  }

  return c.json({ location: serializeAdminLocation(record) });
});

adminLocationRoutes.post("/api/admin/locations", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  try {
    const result = createAdminLocationPayloadSchema.safeParse(await c.req.json());

    if (!result.success) {
      return c.json({ error: getSchemaError(result.error, "Invalid location details.") }, 400);
    }

    await ensureUniqueSlug(result.data.slug);

    const existingDefault = await db.query.location.findFirst({
      where: eq(location.isDefaultCall, true),
    });
    const isDefaultCall = result.data.isDefaultCall || !existingDefault;

    if (isDefaultCall) {
      await clearDefaultCall();
    }

    const now = new Date();
    const [createdLocation] = await db
      .insert(location)
      .values({
        id: crypto.randomUUID(),
        slug: result.data.slug,
        displayName: result.data.displayName,
        street: result.data.street,
        suite: result.data.suite,
        city: result.data.city,
        region: result.data.region,
        postalCode: result.data.postalCode,
        phone: result.data.phone,
        weeklyHours: result.data.weeklyHours,
        lat: result.data.lat,
        lng: result.data.lng,
        sortOrder: result.data.sortOrder,
        published: result.data.published,
        isDefaultCall,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return c.json({ location: serializeAdminLocation(createdLocation) }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create location.";

    return c.json({ error: message }, 400);
  }
});

adminLocationRoutes.patch("/api/admin/locations/:id", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  try {
    const existingLocation = await db.query.location.findFirst({
      where: eq(location.id, c.req.param("id")),
    });

    if (!existingLocation) {
      return c.json({ error: "Location not found." }, 404);
    }

    const result = updateAdminLocationPayloadSchema.safeParse(await c.req.json());

    if (!result.success) {
      return c.json({ error: getSchemaError(result.error, "Invalid location details.") }, 400);
    }

    if (existingLocation.isDefaultCall && result.data.isDefaultCall === false) {
      return c.json({ error: "Exactly one Location must be the default Call." }, 400);
    }

    if (result.data.isDefaultCall) {
      await clearDefaultCall(existingLocation.id);
    }

    const updates: Partial<typeof location.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (result.data.displayName !== undefined) updates.displayName = result.data.displayName;
    if (result.data.street !== undefined) updates.street = result.data.street;
    if (result.data.suite !== undefined) updates.suite = result.data.suite;
    if (result.data.city !== undefined) updates.city = result.data.city;
    if (result.data.region !== undefined) updates.region = result.data.region;
    if (result.data.postalCode !== undefined) updates.postalCode = result.data.postalCode;
    if (result.data.phone !== undefined) updates.phone = result.data.phone;
    if (result.data.weeklyHours !== undefined) updates.weeklyHours = result.data.weeklyHours;
    if (result.data.lat !== undefined) updates.lat = result.data.lat;
    if (result.data.lng !== undefined) updates.lng = result.data.lng;
    if (result.data.sortOrder !== undefined) updates.sortOrder = result.data.sortOrder;
    if (result.data.published !== undefined) updates.published = result.data.published;
    if (result.data.isDefaultCall !== undefined) updates.isDefaultCall = result.data.isDefaultCall;

    const [updatedLocation] = await db
      .update(location)
      .set(updates)
      .where(eq(location.id, existingLocation.id))
      .returning();

    return c.json({ location: serializeAdminLocation(updatedLocation) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update location.";

    return c.json({ error: message }, 400);
  }
});

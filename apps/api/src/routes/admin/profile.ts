import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../../database/client";
import { user } from "../../database/schema";
import { adminAndManagerRoles, getAdminSession } from "../../shared/admin-session";
import { recordAdminAuditEvent } from "../../shared/audit";
import {
  createAvatarDownloadUrl,
  createAvatarUploadUrl,
  getAvatarImageUrl,
  isAllowedAvatarContentType,
  maxAvatarSizeBytes,
} from "../../storage/s3";

type AvatarUploadBody = {
  contentType?: unknown;
  size?: unknown;
};

type UpdateProfileBody = {
  name?: unknown;
  email?: unknown;
  image?: unknown;
};

export const adminProfileRoutes = new Hono();

function serializeProfile(record: typeof user.$inferSelect) {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    emailVerified: record.emailVerified,
    image: record.image,
    role: record.role ?? "manager",
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

function parseRequiredString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} is required.`);
  }

  return value.trim();
}

function parseAvatarImage(value: unknown, userId: string) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("Avatar image URL must be a string.");
  }

  const trimmed = value.trim();
  const expectedPrefix = getAvatarImageUrl(userId, 0).replace("?v=0", "");

  if (!trimmed.startsWith(expectedPrefix)) {
    throw new Error("Avatar image URL must come from the avatar upload flow.");
  }

  return trimmed;
}

adminProfileRoutes.get("/api/admin/profile", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const record = await db.query.user.findFirst({
    where: eq(user.id, admin.sessionUser.id),
  });

  if (!record) {
    return c.json({ error: "User not found." }, 404);
  }

  return c.json({ user: serializeProfile(record) });
});

adminProfileRoutes.patch("/api/admin/profile", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  try {
    const body = (await c.req.json()) as UpdateProfileBody;
    const name = parseRequiredString(body.name, "Name");
    const email = parseRequiredString(body.email, "Email");
    const image = parseAvatarImage(body.image, admin.sessionUser.id);
    const existingUser = await db.query.user.findFirst({
      where: eq(user.id, admin.sessionUser.id),
    });

    if (!existingUser) {
      return c.json({ error: "User not found." }, 404);
    }

    const [updatedUser] = await db
      .update(user)
      .set({
        name,
        email,
        ...(image !== undefined ? { image } : {}),
        updatedAt: new Date(),
      })
      .where(eq(user.id, admin.sessionUser.id))
      .returning();

    await recordAdminAuditEvent({
      actor: admin.sessionUser,
      action: "profile.updated",
      entityType: "profile",
      entityId: updatedUser.id,
      metadata: {
        before: {
          name: existingUser.name,
          email: existingUser.email,
          image: existingUser.image,
        },
        after: {
          name: updatedUser.name,
          email: updatedUser.email,
          image: updatedUser.image,
        },
      },
    });

    return c.json({ user: serializeProfile(updatedUser) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update profile.";

    return c.json({ error: message }, 400);
  }
});

adminProfileRoutes.post("/api/admin/profile/avatar-upload", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  try {
    const body = (await c.req.json()) as AvatarUploadBody;
    const contentType = parseRequiredString(body.contentType, "Content type");

    if (!isAllowedAvatarContentType(contentType)) {
      return c.json({ error: "Avatar must be a JPEG, PNG, WebP, or GIF image." }, 400);
    }

    if (typeof body.size !== "number" || body.size <= 0 || body.size > maxAvatarSizeBytes) {
      return c.json({ error: "Avatar must be smaller than 2 MB." }, 400);
    }

    const upload = await createAvatarUploadUrl({
      userId: admin.sessionUser.id,
      contentType,
    });

    await recordAdminAuditEvent({
      actor: admin.sessionUser,
      action: "profile.avatar_upload_prepared",
      entityType: "profile",
      entityId: admin.sessionUser.id,
      metadata: {
        contentType,
        size: body.size,
        key: upload.key,
      },
    });

    return c.json({
      ...upload,
      method: "PUT",
      maxSize: maxAvatarSizeBytes,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to prepare avatar upload.";

    return c.json({ error: message }, 400);
  }
});

adminProfileRoutes.get("/api/admin/users/:id/avatar", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const record = await db.query.user.findFirst({
    where: eq(user.id, c.req.param("id")),
  });

  if (!record?.image) {
    return c.json({ error: "Avatar not found." }, 404);
  }

  try {
    const downloadUrl = await createAvatarDownloadUrl(record.id);

    return c.redirect(downloadUrl, 302);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load avatar.";

    return c.json({ error: message }, 404);
  }
});

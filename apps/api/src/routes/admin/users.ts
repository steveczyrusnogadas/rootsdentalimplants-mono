import {
  createAdminUserPayloadSchema,
  updateAdminUserPayloadSchema,
  userRoleSchema,
  type AdminUser,
} from "@repo/types/admin/users";
import { asc, count, desc, eq, ilike, or } from "drizzle-orm";
import { Hono } from "hono";
import { auth } from "../../auth";
import { db } from "../../database/client";
import { user } from "../../database/schema";
import { getAdminSession } from "../../shared/admin-session";
import { recordAdminAuditEvent } from "../../shared/audit";
import { parseListQueryParams } from "./list-query";
import { getPaginationMeta, getPaginationOffset, parsePaginationParams } from "./pagination";

export const adminUsersRoutes = new Hono();
const userSortColumns = {
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
} as const;
const userSortKeys = Object.keys(userSortColumns) as Array<keyof typeof userSortColumns>;

function serializeUser(record: typeof user.$inferSelect): AdminUser {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    emailVerified: record.emailVerified,
    image: record.image,
    role: userRoleSchema.catch("manager").parse(record.role),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

function getSchemaError(error: { issues: Array<{ message: string }> }, fallback: string) {
  return error.issues[0]?.message ?? fallback;
}

adminUsersRoutes.get("/api/admin/users", async (c) => {
  const admin = await getAdminSession(c.req.raw);

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const pagination = parsePaginationParams(c.req.query("page"), c.req.query("limit"));
  const listQuery = parseListQueryParams({
    search: c.req.query("search"),
    sortBy: c.req.query("sortBy"),
    sortDir: c.req.query("sortDir"),
    allowedSorts: userSortKeys,
    defaultSortBy: "createdAt",
  });
  const searchFilter = listQuery.search
    ? or(ilike(user.name, `%${listQuery.search}%`), ilike(user.email, `%${listQuery.search}%`))
    : undefined;
  const sortColumn = userSortColumns[listQuery.sortBy];
  const orderBy = listQuery.sortDir === "asc" ? asc(sortColumn) : desc(sortColumn);
  const [{ total }] = searchFilter
    ? await db.select({ total: count() }).from(user).where(searchFilter)
    : await db.select({ total: count() }).from(user);
  const records = searchFilter
    ? await db
        .select()
        .from(user)
        .where(searchFilter)
        .orderBy(orderBy)
        .limit(pagination.pageSize)
        .offset(getPaginationOffset(pagination))
    : await db.select().from(user).orderBy(orderBy).limit(pagination.pageSize).offset(getPaginationOffset(pagination));

  return c.json({
    users: records.map(serializeUser),
    pagination: getPaginationMeta(total, pagination),
  });
});

adminUsersRoutes.post("/api/admin/users", async (c) => {
  const admin = await getAdminSession(c.req.raw);

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  try {
    const result = createAdminUserPayloadSchema.safeParse(await c.req.json());

    if (!result.success) {
      return c.json({ error: getSchemaError(result.error, "Invalid user details.") }, 400);
    }

    const { name, email, password, role } = result.data;

    const created = await auth.api.createUser({
      headers: c.req.raw.headers,
      body: {
        name,
        email,
        password,
        role,
      },
    });

    const createdUser = await db.query.user.findFirst({
      where: eq(user.email, created.user.email),
    });

    if (!createdUser) {
      return c.json({ error: "Failed to create user." }, 500);
    }

    await recordAdminAuditEvent({
      actor: admin.sessionUser,
      action: "user.created",
      entityType: "user",
      entityId: createdUser.id,
      metadata: {
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
      },
    });

    return c.json({ user: serializeUser(createdUser) }, 201);
  } catch (error) {
    console.error("Failed to create admin-managed user.", error);

    return c.json({ error: "Failed to create user." }, 400);
  }
});

adminUsersRoutes.patch("/api/admin/users/:id", async (c) => {
  const admin = await getAdminSession(c.req.raw);

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  try {
    const result = updateAdminUserPayloadSchema.safeParse(await c.req.json());

    if (!result.success) {
      return c.json({ error: getSchemaError(result.error, "Invalid user details.") }, 400);
    }

    const { name, email, role } = result.data;
    const existingUser = await db.query.user.findFirst({
      where: eq(user.id, c.req.param("id")),
    });

    if (!existingUser) {
      return c.json({ error: "User not found." }, 404);
    }

    const [updatedUser] = await db
      .update(user)
      .set({
        name,
        email,
        role,
        updatedAt: new Date(),
      })
      .where(eq(user.id, c.req.param("id")))
      .returning();

    await recordAdminAuditEvent({
      actor: admin.sessionUser,
      action: "user.updated",
      entityType: "user",
      entityId: updatedUser.id,
      metadata: {
        before: {
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
        },
        after: {
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      },
    });

    return c.json({ user: serializeUser(updatedUser) });
  } catch (error) {
    console.error("Failed to update admin-managed user.", error);

    return c.json({ error: "Failed to update user." }, 400);
  }
});

adminUsersRoutes.delete("/api/admin/users/:id", async (c) => {
  const admin = await getAdminSession(c.req.raw);

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  if (admin.sessionUser.id === c.req.param("id")) {
    return c.json({ error: "You cannot delete your own admin account." }, 400);
  }

  const [deletedUser] = await db
    .delete(user)
    .where(eq(user.id, c.req.param("id")))
    .returning();

  if (!deletedUser) {
    return c.json({ error: "User not found." }, 404);
  }

  await recordAdminAuditEvent({
    actor: admin.sessionUser,
    action: "user.deleted",
    entityType: "user",
    entityId: deletedUser.id,
    metadata: {
      name: deletedUser.name,
      email: deletedUser.email,
      role: deletedUser.role,
    },
  });

  return c.json({ user: serializeUser(deletedUser) });
});

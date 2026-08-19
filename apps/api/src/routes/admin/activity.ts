import type { AdminAuditEvent } from "@repo/types/admin/activity";
import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../../database/client";
import { adminAuditEvent } from "../../database/schema";
import { getAdminSession } from "../../shared/admin-session";
import { parseListQueryParams } from "./list-query";
import { getPaginationMeta, getPaginationOffset, parsePaginationParams } from "./pagination";

export const adminActivityRoutes = new Hono();

const activitySortColumns = {
  action: adminAuditEvent.action,
  entityType: adminAuditEvent.entityType,
  actorEmail: adminAuditEvent.actorEmail,
  createdAt: adminAuditEvent.createdAt,
} as const;
const activitySortKeys = Object.keys(activitySortColumns) as Array<keyof typeof activitySortColumns>;

function serializeAuditEvent(record: typeof adminAuditEvent.$inferSelect): AdminAuditEvent {
  return {
    id: record.id,
    action: record.action as AdminAuditEvent["action"],
    entityType: record.entityType as AdminAuditEvent["entityType"],
    entityId: record.entityId,
    actorUserId: record.actorUserId,
    actorEmail: record.actorEmail,
    actorRole: record.actorRole,
    metadata: record.metadata,
    createdAt: record.createdAt.toISOString(),
  };
}

adminActivityRoutes.get("/api/admin/activity", async (c) => {
  const admin = await getAdminSession(c.req.raw);

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const pagination = parsePaginationParams(c.req.query("page"), c.req.query("limit"));
  const listQuery = parseListQueryParams({
    search: c.req.query("search"),
    sortBy: c.req.query("sortBy"),
    sortDir: c.req.query("sortDir"),
    allowedSorts: activitySortKeys,
    defaultSortBy: "createdAt",
  });
  const action = c.req.query("action")?.trim();
  const entityType = c.req.query("entityType")?.trim();
  const conditions = [
    listQuery.search
      ? or(
          ilike(adminAuditEvent.action, `%${listQuery.search}%`),
          ilike(adminAuditEvent.entityType, `%${listQuery.search}%`),
          ilike(adminAuditEvent.entityId, `%${listQuery.search}%`),
          ilike(adminAuditEvent.actorEmail, `%${listQuery.search}%`),
        )
      : undefined,
    action ? eq(adminAuditEvent.action, action) : undefined,
    entityType ? eq(adminAuditEvent.entityType, entityType) : undefined,
  ].filter((condition) => condition !== undefined);
  const filter = conditions.length > 0 ? and(...conditions) : undefined;
  const sortColumn = activitySortColumns[listQuery.sortBy];
  const orderBy = listQuery.sortDir === "asc" ? asc(sortColumn) : desc(sortColumn);
  const [{ total }] = filter
    ? await db.select({ total: count() }).from(adminAuditEvent).where(filter)
    : await db.select({ total: count() }).from(adminAuditEvent);
  const records = filter
    ? await db
        .select()
        .from(adminAuditEvent)
        .where(filter)
        .orderBy(orderBy)
        .limit(pagination.pageSize)
        .offset(getPaginationOffset(pagination))
    : await db
        .select()
        .from(adminAuditEvent)
        .orderBy(orderBy)
        .limit(pagination.pageSize)
        .offset(getPaginationOffset(pagination));

  return c.json({
    events: records.map(serializeAuditEvent),
    pagination: getPaginationMeta(total, pagination),
  });
});

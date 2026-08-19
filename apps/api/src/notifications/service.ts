import { and, count, desc, eq, isNull } from "drizzle-orm";
import { db } from "../database/client";
import { adminNotification } from "../database/schema";
import { publishAdminNotification } from "./realtime";

export type CreateAdminNotificationInput = {
  type: string;
  title: string;
  body: string;
  entityType?: string | null;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
};

export function serializeAdminNotification(record: typeof adminNotification.$inferSelect) {
  return {
    id: record.id,
    type: record.type,
    title: record.title,
    body: record.body,
    entityType: record.entityType,
    entityId: record.entityId,
    metadata: record.metadata,
    readAt: record.readAt?.toISOString() ?? null,
    createdAt: record.createdAt.toISOString(),
  };
}

export async function createAdminNotification(input: CreateAdminNotificationInput) {
  const [notification] = await db
    .insert(adminNotification)
    .values({
      id: crypto.randomUUID(),
      type: input.type,
      title: input.title,
      body: input.body,
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
      metadata: input.metadata ?? {},
      readAt: null,
      createdAt: new Date(),
    })
    .returning();

  if (notification) {
    await publishAdminNotification(serializeAdminNotification(notification));
  }

  return notification;
}

export async function listAdminNotifications(limit = 20) {
  return db.select().from(adminNotification).orderBy(desc(adminNotification.createdAt)).limit(limit);
}

export async function countUnreadAdminNotifications() {
  const [{ total }] = await db
    .select({ total: count() })
    .from(adminNotification)
    .where(isNull(adminNotification.readAt));

  return total;
}

export async function markAdminNotificationRead(id: string) {
  const [notification] = await db
    .update(adminNotification)
    .set({ readAt: new Date() })
    .where(eq(adminNotification.id, id))
    .returning();

  return notification;
}

export async function markAllAdminNotificationsRead() {
  await db.update(adminNotification).set({ readAt: new Date() }).where(isNull(adminNotification.readAt));
}

export async function hasUnreadAdminNotificationForEntity(type: string, entityType: string, entityId: string) {
  const existing = await db.query.adminNotification.findFirst({
    where: and(
      eq(adminNotification.type, type),
      eq(adminNotification.entityType, entityType),
      eq(adminNotification.entityId, entityId),
      isNull(adminNotification.readAt),
    ),
  });

  return Boolean(existing);
}

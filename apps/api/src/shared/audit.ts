import type { AdminAuditAction, AdminAuditEntityType } from "@repo/types/admin/activity";
import { db } from "../database/client";
import { adminAuditEvent } from "../database/schema";
import type { SessionUser } from "./admin-session";

type AuditMetadata = Record<string, unknown>;

type RecordAdminAuditEventOptions = {
  actor: SessionUser;
  action: AdminAuditAction;
  entityType: AdminAuditEntityType;
  entityId?: string | null;
  metadata?: AuditMetadata;
};

export async function recordAdminAuditEvent({
  actor,
  action,
  entityType,
  entityId = null,
  metadata = {},
}: RecordAdminAuditEventOptions) {
  try {
    await db.insert(adminAuditEvent).values({
      id: crypto.randomUUID(),
      action,
      entityType,
      entityId,
      actorUserId: actor.id,
      actorEmail: actor.email ?? null,
      actorRole: actor.role ?? null,
      metadata,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Failed to record admin audit event.", error);
  }
}

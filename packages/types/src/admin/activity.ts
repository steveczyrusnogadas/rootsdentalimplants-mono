import { z } from "zod";
import { paginationMetaSchema } from "./users.js";

export const adminAuditActionSchema = z.enum([
  "user.created",
  "user.updated",
  "user.deleted",
  "lead.converted",
  "lead.updated",
  "lead.deleted",
  "contact.created",
  "contact.updated",
  "profile.updated",
  "profile.avatar_upload_prepared",
]);

export const adminAuditEntityTypeSchema = z.enum(["user", "lead", "contact", "profile"]);

export const adminAuditEventSchema = z.object({
  id: z.string(),
  action: adminAuditActionSchema,
  entityType: adminAuditEntityTypeSchema,
  entityId: z.string().nullable(),
  actorUserId: z.string().nullable(),
  actorEmail: z.string().nullable(),
  actorRole: z.string().nullable(),
  metadata: z.record(z.string(), z.unknown()),
  createdAt: z.string(),
});

export const adminAuditEventsResponseSchema = z.object({
  events: z.array(adminAuditEventSchema),
  pagination: paginationMetaSchema,
});

export type AdminAuditAction = z.infer<typeof adminAuditActionSchema>;
export type AdminAuditEntityType = z.infer<typeof adminAuditEntityTypeSchema>;
export type AdminAuditEvent = z.infer<typeof adminAuditEventSchema>;
export type AdminAuditEventsResponse = z.infer<typeof adminAuditEventsResponseSchema>;

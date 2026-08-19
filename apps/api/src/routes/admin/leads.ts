import { and, asc, count, desc, eq, ilike, isNotNull, isNull, or } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../../database/client";
import { contact, lead } from "../../database/schema";
import { adminAndManagerRoles, getAdminSession } from "../../shared/admin-session";
import { recordAdminAuditEvent } from "../../shared/audit";
import { parseListQueryParams } from "./list-query";
import { getPaginationMeta, getPaginationOffset, parsePaginationParams } from "./pagination";

type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "unqualified";
type LeadPriority = "low" | "normal" | "high" | "urgent";
type LeadsView = "active" | "archived" | "all";

type UpdateLeadBody = {
  status?: unknown;
  priority?: unknown;
  internalNotes?: unknown;
  archived?: unknown;
};

const leadStatuses: LeadStatus[] = ["new", "contacted", "qualified", "converted", "unqualified"];
const leadPriorities: LeadPriority[] = ["low", "normal", "high", "urgent"];
const statuses = new Set<LeadStatus>(leadStatuses);
const priorities = new Set<LeadPriority>(leadPriorities);
const views = new Set<LeadsView>(["active", "archived", "all"]);
const leadSortColumns = {
  name: lead.name,
  email: lead.email,
  status: lead.status,
  priority: lead.priority,
  source: lead.source,
  createdAt: lead.createdAt,
} as const;
const leadSortKeys = Object.keys(leadSortColumns) as Array<keyof typeof leadSortColumns>;

export const adminLeadsRoutes = new Hono();

function serializeLead(record: typeof lead.$inferSelect) {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    phone: record.phone,
    message: record.message,
    status: record.status as LeadStatus,
    priority: record.priority as LeadPriority,
    source: record.source,
    internalNotes: record.internalNotes,
    archivedAt: record.archivedAt?.toISOString() ?? null,
    convertedAt: record.convertedAt?.toISOString() ?? null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

function serializeConvertedContact(record: typeof contact.$inferSelect) {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
  };
}

function buildContactNotes(record: typeof lead.$inferSelect) {
  const sections = [`Lead message:\n${record.message}`];

  if (record.internalNotes) {
    sections.push(`Internal notes:\n${record.internalNotes}`);
  }

  return sections.join("\n\n");
}

function parseLeadStatus(value: unknown) {
  if (typeof value !== "string" || !statuses.has(value as LeadStatus)) {
    throw new Error("Status is invalid.");
  }

  return value as LeadStatus;
}

function parseLeadPriority(value: unknown) {
  if (typeof value !== "string" || !priorities.has(value as LeadPriority)) {
    throw new Error("Priority is invalid.");
  }

  return value as LeadPriority;
}

function parseOptionalString(value: unknown, field: string, maxLength: number) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error(`${field} is invalid.`);
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return null;
  }

  if (trimmed.length > maxLength) {
    throw new Error(`${field} is too long.`);
  }

  return trimmed;
}

function parseView(value: string | undefined): LeadsView {
  return value && views.has(value as LeadsView) ? (value as LeadsView) : "active";
}

function getLeadFilter(view: LeadsView) {
  if (view === "archived") {
    return isNotNull(lead.archivedAt);
  }

  if (view === "active") {
    return isNull(lead.archivedAt);
  }

  return undefined;
}

adminLeadsRoutes.get("/api/admin/leads", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const view = parseView(c.req.query("view"));
  const pagination = parsePaginationParams(c.req.query("page"), c.req.query("limit"));
  const listQuery = parseListQueryParams({
    search: c.req.query("search"),
    sortBy: c.req.query("sortBy"),
    sortDir: c.req.query("sortDir"),
    allowedSorts: leadSortKeys,
    defaultSortBy: "createdAt",
  });
  const viewFilter = getLeadFilter(view);
  const searchFilter = listQuery.search
    ? or(
        ilike(lead.name, `%${listQuery.search}%`),
        ilike(lead.email, `%${listQuery.search}%`),
        ilike(lead.phone, `%${listQuery.search}%`),
        ilike(lead.message, `%${listQuery.search}%`),
        ilike(lead.source, `%${listQuery.search}%`),
      )
    : undefined;
  const filter = viewFilter && searchFilter ? and(viewFilter, searchFilter) : (viewFilter ?? searchFilter);
  const sortColumn = leadSortColumns[listQuery.sortBy];
  const orderBy = listQuery.sortDir === "asc" ? asc(sortColumn) : desc(sortColumn);
  const [{ total }] = filter
    ? await db.select({ total: count() }).from(lead).where(filter)
    : await db.select({ total: count() }).from(lead);
  const records = filter
    ? await db
        .select()
        .from(lead)
        .where(filter)
        .orderBy(orderBy)
        .limit(pagination.pageSize)
        .offset(getPaginationOffset(pagination))
    : await db
        .select()
        .from(lead)
        .orderBy(orderBy)
        .limit(pagination.pageSize)
        .offset(getPaginationOffset(pagination));

  return c.json({
    leads: records.map(serializeLead),
    pagination: getPaginationMeta(total, pagination),
  });
});

adminLeadsRoutes.get("/api/admin/leads/stats", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const records = await db.select().from(lead).orderBy(desc(lead.createdAt));
  const activeLeads = records.filter((record) => !record.archivedAt);
  const archivedCount = records.length - activeLeads.length;
  const byStatus = Object.fromEntries(leadStatuses.map((status) => [status, 0])) as Record<LeadStatus, number>;
  const byPriority = Object.fromEntries(leadPriorities.map((priority) => [priority, 0])) as Record<LeadPriority, number>;

  for (const record of activeLeads) {
    if (statuses.has(record.status as LeadStatus)) {
      byStatus[record.status as LeadStatus] += 1;
    }

    if (priorities.has(record.priority as LeadPriority)) {
      byPriority[record.priority as LeadPriority] += 1;
    }
  }

  return c.json({
    stats: {
      total: activeLeads.length,
      archived: archivedCount,
      byStatus,
      byPriority,
      recent: activeLeads.slice(0, 5).map(serializeLead),
    },
  });
});

adminLeadsRoutes.get("/api/admin/leads/:id", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const record = await db.query.lead.findFirst({
    where: eq(lead.id, c.req.param("id")),
  });

  if (!record) {
    return c.json({ error: "Lead not found." }, 404);
  }

  const convertedContact = await db.query.contact.findFirst({
    where: eq(contact.sourceLeadId, record.id),
  });

  return c.json({
    lead: {
      ...serializeLead(record),
      convertedContact: convertedContact ? serializeConvertedContact(convertedContact) : null,
    },
  });
});

adminLeadsRoutes.patch("/api/admin/leads/:id", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  try {
    const body = (await c.req.json()) as UpdateLeadBody;
    const existingLead = await db.query.lead.findFirst({
      where: eq(lead.id, c.req.param("id")),
    });

    if (!existingLead) {
      return c.json({ error: "Lead not found." }, 404);
    }

    const updates: Partial<typeof lead.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (body.status !== undefined) {
      updates.status = parseLeadStatus(body.status);
    }

    if (body.priority !== undefined) {
      updates.priority = parseLeadPriority(body.priority);
    }

    if (body.internalNotes !== undefined) {
      updates.internalNotes = parseOptionalString(body.internalNotes, "Internal notes", 4000);
    }

    if (body.archived !== undefined) {
      if (typeof body.archived !== "boolean") {
        throw new Error("Archived is invalid.");
      }

      updates.archivedAt = body.archived ? new Date() : null;
    }

    const shouldConvert = updates.status === "converted";
    const now = new Date();

    if (shouldConvert && !existingLead.convertedAt) {
      updates.convertedAt = now;
    }

    if (shouldConvert) {
      updates.archivedAt = existingLead.archivedAt ?? now;
    }

    const { updatedLead, convertedContact } = await db.transaction(async (tx) => {
      let convertedContact: typeof contact.$inferSelect | null = null;

      if (shouldConvert) {
        convertedContact =
          (await tx.query.contact.findFirst({
            where: eq(contact.sourceLeadId, existingLead.id),
          })) ?? null;

        if (!convertedContact) {
          const [createdContact] = await tx
            .insert(contact)
            .values({
              id: crypto.randomUUID(),
              name: existingLead.name,
              email: existingLead.email,
              phone: existingLead.phone,
              kind: "contact",
              source: "lead_conversion",
              sourceLeadId: existingLead.id,
              notes: buildContactNotes(existingLead),
              tags: ["converted-lead"],
              createdAt: now,
              updatedAt: now,
            })
            .returning();

          convertedContact = createdContact;
        }
      }

      const [updatedLead] = await tx.update(lead).set(updates).where(eq(lead.id, c.req.param("id"))).returning();

      return { updatedLead, convertedContact };
    });

    await recordAdminAuditEvent({
      actor: admin.sessionUser,
      action: "lead.updated",
      entityType: "lead",
      entityId: updatedLead.id,
      metadata: {
        before: {
          status: existingLead.status,
          priority: existingLead.priority,
          internalNotes: existingLead.internalNotes,
          archivedAt: existingLead.archivedAt?.toISOString() ?? null,
        },
        after: {
          status: updatedLead.status,
          priority: updatedLead.priority,
          internalNotes: updatedLead.internalNotes,
          archivedAt: updatedLead.archivedAt?.toISOString() ?? null,
          convertedAt: updatedLead.convertedAt?.toISOString() ?? null,
        },
      },
    });

    if (shouldConvert && convertedContact) {
      await recordAdminAuditEvent({
        actor: admin.sessionUser,
        action: "lead.converted",
        entityType: "lead",
        entityId: updatedLead.id,
        metadata: {
          contactId: convertedContact.id,
          contactEmail: convertedContact.email,
        },
      });
    }

    return c.json({
      lead: {
        ...serializeLead(updatedLead),
        convertedContact: convertedContact ? serializeConvertedContact(convertedContact) : null,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update lead.";

    return c.json({ error: message }, 400);
  }
});

adminLeadsRoutes.delete("/api/admin/leads/:id", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const [deletedLead] = await db.delete(lead).where(eq(lead.id, c.req.param("id"))).returning();

  if (!deletedLead) {
    return c.json({ error: "Lead not found." }, 404);
  }

  await recordAdminAuditEvent({
    actor: admin.sessionUser,
    action: "lead.deleted",
    entityType: "lead",
    entityId: deletedLead.id,
    metadata: {
      name: deletedLead.name,
      email: deletedLead.email,
      status: deletedLead.status,
      priority: deletedLead.priority,
    },
  });

  return c.json({ lead: serializeLead(deletedLead) });
});

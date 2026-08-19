import { asc, count, desc, eq, ilike, or } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../../database/client";
import { contact, lead } from "../../database/schema";
import { adminAndManagerRoles, getAdminSession } from "../../shared/admin-session";
import { recordAdminAuditEvent } from "../../shared/audit";
import { parseListQueryParams } from "./list-query";
import { getPaginationMeta, getPaginationOffset, parsePaginationParams } from "./pagination";

type UpdateContactBody = {
  kind?: unknown;
  notes?: unknown;
  tags?: unknown;
};

type CreateContactBody = UpdateContactBody & {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
};

export const adminContactsRoutes = new Hono();

const contactSortColumns = {
  name: contact.name,
  email: contact.email,
  kind: contact.kind,
  source: contact.source,
  createdAt: contact.createdAt,
} as const;
const contactSortKeys = Object.keys(contactSortColumns) as Array<keyof typeof contactSortColumns>;

function serializeContact(record: typeof contact.$inferSelect, sourceLead?: typeof lead.$inferSelect | null) {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    phone: record.phone,
    kind: record.kind,
    source: record.source,
    sourceLeadId: record.sourceLeadId,
    sourceLead: sourceLead
      ? {
          id: sourceLead.id,
          name: sourceLead.name,
          email: sourceLead.email,
          status: sourceLead.status,
          createdAt: sourceLead.createdAt.toISOString(),
        }
      : null,
    notes: record.notes,
    tags: record.tags,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
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

function parseRequiredString(value: unknown, field: string, maxLength: number) {
  const parsed = parseOptionalString(value, field, maxLength);

  if (!parsed) {
    throw new Error(`${field} is required.`);
  }

  return parsed;
}

function parseTags(value: unknown) {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error("Tags are invalid.");
  }

  return value.map((item) => item.trim()).filter(Boolean).slice(0, 20);
}

adminContactsRoutes.post("/api/admin/contacts", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  try {
    const body = (await c.req.json()) as CreateContactBody;
    const now = new Date();
    const name = parseRequiredString(body.name, "Name", 160);
    const email = parseRequiredString(body.email, "Email", 320);
    const kind = body.kind === undefined ? "contact" : parseRequiredString(body.kind, "Type", 80);
    const tags = parseTags(body.tags) ?? [];
    const [createdContact] = await db
      .insert(contact)
      .values({
        id: crypto.randomUUID(),
        name,
        email,
        phone: parseOptionalString(body.phone, "Phone", 80),
        kind,
        source: "manual",
        sourceLeadId: null,
        notes: parseOptionalString(body.notes, "Notes", 4000),
        tags,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    await recordAdminAuditEvent({
      actor: admin.sessionUser,
      action: "contact.created",
      entityType: "contact",
      entityId: createdContact.id,
      metadata: {
        name: createdContact.name,
        email: createdContact.email,
        kind: createdContact.kind,
        source: createdContact.source,
      },
    });

    return c.json({ contact: serializeContact(createdContact) }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create contact.";

    return c.json({ error: message }, 400);
  }
});

adminContactsRoutes.get("/api/admin/contacts", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const pagination = parsePaginationParams(c.req.query("page"), c.req.query("limit"));
  const listQuery = parseListQueryParams({
    search: c.req.query("search"),
    sortBy: c.req.query("sortBy"),
    sortDir: c.req.query("sortDir"),
    allowedSorts: contactSortKeys,
    defaultSortBy: "createdAt",
  });
  const searchFilter = listQuery.search
    ? or(
        ilike(contact.name, `%${listQuery.search}%`),
        ilike(contact.email, `%${listQuery.search}%`),
        ilike(contact.phone, `%${listQuery.search}%`),
        ilike(contact.kind, `%${listQuery.search}%`),
        ilike(contact.source, `%${listQuery.search}%`),
      )
    : undefined;
  const sortColumn = contactSortColumns[listQuery.sortBy];
  const orderBy = listQuery.sortDir === "asc" ? asc(sortColumn) : desc(sortColumn);
  const [{ total }] = searchFilter
    ? await db.select({ total: count() }).from(contact).where(searchFilter)
    : await db.select({ total: count() }).from(contact);
  const records = searchFilter
    ? await db
        .select()
        .from(contact)
        .where(searchFilter)
        .orderBy(orderBy)
        .limit(pagination.pageSize)
        .offset(getPaginationOffset(pagination))
    : await db
        .select()
        .from(contact)
        .orderBy(orderBy)
        .limit(pagination.pageSize)
        .offset(getPaginationOffset(pagination));

  return c.json({
    contacts: records.map((record) => serializeContact(record)),
    pagination: getPaginationMeta(total, pagination),
  });
});

adminContactsRoutes.get("/api/admin/contacts/:id", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const record = await db.query.contact.findFirst({
    where: eq(contact.id, c.req.param("id")),
  });

  if (!record) {
    return c.json({ error: "Contact not found." }, 404);
  }

  const sourceLead = record.sourceLeadId
    ? await db.query.lead.findFirst({
        where: eq(lead.id, record.sourceLeadId),
      })
    : null;

  return c.json({ contact: serializeContact(record, sourceLead) });
});

adminContactsRoutes.patch("/api/admin/contacts/:id", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  try {
    const body = (await c.req.json()) as UpdateContactBody;
    const existingContact = await db.query.contact.findFirst({
      where: eq(contact.id, c.req.param("id")),
    });

    if (!existingContact) {
      return c.json({ error: "Contact not found." }, 404);
    }

    const updates: Partial<typeof contact.$inferInsert> = {
      updatedAt: new Date(),
    };
    const tags = parseTags(body.tags);

    if (body.kind !== undefined) {
      updates.kind = parseRequiredString(body.kind, "Type", 80);
    }

    if (body.notes !== undefined) {
      updates.notes = parseOptionalString(body.notes, "Notes", 4000);
    }

    if (tags !== undefined) {
      updates.tags = tags;
    }

    const [updatedContact] = await db.update(contact).set(updates).where(eq(contact.id, c.req.param("id"))).returning();

    await recordAdminAuditEvent({
      actor: admin.sessionUser,
      action: "contact.updated",
      entityType: "contact",
      entityId: updatedContact.id,
      metadata: {
        before: {
          kind: existingContact.kind,
          notes: existingContact.notes,
          tags: existingContact.tags,
        },
        after: {
          kind: updatedContact.kind,
          notes: updatedContact.notes,
          tags: updatedContact.tags,
        },
      },
    });

    return c.json({ contact: serializeContact(updatedContact) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update contact.";

    return c.json({ error: message }, 400);
  }
});

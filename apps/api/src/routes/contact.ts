import { Hono } from "hono";
import { db } from "../database/client";
import { lead } from "../database/schema";
import { emitDomainEvent } from "../events/emit-event";
import { createRateLimitMiddleware, getRateLimitConfig } from "../server/rate-limit";

type ContactBody = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
  website?: unknown;
};

export const contactRoutes = new Hono();
const rateLimitConfig = getRateLimitConfig();

contactRoutes.use(
  "/api/contact",
  createRateLimitMiddleware({
    name: "contact",
    limit: rateLimitConfig.contact.limit,
    windowMs: rateLimitConfig.contact.windowMs,
    methods: ["POST"],
  }),
);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseRequiredString(value: unknown, field: string, maxLength: number) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} is required.`);
  }

  const trimmed = value.trim();

  if (trimmed.length > maxLength) {
    throw new Error(`${field} is too long.`);
  }

  return trimmed;
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

contactRoutes.post("/api/contact", async (c) => {
  try {
    const body = (await c.req.json()) as ContactBody;
    const website = parseOptionalString(body.website, "Website", 255);

    if (website) {
      return c.json({ ok: true }, 201);
    }

    const name = parseRequiredString(body.name, "Name", 120);
    const email = parseRequiredString(body.email, "Email", 254).toLowerCase();
    const phone = parseOptionalString(body.phone, "Phone", 40);
    const message = parseRequiredString(body.message, "Message", 4000);

    if (!emailPattern.test(email)) {
      throw new Error("Email is invalid.");
    }

    const now = new Date();

    const [newLead] = await db
      .insert(lead)
      .values({
        id: crypto.randomUUID(),
        name,
        email,
        phone,
        message,
        status: "new",
        priority: "normal",
        source: "contact_form",
        internalNotes: null,
        archivedAt: null,
        createdAt: now,
        updatedAt: now,
      })
      .returning({ id: lead.id });

    if (newLead) {
      await emitDomainEvent("lead.created", { leadId: newLead.id });
    }

    return c.json({ ok: true }, 201);
  } catch {
    return c.json({ error: "Please check the form and try again." }, 400);
  }
});

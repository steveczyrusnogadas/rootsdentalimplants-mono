import { eq, sql } from "drizzle-orm";
import { db } from "../database/client";
import { domainEvent } from "../database/schema";
import { getEventHandlers } from "./handlers";
import type { DomainEventHandler } from "./handlers";
import type { DomainEventMap, DomainEventName } from "./event-types";

function isDomainEventName(name: string): name is DomainEventName {
  return name === "lead.created" || name === "document.indexed" || name === "document.indexing_failed";
}

export async function dispatchDomainEvent(eventId: string) {
  const record = await db.query.domainEvent.findFirst({
    where: eq(domainEvent.id, eventId),
  });

  if (!record) {
    throw new Error(`Domain event ${eventId} was not found.`);
  }

  if (record.status === "completed") {
    return;
  }

  if (!isDomainEventName(record.name)) {
    throw new Error(`No domain event type registered for ${record.name}.`);
  }

  const eventName = record.name;

  await db
    .update(domainEvent)
    .set({
      status: "processing",
      attempts: sql`${domainEvent.attempts} + 1`,
      error: null,
      updatedAt: new Date(),
    })
    .where(eq(domainEvent.id, eventId));

  try {
    const handlers = getEventHandlers(eventName);

    for (const handler of handlers) {
      await (handler as DomainEventHandler<typeof eventName>)(record.payload as DomainEventMap[typeof eventName], {
        eventId,
        name: eventName,
      });
    }

    await db
      .update(domainEvent)
      .set({
        status: "completed",
        processedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(domainEvent.id, eventId));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to dispatch domain event.";

    await db
      .update(domainEvent)
      .set({
        status: "failed",
        error: message,
        updatedAt: new Date(),
      })
      .where(eq(domainEvent.id, eventId));

    throw error;
  }
}

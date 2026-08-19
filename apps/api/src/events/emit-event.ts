import { eq } from "drizzle-orm";
import { db } from "../database/client";
import { domainEvent } from "../database/schema";
import { dispatchJob } from "../jobs/dispatch-job";
import type { DomainEventMap, DomainEventName } from "./event-types";

export async function emitDomainEvent<TName extends DomainEventName>(name: TName, payload: DomainEventMap[TName]) {
  const eventId = crypto.randomUUID();
  const now = new Date();

  await db.insert(domainEvent).values({
    id: eventId,
    name,
    payload,
    status: "pending",
    attempts: 0,
    error: null,
    createdAt: now,
    updatedAt: now,
    processedAt: null,
  });

  try {
    await dispatchJob(
      "events.dispatch",
      { eventId },
      {
        jobId: `event-${eventId}`,
      },
    );

    await db
      .update(domainEvent)
      .set({
        status: "queued",
        updatedAt: new Date(),
      })
      .where(eq(domainEvent.id, eventId));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to enqueue event.";

    await db
      .update(domainEvent)
      .set({
        error: message,
        updatedAt: new Date(),
      })
      .where(eq(domainEvent.id, eventId));

    console.error(`Failed to enqueue domain event ${eventId}`, error);
  }

  return eventId;
}

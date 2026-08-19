import { dispatchJob } from "../jobs/dispatch-job";
import type { DomainEventMap, DomainEventName } from "./event-types";

type EventContext<TName extends DomainEventName> = {
  eventId: string;
  name: TName;
};

export type DomainEventHandler<TName extends DomainEventName> = (
  payload: DomainEventMap[TName],
  context: EventContext<TName>,
) => Promise<void>;

const handlers = {
  "lead.created": [handleLeadCreated],
} satisfies {
  [TName in DomainEventName]: Array<DomainEventHandler<TName>>;
};

async function handleLeadCreated(payload: DomainEventMap["lead.created"], context: EventContext<"lead.created">) {
  await dispatchJob(
    "notifications.create-admin",
    {
      type: "lead.created",
      title: "New lead",
      body: "Submitted via the contact form.",
      entityType: "lead",
      entityId: payload.leadId,
      metadata: {
        eventId: context.eventId,
        leadId: payload.leadId,
      },
    },
    {
      jobId: `notification-lead-created-${payload.leadId}`,
    },
  );
}

export function getEventHandlers<TName extends DomainEventName>(name: TName) {
  return handlers[name];
}

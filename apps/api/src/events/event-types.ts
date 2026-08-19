export type DomainEventMap = {
  "lead.created": {
    leadId: string;
  };
};

export type DomainEventName = keyof DomainEventMap;
export type DomainEventPayload<TName extends DomainEventName = DomainEventName> = DomainEventMap[TName];

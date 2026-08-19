import type { JobsOptions } from "bullmq";
import { queues, type QueueName } from "./queues";

export type JobPayloadMap = {
  "events.dispatch": {
    eventId: string;
  };
  "email.send-password-reset": {
    userId: string;
    email: string;
    resetUrl: string;
    token: string;
  };
  "email.send-two-factor-otp": {
    userId: string;
    email: string;
    otp: string;
  };
  "notifications.create-admin": {
    type: string;
    title: string;
    body: string;
    entityType?: string | null;
    entityId?: string | null;
    metadata?: Record<string, unknown>;
  };
};

export type JobName = keyof JobPayloadMap;

const jobQueues: Record<JobName, QueueName> = {
  "events.dispatch": "events",
  "email.send-password-reset": "email",
  "email.send-two-factor-otp": "email",
  "notifications.create-admin": "notifications",
};

export async function dispatchJob<TName extends JobName>(
  name: TName,
  payload: JobPayloadMap[TName],
  options: JobsOptions = {},
) {
  const queue = queues[jobQueues[name]];

  return queue.add(name, payload, options);
}

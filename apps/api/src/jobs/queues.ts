import { Queue, type JobsOptions } from "bullmq";
import { getRedisConnection } from "./redis";

export const queueNames = {
  events: "events",
  email: "email",
  notifications: "notifications",
} as const;

export type QueueName = keyof typeof queueNames;

const connection = getRedisConnection();
const defaultJobOptions: JobsOptions = {
  attempts: 5,
  backoff: {
    type: "exponential",
    delay: 1000,
  },
  removeOnComplete: {
    age: 60 * 60 * 24,
    count: 1000,
  },
  removeOnFail: {
    age: 60 * 60 * 24 * 7,
  },
};

export const queues = {
  events: new Queue(queueNames.events, {
    connection,
    defaultJobOptions,
  }),
  email: new Queue(queueNames.email, {
    connection,
    defaultJobOptions: {
      ...defaultJobOptions,
      attempts: 5,
    },
  }),
  notifications: new Queue(queueNames.notifications, {
    connection,
    defaultJobOptions,
  }),
};

export async function closeQueues() {
  await Promise.all(Object.values(queues).map((queue) => queue.close()));
}

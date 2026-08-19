import { Worker } from "bullmq";
import { getRedisConnection } from "./redis";
import { processRegisteredJob } from "./registry";
import { queueNames } from "./queues";

const connection = getRedisConnection();

export function startWorkers() {
  const workers = [
    new Worker(queueNames.events, processRegisteredJob, {
      connection,
      concurrency: Number(process.env.EVENT_WORKER_CONCURRENCY ?? "5"),
    }),
    new Worker(queueNames.email, processRegisteredJob, {
      connection,
      concurrency: Number(process.env.EMAIL_WORKER_CONCURRENCY ?? "3"),
      limiter: {
        max: Number(process.env.EMAIL_WORKER_RATE_LIMIT_MAX ?? "5"),
        duration: Number(process.env.EMAIL_WORKER_RATE_LIMIT_DURATION_MS ?? "1000"),
      },
    }),
    new Worker(queueNames.notifications, processRegisteredJob, {
      connection,
      concurrency: Number(process.env.NOTIFICATION_WORKER_CONCURRENCY ?? "10"),
    }),
  ];

  for (const worker of workers) {
    worker.on("failed", (job, error) => {
      console.error(`Job ${job?.name ?? "unknown"} failed`, error);
    });
  }

  return workers;
}

export async function closeWorkers(workers: Worker[]) {
  await Promise.all(workers.map((worker) => worker.close()));
}

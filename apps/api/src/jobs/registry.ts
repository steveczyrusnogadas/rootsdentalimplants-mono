import type { Job } from "bullmq";
import { dispatchDomainEvent } from "../events/dispatch-domain-event";
import { processSendPasswordResetJob } from "./email/send-password-reset";
import { processSendTwoFactorOtpJob } from "./email/send-two-factor-otp";
import { processCreateAdminNotificationJob } from "./notifications/create-admin-notification";
import type { JobName, JobPayloadMap } from "./dispatch-job";

type JobProcessor<TName extends JobName> = (job: Job<JobPayloadMap[TName]>) => Promise<void>;

const processors = {
  "events.dispatch": async (job) => dispatchDomainEvent(job.data.eventId),
  "email.send-password-reset": processSendPasswordResetJob,
  "email.send-two-factor-otp": processSendTwoFactorOtpJob,
  "notifications.create-admin": processCreateAdminNotificationJob,
} satisfies {
  [TName in JobName]: JobProcessor<TName>;
};

export async function processRegisteredJob(job: Job) {
  const processor = processors[job.name as JobName];

  if (!processor) {
    throw new Error(`No processor registered for job ${job.name}.`);
  }

  await processor(job as never);
}

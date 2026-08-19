import type { Job } from "bullmq";
import { createAdminNotification, hasUnreadAdminNotificationForEntity } from "../../notifications/service";
import type { JobPayloadMap } from "../dispatch-job";

export async function processCreateAdminNotificationJob(job: Job<JobPayloadMap["notifications.create-admin"]>) {
  if (job.data.entityType && job.data.entityId) {
    const hasExisting = await hasUnreadAdminNotificationForEntity(job.data.type, job.data.entityType, job.data.entityId);

    if (hasExisting) {
      return;
    }
  }

  await createAdminNotification(job.data);
}

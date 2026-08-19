import { UnrecoverableError, type Job } from "bullmq";
import { renderPasswordResetEmail } from "../../email/templates/password-reset";
import { EmailSendError, sendEmail } from "../../email/send-email";
import type { JobPayloadMap } from "../dispatch-job";

async function hashToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function processSendPasswordResetJob(job: Job<JobPayloadMap["email.send-password-reset"]>) {
  const template = renderPasswordResetEmail({
    resetUrl: job.data.resetUrl,
  });
  const tokenHash = await hashToken(job.data.token);

  try {
    await sendEmail({
      to: job.data.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      idempotencyKey: `password-reset/${tokenHash}`,
    });
  } catch (error) {
    if (error instanceof EmailSendError && !error.retryable) {
      throw new UnrecoverableError(error.message);
    }

    throw error;
  }
}

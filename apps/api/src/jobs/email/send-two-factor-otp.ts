import { UnrecoverableError, type Job } from "bullmq";
import { EmailSendError, sendEmail } from "../../email/send-email";
import { renderTwoFactorOtpEmail } from "../../email/templates/two-factor-otp";
import type { JobPayloadMap } from "../dispatch-job";

async function hashOtp(input: { userId: string; otp: string }) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${input.userId}:${input.otp}`),
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function processSendTwoFactorOtpJob(job: Job<JobPayloadMap["email.send-two-factor-otp"]>) {
  const template = renderTwoFactorOtpEmail({
    otp: job.data.otp,
  });
  const otpHash = await hashOtp({
    userId: job.data.userId,
    otp: job.data.otp,
  });

  try {
    await sendEmail({
      to: job.data.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      idempotencyKey: `two-factor-otp/${otpHash}`,
    });
  } catch (error) {
    if (error instanceof EmailSendError && !error.retryable) {
      throw new UnrecoverableError(error.message);
    }

    throw error;
  }
}

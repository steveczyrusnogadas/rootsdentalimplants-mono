import { getResendClient } from "./resend";

type SendEmailInput = {
  from?: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  idempotencyKey: string;
};

export class EmailSendError extends Error {
  retryable: boolean;

  constructor(message: string, retryable: boolean) {
    super(message);
    this.name = "EmailSendError";
    this.retryable = retryable;
  }
}

function isRetryableResendError(error: unknown) {
  const statusCode =
    typeof error === "object" && error !== null && "statusCode" in error ? Number(error.statusCode) : undefined;

  return statusCode === 429 || (statusCode !== undefined && statusCode >= 500);
}

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Failed to send email.";
}

export async function sendEmail(input: SendEmailInput) {
  const resend = getResendClient();
  const from = input.from ?? process.env.RESEND_FROM_EMAIL;

  if (!from) {
    throw new EmailSendError("RESEND_FROM_EMAIL is not configured.", false);
  }

  const { data, error } = await resend.emails.send(
    {
      from,
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    },
    {
      idempotencyKey: input.idempotencyKey,
    },
  );

  if (error) {
    throw new EmailSendError(getErrorMessage(error), isRetryableResendError(error));
  }

  return data;
}

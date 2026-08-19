import { Resend } from "resend";

let client: Resend | null = null;

export function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  client ??= new Resend(process.env.RESEND_API_KEY);

  return client;
}

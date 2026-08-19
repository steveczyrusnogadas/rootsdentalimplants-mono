type TwoFactorOtpTemplateInput = {
  otp: string;
};

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function renderTwoFactorOtpEmail(input: TwoFactorOtpTemplateInput) {
  const otp = escapeHtml(input.otp);

  return {
    subject: "Your Baseplate sign-in code",
    text: `Your Baseplate sign-in code is ${input.otp}.\n\nThis code expires soon. If you did not try to sign in, change your password immediately.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h1 style="font-size: 20px;">Your sign-in code</h1>
        <p>Use this code to finish signing in to Baseplate.</p>
        <p style="font-size: 28px; letter-spacing: 6px; font-weight: 700;">${otp}</p>
        <p>This code expires soon. If you did not try to sign in, change your password immediately.</p>
      </div>
    `,
  };
}

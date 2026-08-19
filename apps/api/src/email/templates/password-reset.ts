type PasswordResetTemplateInput = {
  resetUrl: string;
};

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function renderPasswordResetEmail(input: PasswordResetTemplateInput) {
  const resetUrl = escapeHtml(input.resetUrl);

  return {
    subject: "Reset your Baseplate password",
    text: `Reset your Baseplate password by opening this link: ${input.resetUrl}\n\nThis link expires soon. If you did not request a password reset, you can ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h1 style="font-size: 20px;">Reset your password</h1>
        <p>Use the button below to reset your Baseplate password.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; background: #111827; color: #ffffff; padding: 10px 16px; text-decoration: none;">
            Reset password
          </a>
        </p>
        <p>If the button does not work, copy and paste this URL into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you did not request a password reset, you can ignore this email.</p>
      </div>
    `,
  };
}

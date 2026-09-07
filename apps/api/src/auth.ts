import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, twoFactor } from "better-auth/plugins";
import { ac, authRoles } from "./auth/permissions";
import { getAppOrigins } from "./config/origins";
import { db } from "./database/client";
import * as schema from "./database/schema";
import { dispatchJob } from "./jobs/dispatch-job";
import { getAdminSettings } from "./settings/admin-settings";

export const auth = betterAuth({
  appName: "Baseplate",
  advanced: {
    cookiePrefix: process.env.BETTER_AUTH_COOKIE_PREFIX || "better-auth",
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url, token }) => {
      void dispatchJob("email.send-password-reset", {
        userId: user.id,
        email: user.email,
        resetUrl: url,
        token,
      }).catch((error) => {
        console.error("Failed to enqueue password reset email.", error);
      });
    },
  },
  plugins: [
    admin({
      ac,
      roles: authRoles,
      defaultRole: "manager",
      adminRoles: ["admin"],
    }),
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }) {
          const settings = await getAdminSettings(user.id);

          if (!settings.emailOtpEnabled) {
            throw new Error("Email OTP is not enabled for this account.");
          }

          await dispatchJob(
            "email.send-two-factor-otp",
            {
              userId: user.id,
              email: user.email,
              otp,
            },
            {
              jobId: `two-factor-otp-${user.id}-${otp}`,
            },
          );
        },
      },
    }),
  ],
  trustedOrigins: getAppOrigins(),
});

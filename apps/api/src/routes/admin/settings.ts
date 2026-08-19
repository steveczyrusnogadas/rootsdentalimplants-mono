import {
  disableAdminTotpPayloadSchema,
  updateAdminEmailOtpPayloadSchema,
  updateAdminNotificationPreferencesPayloadSchema,
  type AdminSettingsResponse,
} from "@repo/types/admin/settings";
import { and, eq, isNotNull } from "drizzle-orm";
import { Hono } from "hono";
import { auth } from "../../auth";
import { db } from "../../database/client";
import { account, twoFactor, user } from "../../database/schema";
import { adminAndManagerRoles, getAdminSession } from "../../shared/admin-session";
import {
  getAdminSettings,
  updateAdminEmailOtpEnabled,
  updateAdminNotificationPreferences,
} from "../../settings/admin-settings";

export const adminSettingsRoutes = new Hono();

async function hasVerifiedTotp(userId: string) {
  const record = await db.query.twoFactor.findFirst({
    where: and(eq(twoFactor.userId, userId), eq(twoFactor.verified, true)),
  });

  return Boolean(record);
}

async function getSecuritySettings(userId: string) {
  const [settings, userRecord, credentialAccount, totpEnabled] = await Promise.all([
    getAdminSettings(userId),
    db.query.user.findFirst({
      where: eq(user.id, userId),
    }),
    db.query.account.findFirst({
      where: and(eq(account.userId, userId), isNotNull(account.password)),
    }),
    hasVerifiedTotp(userId),
  ]);

  return {
    twoFactorEnabled: Boolean(userRecord?.twoFactorEnabled) || totpEnabled || settings.emailOtpEnabled,
    totpEnabled,
    emailOtpEnabled: settings.emailOtpEnabled,
    passwordUpdatedAt: credentialAccount?.updatedAt?.toISOString() ?? null,
  };
}

async function getSettingsResponse(userId: string): Promise<AdminSettingsResponse> {
  const [settings, security] = await Promise.all([getAdminSettings(userId), getSecuritySettings(userId)]);

  return {
    notifications: {
      inAppAlerts: settings.inAppAlerts,
      emailDigests: settings.emailDigests,
    },
    security,
  };
}

adminSettingsRoutes.get("/api/admin/settings", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  return c.json(await getSettingsResponse(admin.sessionUser.id));
});

adminSettingsRoutes.patch("/api/admin/settings/notifications", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const result = updateAdminNotificationPreferencesPayloadSchema.safeParse(await c.req.json());

  if (!result.success) {
    return c.json({ error: result.error.issues[0]?.message ?? "Invalid notification preferences." }, 400);
  }

  await updateAdminNotificationPreferences(admin.sessionUser.id, result.data);

  return c.json(await getSettingsResponse(admin.sessionUser.id));
});

adminSettingsRoutes.patch("/api/admin/settings/security/email-otp", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const result = updateAdminEmailOtpPayloadSchema.safeParse(await c.req.json());

  if (!result.success) {
    return c.json({ error: result.error.issues[0]?.message ?? "Invalid email OTP settings." }, 400);
  }

  const verified = await auth.api.verifyPassword({
    body: {
      password: result.data.password,
    },
    headers: c.req.raw.headers,
  });

  if (!verified) {
    return c.json({ error: "Password is incorrect." }, 400);
  }

  await updateAdminEmailOtpEnabled(admin.sessionUser.id, result.data.enabled);

  if (result.data.enabled) {
    await db.update(user).set({ twoFactorEnabled: true, updatedAt: new Date() }).where(eq(user.id, admin.sessionUser.id));
  } else if (!(await hasVerifiedTotp(admin.sessionUser.id))) {
    await db
      .update(user)
      .set({ twoFactorEnabled: false, updatedAt: new Date() })
      .where(eq(user.id, admin.sessionUser.id));
  }

  return c.json(await getSettingsResponse(admin.sessionUser.id));
});

adminSettingsRoutes.delete("/api/admin/settings/security/totp", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const result = disableAdminTotpPayloadSchema.safeParse(await c.req.json());

  if (!result.success) {
    return c.json({ error: result.error.issues[0]?.message ?? "Invalid TOTP settings." }, 400);
  }

  const verified = await auth.api.verifyPassword({
    body: {
      password: result.data.password,
    },
    headers: c.req.raw.headers,
  });

  if (!verified) {
    return c.json({ error: "Password is incorrect." }, 400);
  }

  await db.delete(twoFactor).where(eq(twoFactor.userId, admin.sessionUser.id));

  const settings = await getAdminSettings(admin.sessionUser.id);

  if (!settings.emailOtpEnabled) {
    await db
      .update(user)
      .set({ twoFactorEnabled: false, updatedAt: new Date() })
      .where(eq(user.id, admin.sessionUser.id));
  }

  return c.json(await getSettingsResponse(admin.sessionUser.id));
});

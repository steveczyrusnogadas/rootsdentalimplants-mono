import { eq } from "drizzle-orm";
import { db } from "../database/client";
import { adminSettings } from "../database/schema";

export const defaultAdminNotificationPreferences = {
  inAppAlerts: true,
  emailDigests: false,
};

const defaultAdminSettings = {
  ...defaultAdminNotificationPreferences,
  emailOtpEnabled: false,
};

export async function getAdminSettings(userId: string) {
  const existing = await db.query.adminSettings.findFirst({
    where: eq(adminSettings.userId, userId),
  });

  if (existing) {
    return existing;
  }

  const now = new Date();
  const [created] = await db
    .insert(adminSettings)
    .values({
      userId,
      ...defaultAdminSettings,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: adminSettings.userId,
      set: {
        updatedAt: now,
      },
    })
    .returning();

  return created;
}

export async function updateAdminNotificationPreferences(
  userId: string,
  preferences: typeof defaultAdminNotificationPreferences,
) {
  const now = new Date();
  const [settings] = await db
    .insert(adminSettings)
    .values({
      userId,
      ...preferences,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: adminSettings.userId,
      set: {
        ...preferences,
        updatedAt: now,
      },
    })
    .returning();

  return settings;
}

export async function updateAdminEmailOtpEnabled(userId: string, emailOtpEnabled: boolean) {
  const now = new Date();
  const [settings] = await db
    .insert(adminSettings)
    .values({
      userId,
      ...defaultAdminNotificationPreferences,
      emailOtpEnabled,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: adminSettings.userId,
      set: {
        emailOtpEnabled,
        updatedAt: now,
      },
    })
    .returning();

  return settings;
}

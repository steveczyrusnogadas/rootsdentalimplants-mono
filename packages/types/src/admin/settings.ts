import { z } from "zod";

export const adminNotificationPreferencesSchema = z.object({
  inAppAlerts: z.boolean(),
  emailDigests: z.boolean(),
});

export const updateAdminNotificationPreferencesPayloadSchema = adminNotificationPreferencesSchema;

export const adminSecuritySettingsSchema = z.object({
  twoFactorEnabled: z.boolean(),
  totpEnabled: z.boolean(),
  emailOtpEnabled: z.boolean(),
  passwordUpdatedAt: z.string().nullable(),
});

export const updateAdminEmailOtpPayloadSchema = z.object({
  password: z.string().trim().min(1, "Password is required."),
  enabled: z.boolean(),
});

export const disableAdminTotpPayloadSchema = z.object({
  password: z.string().trim().min(1, "Password is required."),
});

export const adminSettingsResponseSchema = z.object({
  notifications: adminNotificationPreferencesSchema,
  security: adminSecuritySettingsSchema,
});

export type AdminNotificationPreferences = z.infer<typeof adminNotificationPreferencesSchema>;
export type UpdateAdminNotificationPreferencesPayload = z.infer<
  typeof updateAdminNotificationPreferencesPayloadSchema
>;
export type AdminSecuritySettings = z.infer<typeof adminSecuritySettingsSchema>;
export type AdminSettingsResponse = z.infer<typeof adminSettingsResponseSchema>;
export type UpdateAdminEmailOtpPayload = z.infer<typeof updateAdminEmailOtpPayloadSchema>;
export type DisableAdminTotpPayload = z.infer<typeof disableAdminTotpPayloadSchema>;

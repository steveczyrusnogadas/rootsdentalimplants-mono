import { createFileRoute } from "@tanstack/react-router";
import { useForm, useStore } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReadinessResponse } from "@repo/types/admin/readiness";
import type { UserRole } from "@repo/types/admin/users";
import type {
  AdminSettingsResponse,
  UpdateAdminEmailOtpPayload,
  UpdateAdminNotificationPreferencesPayload,
} from "@repo/types/admin/settings";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import { adminApi, resolveApiUrl } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { adminActivityKeys, adminNotificationKeys, adminProfileKeys, settingsKeys } from "@/lib/query-keys";
import {
  BellIcon,
  MailIcon,
  UserIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  ClockIcon,
  KeyRoundIcon,
  AlertCircleIcon,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export const Route = createFileRoute("/settings/")({
  component: SettingsPage,
});

type AdminProfile = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

type ProfileResponse = {
  user: AdminProfile;
};

type AvatarUploadResponse = {
  uploadUrl: string;
  imageUrl: string;
  method: "PUT";
  headers: Record<string, string>;
  maxSize: number;
};

type TwoFactorClient = {
  twoFactor: {
    enable: (input: { password: string; issuer?: string }) => Promise<{
      data?: { totpURI?: string; backupCodes?: string[] } | null;
      error?: { message?: string } | null;
    }>;
    verifyTotp: (input: { code: string; trustDevice?: boolean }) => Promise<{
      data?: unknown;
      error?: { message?: string } | null;
    }>;
    disable: (input: { password: string }) => Promise<{
      data?: unknown;
      error?: { message?: string } | null;
    }>;
    generateBackupCodes: (input: { password: string }) => Promise<{
      data?: { backupCodes?: string[] } | string[] | null;
      error?: { message?: string } | null;
    }>;
  };
};

const allowedAvatarTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const readinessLabels: Record<keyof ReadinessResponse["checks"], string> = {
  database: "Database",
  redis: "Redis",
  storage: "Storage",
  auth: "Auth config",
};

function getInitials(name: string, email: string) {
  const source = name.trim() || email.trim();

  if (!source) {
    return "?";
  }

  return source
    .replace(/@.*$/, "")
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getReadinessVariant(status: ReadinessResponse["status"]) {
  return status === "ready" ? "default" : "destructive";
}

function formatPasswordAge(value: string | null) {
  if (!value) {
    return "Unknown";
  }

  const updatedAt = new Date(value).getTime();
  const diffDays = Math.max(0, Math.floor((Date.now() - updatedAt) / 86_400_000));

  return diffDays === 1 ? "1 day" : `${diffDays} days`;
}

function getBackupCodes(data: { backupCodes?: string[] } | string[] | null | undefined) {
  if (Array.isArray(data)) {
    return data;
  }

  return data?.backupCodes ?? [];
}

function normalizeTotpCode(value: string) {
  return value.replace(/\D/g, "").slice(0, 6);
}

function SettingsPage() {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const [avatarError, setAvatarError] = useState("");
  const [twoFactorPassword, setTwoFactorPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorSetupUri, setTwoFactorSetupUri] = useState("");
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const twoFactorClient = authClient as typeof authClient & TwoFactorClient;
  const profileForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      image: null as string | null,
    },
    onSubmit: async ({ value }) => {
      await saveProfileMutation.mutateAsync(value);
    },
  });
  const formValues = useStore(profileForm.store, (state) => state.values);
  const profileQuery = useQuery({
    queryKey: adminProfileKeys.detail(),
    queryFn: async () => {
      const data = await adminApi<ProfileResponse>("/api/admin/profile", {
        errorMessage: "Failed to load profile.",
      });

      return data.user;
    },
  });
  const readinessQuery = useQuery({
    queryKey: settingsKeys.readiness(),
    queryFn: async () => {
      const response = await fetch(resolveApiUrl("/api/ready"), {
        credentials: "include",
      });

      if (!response.ok && response.status !== 503) {
        throw new Error("Failed to load readiness checks.");
      }

      return (await response.json()) as ReadinessResponse;
    },
  });
  const settingsQuery = useQuery({
    queryKey: settingsKeys.detail(),
    queryFn: () =>
      adminApi<AdminSettingsResponse>("/api/admin/settings", {
        errorMessage: "Failed to load settings.",
      }),
  });
  const profile = profileQuery.data ?? null;
  const readiness = readinessQuery.data;
  const settings = settingsQuery.data;
  const avatarName = formValues.name || profile?.name || session?.user.name || "";
  const avatarEmail = formValues.email || profile?.email || session?.user.email || "";
  const avatarImage = formValues.image || profile?.image || session?.user.image || null;
  const avatarImageSrc = avatarImage ? resolveApiUrl(avatarImage) : null;
  const initials = useMemo(() => getInitials(avatarName, avatarEmail), [avatarName, avatarEmail]);
  const saveProfileMutation = useMutation({
    mutationFn: (value: { name: string; email: string; image: string | null }) =>
      adminApi<ProfileResponse>("/api/admin/profile", {
        method: "PATCH",
        body: JSON.stringify(value),
        errorMessage: "Failed to save profile.",
      }),
    onSuccess: async (data) => {
      queryClient.setQueryData(adminProfileKeys.detail(), data.user);
      await queryClient.invalidateQueries({ queryKey: adminActivityKeys.lists() });
      profileForm.setFieldValue("name", data.user.name);
      profileForm.setFieldValue("email", data.user.email);
      profileForm.setFieldValue("image", data.user.image);
      toast.success("Profile saved.");
      await authClient.getSession();
      window.dispatchEvent(new Event("baseplate:profile-updated"));
    },
  });
  const avatarUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const upload = await adminApi<AvatarUploadResponse>("/api/admin/profile/avatar-upload", {
        method: "POST",
        body: JSON.stringify({
          contentType: file.type,
          size: file.size,
        }),
        errorMessage: "Failed to upload avatar.",
      });
      const objectResponse = await fetch(upload.uploadUrl, {
        method: upload.method,
        headers: upload.headers,
        body: file,
      });

      if (!objectResponse.ok) {
        throw new Error("Failed to upload avatar to object storage.");
      }

      return upload.imageUrl;
    },
    onSuccess: async (imageUrl) => {
      profileForm.setFieldValue("image", imageUrl);
      await queryClient.invalidateQueries({ queryKey: adminActivityKeys.lists() });
      toast.success("Avatar uploaded. Save changes to update your profile.");
    },
  });
  const notificationPreferencesMutation = useMutation({
    mutationFn: (value: UpdateAdminNotificationPreferencesPayload) =>
      adminApi<AdminSettingsResponse>("/api/admin/settings/notifications", {
        method: "PATCH",
        body: JSON.stringify(value),
        errorMessage: "Failed to save notification preferences.",
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(settingsKeys.detail(), data);
      void queryClient.invalidateQueries({ queryKey: adminNotificationKeys.list() });
      toast.success("Notification preferences saved.");
    },
  });
  const enableTwoFactorMutation = useMutation({
    mutationFn: async () => {
      const response = await twoFactorClient.twoFactor.enable({
        password: twoFactorPassword,
        issuer: "Baseplate",
      });

      if (response.error) {
        throw new Error(response.error.message ?? "Failed to start two-factor setup.");
      }

      return response.data ?? null;
    },
    onSuccess: (data) => {
      setTwoFactorSetupUri(data?.totpURI ?? "");
      setBackupCodes(data?.backupCodes ?? []);
      setTwoFactorDialogOpen(true);
      toast.success("Two-factor setup started. Verify a code to finish.");
    },
  });
  const verifyTwoFactorMutation = useMutation({
    mutationFn: async () => {
      const code = normalizeTotpCode(twoFactorCode);
      const response = await twoFactorClient.twoFactor.verifyTotp({
        code,
        trustDevice: true,
      });

      if (response.error) {
        throw new Error(response.error.message ?? "Failed to verify two-factor code.");
      }
    },
    onSuccess: async () => {
      setTwoFactorCode("");
      setTwoFactorPassword("");
      setTwoFactorSetupUri("");
      setTwoFactorDialogOpen(false);
      await queryClient.invalidateQueries({ queryKey: settingsKeys.detail() });
      toast.success("Two-factor authentication enabled.");
    },
  });
  const disableTwoFactorMutation = useMutation({
    mutationFn: () =>
      adminApi<AdminSettingsResponse>("/api/admin/settings/security/totp", {
        method: "DELETE",
        body: JSON.stringify({ password: twoFactorPassword }),
        errorMessage: "Failed to disable authenticator app.",
      }),
    onSuccess: async () => {
      setTwoFactorPassword("");
      setBackupCodes([]);
      await queryClient.invalidateQueries({ queryKey: settingsKeys.detail() });
      toast.success("Authenticator app disabled.");
    },
  });
  const emailOtpMutation = useMutation({
    mutationFn: (value: UpdateAdminEmailOtpPayload) =>
      adminApi<AdminSettingsResponse>("/api/admin/settings/security/email-otp", {
        method: "PATCH",
        body: JSON.stringify(value),
        errorMessage: "Failed to update email OTP.",
      }),
    onSuccess: async (data) => {
      queryClient.setQueryData(settingsKeys.detail(), data);
      setTwoFactorPassword("");
      toast.success(data.security.emailOtpEnabled ? "Email OTP enabled." : "Email OTP disabled.");
    },
  });
  const backupCodesMutation = useMutation({
    mutationFn: async () => {
      const response = await twoFactorClient.twoFactor.generateBackupCodes({
        password: twoFactorPassword,
      });

      if (response.error) {
        throw new Error(response.error.message ?? "Failed to generate backup codes.");
      }

      return getBackupCodes(response.data);
    },
    onSuccess: (codes) => {
      setBackupCodes(codes);
      toast.success("Backup codes generated.");
    },
  });

  useEffect(() => {
    if (profile) {
      profileForm.setFieldValue("name", profile.name);
      profileForm.setFieldValue("email", profile.email);
      profileForm.setFieldValue("image", profile.image);
    }
  }, [profile, profileForm]);

  async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setAvatarError("");

    if (!allowedAvatarTypes.has(file.type)) {
      setAvatarError("Avatar must be a JPEG, PNG, WebP, or GIF image.");
      return;
    }

    avatarUploadMutation.mutate(file);
  }

  const loading = profileQuery.isPending;
  const saving = saveProfileMutation.isPending;
  const uploading = avatarUploadMutation.isPending;
  const securityError =
    (enableTwoFactorMutation.error instanceof Error ? enableTwoFactorMutation.error.message : "") ||
    (verifyTwoFactorMutation.error instanceof Error ? verifyTwoFactorMutation.error.message : "") ||
    (disableTwoFactorMutation.error instanceof Error ? disableTwoFactorMutation.error.message : "") ||
    (emailOtpMutation.error instanceof Error ? emailOtpMutation.error.message : "") ||
    (backupCodesMutation.error instanceof Error ? backupCodesMutation.error.message : "");
  const error =
    avatarError ||
    (saveProfileMutation.error instanceof Error ? saveProfileMutation.error.message : "") ||
    (avatarUploadMutation.error instanceof Error ? avatarUploadMutation.error.message : "") ||
    (profileQuery.error instanceof Error ? profileQuery.error.message : "") ||
    (settingsQuery.error instanceof Error ? settingsQuery.error.message : "") ||
    securityError;

  return (
    <div className="p-6">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void profileForm.handleSubmit();
        }}
      >
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight">Settings</h1>
            <p className="mt-1 text-muted-foreground">Manage account, security, and notification preferences.</p>
          </div>
          <profileForm.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button disabled={!canSubmit || loading || saving || uploading} type="submit">
                {isSubmitting || saving ? "Saving..." : "Save changes"}
              </Button>
            )}
          />
        </div>

        {error ? (
          <Alert className="mb-4" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="size-5" />
                Profile
              </CardTitle>
              <CardDescription>Update the public information shown across the admin workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap items-center gap-4">
                <Avatar className="size-16">
                  {avatarImageSrc ? <AvatarImage src={avatarImageSrc} alt={avatarName || "Admin avatar"} /> : null}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar</Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    disabled={loading || uploading || saving}
                    onChange={(event) => void uploadAvatar(event)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {uploading ? "Uploading avatar..." : "JPEG, PNG, WebP, or GIF up to 2 MB."}
                  </p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Display name</Label>
                <profileForm.Field
                  name="name"
                  validators={{
                    onChange: ({ value }) => (value.trim() ? undefined : "Display name is required."),
                  }}
                >
                  {(field) => (
                    <>
                      <Input
                        id="name"
                        name={field.name}
                        value={field.state.value}
                        disabled={loading || saving}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                        required
                      />
                      {field.state.meta.isTouched && field.state.meta.errors.length ? (
                        <p className="text-sm text-destructive">{field.state.meta.errors.map(String).join(", ")}</p>
                      ) : null}
                    </>
                  )}
                </profileForm.Field>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <profileForm.Field
                  name="email"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value.trim()) {
                        return "Email address is required.";
                      }

                      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : "Enter a valid email address.";
                    },
                  }}
                >
                  {(field) => (
                    <>
                      <Input
                        id="email"
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        disabled={loading || saving}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                        required
                      />
                      {field.state.meta.isTouched && field.state.meta.errors.length ? (
                        <p className="text-sm text-destructive">{field.state.meta.errors.map(String).join(", ")}</p>
                      ) : null}
                    </>
                  )}
                </profileForm.Field>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={profile?.role ?? session?.user.role ?? "admin"} disabled readOnly />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>Readiness</CardTitle>
                <CardDescription>Operational checks for local and deployed dependencies.</CardDescription>
              </div>
              <Badge variant={readiness ? getReadinessVariant(readiness.status) : "outline"}>
                {readiness ? readiness.status.replace("_", " ") : "Loading"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {readinessQuery.error instanceof Error ? (
                <p className="text-sm text-destructive">{readinessQuery.error.message}</p>
              ) : readiness ? (
                (
                  Object.entries(readiness.checks) as Array<
                    [keyof ReadinessResponse["checks"], ReadinessResponse["checks"][keyof ReadinessResponse["checks"]]]
                  >
                ).map(([key, check], index) => (
                  <div key={key}>
                    {index > 0 ? <Separator className="mb-4" /> : null}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium">{readinessLabels[key]}</span>
                        <Badge variant={check.status === "ok" ? "secondary" : "destructive"}>{check.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{check.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Loading readiness checks...</p>
              )}
            </CardContent>
          </Card>
        </div>
      </form>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.5fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellIcon className="size-5" />
              Notifications
            </CardTitle>
            <CardDescription>Notification preferences for admin account updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <BellIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <Label htmlFor="in-app-alerts" className="font-medium">
                    In-app alerts
                  </Label>
                  <p className="text-xs text-muted-foreground">Show notification bell updates and live alerts.</p>
                </div>
              </div>
              <Switch
                id="in-app-alerts"
                checked={settings?.notifications.inAppAlerts ?? true}
                disabled={!settings || notificationPreferencesMutation.isPending}
                onCheckedChange={(checked) =>
                  notificationPreferencesMutation.mutate({
                    inAppAlerts: checked,
                    emailDigests: settings?.notifications.emailDigests ?? false,
                  })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <MailIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <Label htmlFor="email-digests" className="font-medium">
                    Email digests
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Store whether digest emails should be sent when added.
                  </p>
                </div>
              </div>
              <Switch
                id="email-digests"
                checked={settings?.notifications.emailDigests ?? false}
                disabled={!settings || notificationPreferencesMutation.isPending}
                onCheckedChange={(checked) =>
                  notificationPreferencesMutation.mutate({
                    inAppAlerts: settings?.notifications.inAppAlerts ?? true,
                    emailDigests: checked,
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheckIcon className="size-5" />
              Security
            </CardTitle>
            <CardDescription>Security controls for admin access and sign-in protection.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              <div className="flex items-center justify-between gap-3 border-b pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="size-4 text-muted-foreground" />
                  <span className="font-medium">Two-factor auth</span>
                </div>
                <Badge variant={settings?.security.twoFactorEnabled ? "secondary" : "outline"} className="text-xs">
                  {settings?.security.twoFactorEnabled ? "Enabled" : "Not configured"}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-3 border-b pb-3">
                <div className="flex items-center gap-2">
                  <SmartphoneIcon className="size-4 text-muted-foreground" />
                  <span className="font-medium">Authenticator</span>
                </div>
                <Badge variant={settings?.security.totpEnabled ? "secondary" : "outline"} className="text-xs">
                  {settings?.security.totpEnabled ? "Enabled" : "Not configured"}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-3 border-b pb-3">
                <div className="flex items-center gap-2">
                  <MailIcon className="size-4 text-muted-foreground" />
                  <span className="font-medium">Email OTP</span>
                </div>
                <Badge variant={settings?.security.emailOtpEnabled ? "secondary" : "outline"} className="text-xs">
                  {settings?.security.emailOtpEnabled ? "Enabled" : "Not configured"}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-3 border-b pb-3">
                <div className="flex items-center gap-2">
                  <ClockIcon className="size-4 text-muted-foreground" />
                  <span className="font-medium">Password age</span>
                </div>
                <span className="text-xs font-medium tabular-nums">
                  {formatPasswordAge(settings?.security.passwordUpdatedAt ?? null)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="two-factor-password" className="flex items-center gap-2 font-medium">
                  <KeyRoundIcon className="size-4 text-muted-foreground" />
                  Confirm password to make changes
                </Label>
                <Input
                  id="two-factor-password"
                  type="password"
                  value={twoFactorPassword}
                  placeholder="Enter your current password"
                  className="max-w-sm"
                  onChange={(event) => setTwoFactorPassword(event.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {settings?.security.totpEnabled ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!twoFactorPassword || backupCodesMutation.isPending}
                      onClick={() => backupCodesMutation.mutate()}
                    >
                      <KeyRoundIcon className="mr-2 size-4" />
                      Generate backup codes
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={!twoFactorPassword || disableTwoFactorMutation.isPending}
                      onClick={() => disableTwoFactorMutation.mutate()}
                    >
                      <AlertCircleIcon className="mr-2 size-4" />
                      Disable authenticator
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!twoFactorPassword || enableTwoFactorMutation.isPending}
                    onClick={() => enableTwoFactorMutation.mutate()}
                  >
                    <SmartphoneIcon className="mr-2 size-4" />
                    Start 2FA setup
                  </Button>
                )}
                {twoFactorSetupUri && !settings?.security.totpEnabled ? (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setTwoFactorDialogOpen(true)}>
                    Resume setup
                  </Button>
                ) : null}
              </div>

              <Separator />

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={settings?.security.emailOtpEnabled ? "destructive" : "outline"}
                  size="sm"
                  disabled={!twoFactorPassword || emailOtpMutation.isPending}
                  onClick={() =>
                    emailOtpMutation.mutate({
                      password: twoFactorPassword,
                      enabled: !(settings?.security.emailOtpEnabled ?? false),
                    })
                  }
                >
                  <MailIcon className="mr-2 size-4" />
                  {settings?.security.emailOtpEnabled ? "Disable email OTP" : "Enable email OTP"}
                </Button>
              </div>
            </div>

            {settings?.security.twoFactorEnabled && backupCodes.length ? (
              <div className="rounded-lg border bg-amber-50 p-4 dark:bg-amber-950/20">
                <div className="mb-3 flex items-center gap-2">
                  <KeyRoundIcon className="size-4 text-amber-600" />
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Backup codes</p>
                </div>
                <p className="mb-3 text-xs text-muted-foreground">
                  Save these codes in a secure location. Each code can only be used once.
                </p>
                <div className="grid gap-1.5 font-mono text-xs sm:grid-cols-2">
                  {backupCodes.map((code) => (
                    <code
                      key={code}
                      className="rounded bg-white px-2 py-1.5 text-center font-medium text-amber-900 shadow-sm dark:bg-black/30 dark:text-amber-100"
                    >
                      {code}
                    </code>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
      <Dialog open={twoFactorDialogOpen} onOpenChange={setTwoFactorDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Set up two-factor auth</DialogTitle>
            <DialogDescription>
              Scan the QR code with your authenticator app, then enter the current code to finish setup.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {twoFactorSetupUri ? (
              <div className="flex justify-center rounded border bg-white p-4">
                <QRCodeSVG value={twoFactorSetupUri} size={208} marginSize={4} title="Two-factor setup QR code" />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Start setup from the security card to generate a QR code.</p>
            )}
            {twoFactorSetupUri ? (
              <div className="space-y-2">
                <Label htmlFor="two-factor-uri">Manual setup URI</Label>
                <p
                  id="two-factor-uri"
                  className="max-h-24 overflow-auto break-all rounded border p-3 font-mono text-xs"
                >
                  {twoFactorSetupUri}
                </p>
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="two-factor-code">Authenticator code</Label>
              <Input
                id="two-factor-code"
                value={twoFactorCode}
                inputMode="numeric"
                placeholder="123456"
                maxLength={6}
                onChange={(event) => setTwoFactorCode(normalizeTotpCode(event.target.value))}
              />
            </div>
            {backupCodes.length ? (
              <div className="rounded border p-3">
                <p className="mb-2 text-xs font-medium">Backup codes</p>
                <div className="grid gap-1 font-mono text-xs sm:grid-cols-2">
                  {backupCodes.map((code) => (
                    <span key={code}>{code}</span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setTwoFactorDialogOpen(false)}>
              Close
            </Button>
            <Button
              type="button"
              disabled={!twoFactorCode || verifyTwoFactorMutation.isPending}
              onClick={() => verifyTwoFactorMutation.mutate()}
            >
              Verify and enable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

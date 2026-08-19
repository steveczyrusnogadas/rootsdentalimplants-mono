import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { authKeys } from "@/lib/query-keys";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function normalizeTotpCode(value: string) {
  return value.replace(/\D/g, "").slice(0, 6);
}

type TwoFactorMethod = "totp" | "otp";

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [twoFactorMethods, setTwoFactorMethods] = useState<TwoFactorMethod[]>([]);
  const [selectedTwoFactorMethod, setSelectedTwoFactorMethod] = useState<TwoFactorMethod>("totp");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const signInMutation = useMutation({
    mutationKey: authKeys.signIn(),
    mutationFn: async (value: { email: string; password: string }) => {
      const { data, error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
        callbackURL: "/dashboard",
      });

      if (error) {
        throw new Error(error.message || "Unable to sign in.");
      }

      return {
        twoFactorRequired: Boolean(data?.twoFactorRedirect),
        twoFactorMethods: ((data?.twoFactorMethods ?? []) as string[]).filter(
          (method): method is TwoFactorMethod => method === "totp" || method === "otp",
        ),
      };
    },
    onSuccess: (result) => {
      if (result.twoFactorRequired) {
        const methods = result.twoFactorMethods.length ? result.twoFactorMethods : ["totp"];
        setRequiresTwoFactor(true);
        setTwoFactorMethods(methods);
        setSelectedTwoFactorMethod(methods[0] ?? "totp");
        return;
      }

      navigate({ to: "/dashboard" });
    },
  });
  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.twoFactor.sendOtp({
        trustDevice: true,
      });

      if (error) {
        throw new Error(error.message || "Unable to send email code.");
      }
    },
  });
  const verifyTwoFactorMutation = useMutation({
    mutationFn: async () => {
      const code = normalizeTotpCode(twoFactorCode);
      const { error } =
        selectedTwoFactorMethod === "otp"
          ? await authClient.twoFactor.verifyOtp({
              code,
              trustDevice: true,
            })
          : await authClient.twoFactor.verifyTotp({
              code,
              trustDevice: true,
            });

      if (error) {
        throw new Error(error.message || "Unable to verify two-factor code.");
      }
    },
    onSuccess: () => {
      navigate({ to: "/dashboard" });
    },
  });
  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await signInMutation.mutateAsync(value);
    },
  });
  const errorMessage =
    (signInMutation.error instanceof Error ? signInMutation.error.message : "") ||
    (sendOtpMutation.error instanceof Error ? sendOtpMutation.error.message : "") ||
    (verifyTwoFactorMutation.error instanceof Error ? verifyTwoFactorMutation.error.message : "");
  const canUseTotp = twoFactorMethods.includes("totp");
  const canUseOtp = twoFactorMethods.includes("otp");

  return (
    <div className="flex min-h-screen bg-background md:p-10">
      <div className="flex flex-1 border border-border">
        {/* Left panel */}
        <div className="relative hidden w-1/2 md:flex">
          <img
            src="/Gemini_Generated_Image_e4jb9ve4jb9ve4jb-compressed.webp"
            alt="Hero"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 flex h-full w-full flex-col p-8 text-white">
            <div className="text-2xl font-bold tracking-tight">Baseplate</div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex w-full items-center justify-center px-6 py-12 md:w-1/2">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="font-heading text-3xl font-semibold">Sign in</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {requiresTwoFactor
                  ? selectedTwoFactorMethod === "otp"
                    ? "Send an email code, then enter it here."
                    : "Enter the code from your authenticator app."
                  : "Sign in to the dashboard"}
              </p>
            </div>

            {requiresTwoFactor ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  verifyTwoFactorMutation.mutate();
                }}
                className="flex flex-col gap-5"
              >
                {canUseTotp && canUseOtp ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={selectedTwoFactorMethod === "totp" ? "default" : "outline"}
                      onClick={() => {
                        setSelectedTwoFactorMethod("totp");
                        setTwoFactorCode("");
                        verifyTwoFactorMutation.reset();
                      }}
                    >
                      Authenticator
                    </Button>
                    <Button
                      type="button"
                      variant={selectedTwoFactorMethod === "otp" ? "default" : "outline"}
                      onClick={() => {
                        setSelectedTwoFactorMethod("otp");
                        setTwoFactorCode("");
                        verifyTwoFactorMutation.reset();
                      }}
                    >
                      Email code
                    </Button>
                  </div>
                ) : null}
                {selectedTwoFactorMethod === "otp" ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={sendOtpMutation.isPending}
                    onClick={() => sendOtpMutation.mutate()}
                  >
                    {sendOtpMutation.isPending ? "Sending code..." : "Send email code"}
                  </Button>
                ) : null}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="two-factor-code">
                    {selectedTwoFactorMethod === "otp" ? "Email code" : "Authenticator code"}
                  </Label>
                  <Input
                    id="two-factor-code"
                    value={twoFactorCode}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="123456"
                    maxLength={6}
                    onChange={(event) => setTwoFactorCode(normalizeTotpCode(event.target.value))}
                    required
                  />
                </div>

                {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={twoFactorCode.length !== 6 || verifyTwoFactorMutation.isPending}
                >
                  {verifyTwoFactorMutation.isPending ? "Verifying..." : "Verify code"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setRequiresTwoFactor(false);
                    setTwoFactorMethods([]);
                    setSelectedTwoFactorMethod("totp");
                    setTwoFactorCode("");
                    signInMutation.reset();
                    sendOtpMutation.reset();
                    verifyTwoFactorMutation.reset();
                  }}
                >
                  Back to password
                </Button>
              </form>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  void loginForm.handleSubmit();
                }}
                className="flex flex-col gap-5"
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <loginForm.Field
                    name="email"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value.trim()) {
                          return "Email is required.";
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
                          placeholder="admin@example.com"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.value)}
                          required
                        />
                        {field.state.meta.isTouched && field.state.meta.errors.length ? (
                          <p className="text-sm text-destructive">{field.state.meta.errors.map(String).join(", ")}</p>
                        ) : null}
                      </>
                    )}
                  </loginForm.Field>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                  <loginForm.Field
                    name="password"
                    validators={{
                      onChange: ({ value }) => (value.trim() ? undefined : "Password is required."),
                    }}
                  >
                    {(field) => (
                      <>
                        <Input
                          id="password"
                          name={field.name}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.value)}
                          required
                          className="pr-10"
                        />
                        {field.state.meta.isTouched && field.state.meta.errors.length ? (
                          <p className="text-sm text-destructive">{field.state.meta.errors.map(String).join(", ")}</p>
                        ) : null}
                      </>
                    )}
                  </loginForm.Field>
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                </div>

                {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

                <loginForm.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <Button type="submit" className="w-full" disabled={!canSubmit || signInMutation.isPending}>
                      {isSubmitting || signInMutation.isPending ? "Signing in..." : "Sign in"}
                    </Button>
                  )}
                />
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

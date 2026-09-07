import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search) => ({
    token: typeof search.token === "string" ? search.token : "",
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = Route.useSearch();
  const [showPassword, setShowPassword] = useState(false);
  const resetPasswordMutation = useMutation({
    mutationFn: async (value: { password: string }) => {
      const { error } = await authClient.resetPassword({
        newPassword: value.password,
        token,
      });

      if (error) {
        throw new Error(error.message || "Unable to reset password.");
      }
    },
    onSuccess: () => {
      navigate({ to: "/login" });
    },
  });
  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      if (value.password !== value.confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      await resetPasswordMutation.mutateAsync({ password: value.password });
    },
  });
  const errorMessage = resetPasswordMutation.error instanceof Error ? resetPasswordMutation.error.message : "";

  return (
    <div className="flex min-h-screen bg-background md:p-10">
      <div className="flex flex-1 border border-border">
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

        <div className="flex w-full items-center justify-center px-6 py-12 md:w-1/2">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="font-heading text-3xl font-semibold">Choose a new password</h1>
              <p className="mt-2 text-sm text-muted-foreground">Enter a new password for your admin account.</p>
            </div>

            {!token ? (
              <div className="flex flex-col gap-5">
                <p className="text-sm text-destructive">This password reset link is missing a token.</p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/forgot-password">Request a new reset link</Link>
                </Button>
              </div>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  void form.handleSubmit();
                }}
                className="flex flex-col gap-5"
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">New password</Label>
                  <div className="relative">
                    <form.Field
                      name="password"
                      validators={{
                        onChange: ({ value }) =>
                          value.length >= 8 ? undefined : "Password must be at least 8 characters.",
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
                    </form.Field>
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <form.Field
                    name="confirmPassword"
                    validators={{
                      onChangeListenTo: ["password"],
                      onChange: ({ value, fieldApi }) =>
                        value === fieldApi.form.getFieldValue("password") ? undefined : "Passwords do not match.",
                    }}
                  >
                    {(field) => (
                      <>
                        <Input
                          id="confirmPassword"
                          name={field.name}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
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
                  </form.Field>
                </div>

                {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <Button type="submit" className="w-full" disabled={!canSubmit || resetPasswordMutation.isPending}>
                      {isSubmitting || resetPasswordMutation.isPending ? "Resetting..." : "Reset password"}
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

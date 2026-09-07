import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const requestResetMutation = useMutation({
    mutationFn: async (value: { email: string }) => {
      const { error } = await authClient.requestPasswordReset({
        email: value.email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw new Error(error.message || "Unable to request a password reset.");
      }
    },
  });
  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      await requestResetMutation.mutateAsync(value);
    },
  });
  const errorMessage = requestResetMutation.error instanceof Error ? requestResetMutation.error.message : "";

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
              <h1 className="font-heading text-3xl font-semibold">Reset your password</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your email and we will send a password reset link if the account exists.
              </p>
            </div>

            {requestResetMutation.isSuccess ? (
              <div className="flex flex-col gap-5">
                <p className="text-sm text-muted-foreground">
                  Check your inbox for a reset link. It may take a minute to arrive.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login">Back to sign in</Link>
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
                  <Label htmlFor="email">Email</Label>
                  <form.Field
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
                  </form.Field>
                </div>

                {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <Button type="submit" className="w-full" disabled={!canSubmit || requestResetMutation.isPending}>
                      {isSubmitting || requestResetMutation.isPending ? "Sending..." : "Send reset link"}
                    </Button>
                  )}
                />
                <Button asChild variant="ghost" className="w-full">
                  <Link to="/login">Back to sign in</Link>
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

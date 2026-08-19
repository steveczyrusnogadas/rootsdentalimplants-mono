import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";
import { Textarea } from "@repo/ui/components/textarea";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { apiJson } from "@/lib/api";
import { contactKeys } from "@/lib/query-keys";

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  message: string;
  website: string;
};

const emptyForm: ContactForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
  website: "",
};

export const Route = createFileRoute("/contact")({
  component: ContactComponent,
  head: () => ({
    meta: [
      { title: "Contact · The Baseplate" },
      {
        name: "description",
        content:
          "Send a note about your project, practice, team, or client workflow. We will route it to the right person and follow up soon.",
      },
    ],
  }),
});

function required(value: string, label: string) {
  return value.trim() ? undefined : `${label} is required.`;
}

function ContactComponent() {
  const navigate = useNavigate();
  const contactMutation = useMutation({
    mutationKey: contactKeys.submissions(),
    mutationFn: (value: ContactForm) =>
      apiJson<void>("/api/contact", {
        method: "POST",
        body: JSON.stringify(value),
        errorMessage: "We could not send your message. Please try again.",
      }),
    onSuccess: async () => {
      await navigate({ to: "/contact/thank-you" });
    },
  });
  const form = useForm({
    defaultValues: emptyForm,
    onSubmit: async ({ value }) => {
      await contactMutation.mutateAsync(value);
    },
  });
  const error = contactMutation.error instanceof Error ? contactMutation.error.message : "";

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex flex-col items-center gap-3 pb-6">
          <div className="w-full border-t border-foreground/20" />
          <div className="flex w-full items-center justify-between py-2">
            <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              Issue 04
            </span>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">The Baseplate</h2>
            <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              Contact
            </span>
          </div>
          <div className="w-full border-t border-foreground/20" />
        </header>

        <section className="mb-16 grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              Start the conversation
            </p>
            <h1 className="font-heading mt-3 text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl lg:text-7xl">
              Tell us what you need next.
            </h1>
            <p className="font-heading mt-6 max-w-2xl text-xl font-medium italic text-muted-foreground md:text-2xl">
              Send a note about your project, practice, team, or client workflow. We will route it to the right person
              and follow up soon.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="border border-foreground/10 p-5">
                <Mail className="h-5 w-5 text-primary" />
                <h3 className="font-heading mt-4 font-semibold">Email-first</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  We use your email only to reply to this inquiry.
                </p>
              </div>
              <div className="border border-foreground/10 p-5">
                <Phone className="h-5 w-5 text-primary" />
                <h3 className="font-heading mt-4 font-semibold">Phone optional</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Add a number if a call would make follow-up easier.
                </p>
              </div>
              <div className="border border-foreground/10 p-5">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h3 className="font-heading mt-4 font-semibold">Context helps</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  A few details help us qualify and prioritize the lead.
                </p>
              </div>
            </div>
          </div>

          <form
            className="border border-foreground/10 p-6"
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <div className="space-y-5">
              <div>
                <h3 className="font-heading text-2xl font-semibold tracking-tight">Contact us</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Share the basics and we will get back to you.
                </p>
              </div>

              {error ? <div className="border border-destructive/40 p-3 text-sm text-destructive">{error}</div> : null}

              <div className="grid gap-2">
                <Label htmlFor="contact-name">Name</Label>
                <form.Field
                  name="name"
                  validators={{
                    onChange: ({ value }) => required(value, "Name"),
                  }}
                >
                  {(field) => (
                    <>
                      <Input
                        id="contact-name"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                        autoComplete="name"
                        required
                      />
                      {field.state.meta.isTouched && field.state.meta.errors.length ? (
                        <p className="text-sm text-destructive">{field.state.meta.errors.map(String).join(", ")}</p>
                      ) : null}
                    </>
                  )}
                </form.Field>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contact-email">Email</Label>
                <form.Field
                  name="email"
                  validators={{
                    onChange: ({ value }) => {
                      const requiredMessage = required(value, "Email");

                      if (requiredMessage) {
                        return requiredMessage;
                      }

                      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : "Enter a valid email address.";
                    },
                  }}
                >
                  {(field) => (
                    <>
                      <Input
                        id="contact-email"
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                        autoComplete="email"
                        required
                      />
                      {field.state.meta.isTouched && field.state.meta.errors.length ? (
                        <p className="text-sm text-destructive">{field.state.meta.errors.map(String).join(", ")}</p>
                      ) : null}
                    </>
                  )}
                </form.Field>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contact-phone">
                  Phone <span className="text-muted-foreground">Optional</span>
                </Label>
                <form.Field name="phone">
                  {(field) => (
                    <Input
                      id="contact-phone"
                      name={field.name}
                      type="tel"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      autoComplete="tel"
                    />
                  )}
                </form.Field>
              </div>

              <div className="hidden" aria-hidden="true">
                <Label htmlFor="contact-website">Website</Label>
                <form.Field name="website">
                  {(field) => (
                    <Input
                      id="contact-website"
                      name={field.name}
                      tabIndex={-1}
                      autoComplete="off"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                    />
                  )}
                </form.Field>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contact-message">Message</Label>
                <form.Field
                  name="message"
                  validators={{
                    onChange: ({ value }) => required(value, "Message"),
                  }}
                >
                  {(field) => (
                    <>
                      <Textarea
                        id="contact-message"
                        name={field.name}
                        className="min-h-32 resize-y"
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

              <Separator />

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button className="w-full" type="submit" disabled={!canSubmit || contactMutation.isPending}>
                    {isSubmitting || contactMutation.isPending ? "Sending..." : "Send message"}
                  </Button>
                )}
              />
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/contact_/thank-you")({
  component: ContactThankYouComponent,
  head: () => ({
    meta: [
      { title: "Thank you · The Baseplate" },
      {
        name: "description",
        content: "Your message is in the queue. We will review it and follow up as soon as possible.",
      },
    ],
  }),
});

function ContactThankYouComponent() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <header className="flex flex-col items-center gap-3 pb-6">
          <div className="w-full border-t border-foreground/20" />
          <div className="flex w-full items-center justify-between py-2">
            <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              Received
            </span>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">The Baseplate</h2>
            <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              Thank You
            </span>
          </div>
          <div className="w-full border-t border-foreground/20" />
        </header>

        <section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center border border-foreground/10 bg-primary/10">
            <CheckCircle2 className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-heading mt-8 max-w-2xl text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl">
            Thanks for reaching out.
          </h1>
          <p className="font-heading mt-6 max-w-xl text-xl font-medium italic text-muted-foreground">
            Your message is in the queue. We will review it and follow up as soon as possible.
          </p>
          <Separator className="my-10 max-w-sm" />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link to="/">Return home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contact">Send another message</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

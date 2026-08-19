import { createFileRoute, Link } from "@tanstack/react-router";
import { Separator } from "@repo/ui/components/separator";
import { Cpu, Layers, Monitor, Zap } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutComponent,
  head: () => ({
    meta: [
      { title: "About · The Baseplate" },
      {
        name: "description",
        content:
          "A modern monorepo blueprint with the operational checks, tests, and deployment shape a real product needs.",
      },
    ],
  }),
});

function AboutComponent() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Masthead */}
        <header className="flex flex-col items-center gap-3 pb-6">
          <div className="w-full border-t border-foreground/20" />
          <div className="flex w-full items-center justify-between py-2">
            <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              Issue 02
            </span>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">The Baseplate</h2>
            <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">About</span>
          </div>
          <div className="w-full border-t border-foreground/20" />
        </header>

        {/* Hero */}
        <section className="mb-16">
          <h1 className="font-heading text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl lg:text-7xl">
            Built for speed, then tightened for shipping.
          </h1>
          <p className="font-heading mt-6 text-xl font-medium italic text-muted-foreground md:text-2xl">
            A modern monorepo blueprint with the operational checks, tests, and deployment shape a real product needs.
          </p>
        </section>

        <Separator className="mb-16" />

        {/* Principles */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <h3 className="font-heading text-2xl font-semibold tracking-tight">Design Principles</h3>
            <div className="flex-1 border-t border-foreground/10" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-heading text-lg font-semibold">Low Config Overhead</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Bun handles the runtime and package manager. Turborepo orchestrates dev, tests, lint, types, and
                  builds so the workspace stays predictable without becoming ceremony.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <Monitor className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-heading text-lg font-semibold">End-to-End TypeScript</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Strict typing from API to UI. Shared contracts describe readiness, admin, and public API shapes across
                  workspace boundaries so refactors have a clear safety net.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-heading text-lg font-semibold">Shared Everything</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Components, styles, TypeScript configs, lint rules, query conventions, and reusable contracts live in
                  packages or app-local helpers with clear ownership.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <Cpu className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-heading text-lg font-semibold">Operational Confidence</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  The API reports database, Redis, storage, and auth readiness; Docker runs built API and worker
                  artifacts; CI exercises tests, lint, types, and production builds.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Separator className="mb-16" />

        {/* Colophon */}
        <footer className="flex flex-col items-center gap-6 pb-10">
          <p className="max-w-lg text-center text-sm leading-relaxed text-muted-foreground">
            Baseplate is a starter, not a framework. Fork it, strip it, or extend it — the architecture is designed to
            scale up and down with your needs while keeping the shipped surface honest.
          </p>
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-foreground/20" />
            <Link
              to="/"
              className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground"
            >
              Return Home
            </Link>
            <div className="h-px w-12 bg-foreground/20" />
          </div>
        </footer>
      </div>
    </main>
  );
}

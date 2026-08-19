import { createFileRoute, Link } from "@tanstack/react-router";
import { Separator } from "@repo/ui/components/separator";
import {
  Bell,
  ClipboardList,
  Database,
  FileText,
  GitBranch,
  Images,
  KeyRound,
  LayoutDashboard,
  Mail,
  Newspaper,
  Palette,
  Route as RouteIcon,
  Shield,
  Sparkles,
  UploadCloud,
} from "lucide-react";

export const Route = createFileRoute("/changelog")({
  component: ChangelogComponent,
  head: () => ({
    meta: [
      { title: "Changelog · The Baseplate" },
      {
        name: "description",
        content:
          "Readiness checks, tests, Docker runtime alignment, safer API errors, query cleanup, and refreshed docs now make the starter easier to deploy and maintain.",
      },
    ],
  }),
});

function ChangelogComponent() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex flex-col items-center gap-3 pb-6">
          <div className="w-full border-t border-foreground/20" />
          <div className="flex w-full items-center justify-between py-2">
            <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              Issue 06
            </span>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">The Baseplate</h2>
            <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              Changelog
            </span>
          </div>
          <div className="w-full border-t border-foreground/20" />
        </header>

        <section className="mb-16">
          <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
            April 29, 2026
          </p>
          <h1 className="font-heading mt-3 text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl lg:text-7xl">
            The platform got a cleanup pass for shipping.
          </h1>
          <p className="font-heading mt-6 text-xl font-medium italic text-muted-foreground md:text-2xl">
            Readiness checks, tests, Docker runtime alignment, safer API errors, query cleanup, and refreshed docs now
            make the starter easier to deploy and maintain.
          </p>
        </section>

        <Separator className="mb-16" />

        <section className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <h3 className="font-heading text-2xl font-semibold tracking-tight">Latest cleanup</h3>
            <div className="flex-1 border-t border-foreground/10" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 29, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">Readiness now includes Redis</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  The API readiness response checks database, Redis, object storage, and auth config so jobs and
                  realtime notification fan-out are represented before a deployment is considered ready.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 29, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">Tests are part of CI</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Root scripts and GitHub Actions now run Bun tests alongside type checks, lint, and builds, with
                  focused coverage for Redis config, rate limits, and blog route behavior.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <RouteIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 29, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">Docker runs built artifacts</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Production API and worker images now build the Bun entrypoints first and run the generated output,
                  while local dev still keeps source-based hot reload.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 29, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">Docs and API surface cleaned up</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  The removed message route references are gone, route inventories match the mounted API, env docs cover
                  production knobs, public error responses avoid leaking internals, and blog post routes no longer run
                  the index query.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Separator className="mb-16" />

        <section className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <h3 className="font-heading text-2xl font-semibold tracking-tight">April 28 update</h3>
            <div className="flex-1 border-t border-foreground/10" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <GitBranch className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 28, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">Event-driven backend</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Contact submissions now emit a persisted{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">lead.created</code> domain event that
                  dispatches through BullMQ workers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 28, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">Realtime admin notifications</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Admin notifications are persisted, streamed over SSE, and shown in the authenticated notification bell
                  with mark-read actions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <KeyRound className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 28, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">Password reset email</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Better Auth password reset requests now enqueue Resend-backed transactional email through the worker
                  process.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 28, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">Redis and worker services</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Local and production compose files now include Redis, and Dokploy builds can run the API and worker as
                  separate services.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 28, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">CI, linting, and formatting</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  GitHub Actions now runs install, type checks, lint, and build; apps use real ESLint scripts and the
                  repo has Prettier defaults.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <RouteIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 28, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">Route and shell polish</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Admin routes moved to cleaner top-level paths, web and admin gained custom 404 recovery pages, and
                  dashboard chart fixes landed.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Separator className="mb-16" />

        <section className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <h3 className="font-heading text-2xl font-semibold tracking-tight">April 27 update</h3>
            <div className="flex-1 border-t border-foreground/10" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <Newspaper className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 27, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">Blog publishing</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Admins can draft, publish, and manage blog posts with metadata, cover images, public slug routes, and
                  recent post cards on the homepage.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <Images className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 27, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">Media library</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  The admin workspace now has reusable image uploads, compact thumbnails, asset previews, copyable
                  stable URLs, and blog insertion through a media picker.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 27, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">Tiptap editor images</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Inline blog images can be inserted from media, resized, aligned left, center, right, or full width,
                  and rendered consistently on the public blog.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 27, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">Shared theme provider</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  A reusable provider in <code className="rounded bg-muted px-1 py-0.5 text-xs">@repo/ui</code> now
                  applies light, dark, or system-resolved color schemes and persists the preference locally.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 27, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">Theme toggle everywhere</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  The public navigation and authenticated admin header both expose the same shared toggle, so every app
                  reads and writes the same visual preference.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 27, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">TanStack Query and Form</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Web and admin flows now use app-local query clients, query key factories, API helpers, mutation
                  patterns, and TanStack Form state for route forms.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 27, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">Contact form and leads</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Public contact submissions post to the API, redirect to a thank-you route, and appear in the admin
                  leads workspace with dashboard stats and lead management actions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <UploadCloud className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 27, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">Profile and avatar uploads</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Admin settings can update profile details and request signed avatar upload URLs backed by the local
                  MinIO/S3-compatible storage path.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 27, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">Docs and homepage refreshed</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  The homepage, README, project spec, and this changelog now describe the current starter surface and
                  track when visible platform features landed.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Separator className="mb-16" />

        <section className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <h3 className="font-heading text-2xl font-semibold tracking-tight">Foundation shipped</h3>
            <div className="flex-1 border-t border-foreground/10" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <RouteIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 25, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">API on Hono</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  A Bun-hosted Hono app powers health checks, public API routes, and consistent JSON responses—consumed
                  by the web app through the Vite proxy.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 25, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">Better Auth</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Email and password sign-in lives on the API with Postgres-backed sessions, the admin plugin, and
                  cookie semantics tuned for the admin client.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <LayoutDashboard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 26, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">Admin dashboard</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Route guards send guests to sign-in; signed-in admins get a dashboard and a users workspace with
                  create, update, and delete behind role-checked API routes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 25, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">Drizzle and Postgres</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Drizzle models auth tables and migrations; the API shares one database client pattern so schema
                  changes stay traceable.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6 md:col-span-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <Newspaper className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                  Applied April 27, 2026
                </p>
                <h4 className="font-heading text-lg font-semibold">Richer public web</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  The homepage adopts a magazine layout—display typography, editorial spacing, and shared UI from the
                  package workspace—while this site stays unauthenticated and fast to iterate.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Separator className="mb-16" />

        <section className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <h3 className="font-heading text-2xl font-semibold tracking-tight">What&apos;s next</h3>
            <div className="flex-1 border-t border-foreground/10" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-heading text-lg font-semibold">Roadmap</h4>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-relaxed text-muted-foreground">
                  <li>Broader API and frontend behavior tests</li>
                  <li>Shared API/query client defaults when web and admin need to stay aligned</li>
                  <li>Optional OAuth, verification, and stronger account security</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <footer className="flex flex-col items-center gap-6 pb-10">
          <p className="max-w-lg text-center text-sm leading-relaxed text-muted-foreground">
            This page is a living note of visible milestones. For architecture detail, see the project specification and
            the About page.
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

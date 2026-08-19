import { Badge } from "@repo/ui/components/badge";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";
import { AbstractIllustration } from "./components/AbstractIllustration";
import {
  ClipboardList,
  Cpu,
  Database,
  Bell,
  GitBranch,
  Images,
  KeyRound,
  LayoutDashboard,
  LayoutGrid,
  Layers,
  Mail,
  Palette,
  PenLine,
  ShieldCheck,
  UploadCloud,
  Zap,
} from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { resolveApiUrl } from "@/lib/api";
import { HOME_RECENT_LIMIT, recentBlogPostsQuery } from "@/lib/blog-queries";

function App() {
  const { data } = useSuspenseQuery(recentBlogPostsQuery(HOME_RECENT_LIMIT));
  const recentPosts = data.posts;
  const appSurfaces = [
    {
      name: "Public web",
      path: "apps/web",
      port: "5173",
      description:
        "A Vite + React public site with TanStack Router, contact forms, blog pages, recent posts, live API data, and shared theme controls.",
    },
    {
      name: "Admin dashboard",
      path: "apps/admin",
      port: "5000",
      description:
        "An authenticated dashboard with Better Auth guards, users, leads, notifications, blog publishing, media library, profile settings, and uploads.",
    },
    {
      name: "API backend",
      path: "apps/api",
      port: "3000",
      description:
        "A Bun + Hono service for auth, contact intake, blog/media APIs, admin APIs, readiness checks, Drizzle data access, S3 uploads, and BullMQ workers.",
    },
  ];
  const includedFeatures = [
    {
      icon: KeyRound,
      label: "Authentication",
      title: "Better Auth is wired in",
      description:
        "Email/password auth, password reset email, session cookies, the admin plugin, and a first-admin seed flow are ready for local projects.",
    },
    {
      icon: ShieldCheck,
      label: "Admin",
      title: "Protected management tools",
      description:
        "Admin-only routes handle users, leads, profile settings, and sign-out through guarded Hono API endpoints.",
    },
    {
      icon: Database,
      label: "Database",
      title: "Postgres + Drizzle",
      description:
        "The API uses Drizzle ORM with PostgreSQL, migrations, schema files, and a Docker Compose service for local development.",
    },
    {
      icon: Mail,
      label: "Leads",
      title: "Contact to dashboard flow",
      description:
        "Public contact submissions land in the API, emit a domain event, and surface in the admin dashboard with stats and lead management.",
    },
    {
      icon: Bell,
      label: "Realtime",
      title: "Admin notifications",
      description:
        "Lead events create persisted admin notifications, publish realtime updates over SSE, and appear in the dashboard notification bell with unread counts.",
    },
    {
      icon: GitBranch,
      label: "Workers",
      title: "Redis-backed job queues",
      description:
        "BullMQ queues dispatch domain events, send password reset email, create notifications, and are covered by production readiness checks.",
    },
    {
      icon: UploadCloud,
      label: "Storage",
      title: "S3-compatible media",
      description:
        "Local MinIO support powers signed avatar uploads and a reusable media library with stable public image URLs.",
    },
    {
      icon: PenLine,
      label: "Blog",
      title: "Tiptap publishing workflow",
      description:
        "Admins can draft and publish blog posts with metadata, cover images, media insertion, and resizable aligned inline images.",
    },
    {
      icon: Images,
      label: "Media",
      title: "Reusable image library",
      description:
        "The admin media section supports upload, thumbnail browsing, preview modals, copyable URLs, deletion, and blog insertion.",
    },
    {
      icon: Palette,
      label: "Theme",
      title: "Shared light and dark mode",
      description:
        "A reusable theme provider and toggle keep public and admin interfaces aligned with persisted visual preferences.",
    },
    {
      icon: LayoutDashboard,
      label: "UI",
      title: "Shared shadcn package",
      description:
        "Reusable components, global styles, Tailwind CSS v4, and editorial typography live in `@repo/ui` for both app surfaces.",
    },
    {
      icon: ClipboardList,
      label: "Quality",
      title: "Tests and CI checks",
      description:
        "Root scripts run tests, type checks, lint, and builds through Turbo so API and frontend behavior have a repeatable safety net.",
    },
  ];
  const workflowItems = [
    "Install once with Bun workspaces",
    "Run apps together with Turborepo",
    "Proxy `/api` from web and admin to Hono",
    "Seed the first admin account",
    "Submit public contact forms",
    "Manage users, leads, notifications, blog posts, media, profile, and avatar",
    "Run Redis-backed jobs and realtime notification streams",
    "Send password reset email through Resend workers",
    "Check database, Redis, storage, and auth readiness",
    "Publish public blog posts with Tiptap content",
    "Reuse media images in covers and inline content",
    "Switch themes in web or admin",
    "Share TypeScript, ESLint, and Prettier presets",
    "Verify changes with GitHub Actions tests, lint, types, and builds",
    "Build production API and worker artifacts for Docker",
    "Keep future contracts in `packages/types`",
  ];

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Masthead */}
        <header className="flex flex-col items-center gap-3 pb-6">
          <div className="w-full border-t border-foreground/20" />
          <div className="flex w-full items-center justify-between py-2">
            <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              Issue 01
            </span>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">The Baseplate</h2>
            <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="w-full border-t border-foreground/20" />
        </header>

        {/* Cover Hero */}
        <section className="mb-16 grid gap-10 md:grid-cols-[1fr_380px] md:gap-12">
          <div className="flex flex-col gap-6">
            <Badge variant="default" className="w-fit text-[0.65rem] tracking-[0.2em]">
              COVER STORY
            </Badge>
            <h1 className="font-heading text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl lg:text-7xl">
              A full-stack TypeScript baseplate with auth, admin, publishing, media, jobs, and shared UI.
            </h1>
            <p className="font-heading text-xl font-medium italic text-muted-foreground md:text-2xl">
              Start new projects from a working backend, dashboard, database, worker, public site, publishing workflow,
              and theme system.
            </p>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              Inside: Bun workspaces, Turborepo pipelines, Vite React frontends, a Hono API, Better Auth sessions,
              contact intake, lead management, blog publishing, a reusable media library, signed uploads, realtime
              notifications, password reset email, Drizzle migrations, PostgreSQL, Redis readiness, MinIO, Docker
              targets, CI tests, and shadcn/ui components ready to extend.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <AbstractIllustration />
          </div>
        </section>

        <Separator className="mb-16" />

        {/* Recent Blog Posts */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <h3 className="font-heading text-2xl font-semibold tracking-tight">Recent Blog Posts</h3>
            <div className="flex-1 border-t border-foreground/10" />
            <Link
              to="/blog"
              className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground"
            >
              View all
            </Link>
          </div>
          {recentPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {recentPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  {post.coverImage ? (
                    <img src={resolveApiUrl(post.coverImage)} alt="" className="aspect-video w-full object-cover" />
                  ) : null}
                  <CardHeader>
                    <Badge variant="secondary" className="mb-2 w-fit text-[0.6rem] tracking-[0.15em] uppercase">
                      {post.category ?? "Article"}
                    </Badge>
                    <CardTitle className="font-heading text-xl">
                      <Link to="/blog/$slug" params={{ slug: post.slug }} className="hover:text-primary">
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border border-dashed p-8 text-center text-sm text-muted-foreground">
              Published posts will appear here.
            </div>
          )}
        </section>

        {/* App Surfaces */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <h3 className="font-heading text-2xl font-semibold tracking-tight">Included Apps</h3>
            <div className="flex-1 border-t border-foreground/10" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {appSurfaces.map((surface) => (
              <Card key={surface.path} className="gap-0">
                <CardHeader className="pb-4">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <Badge variant="default" className="text-[0.6rem] tracking-[0.15em]">
                      PORT {surface.port}
                    </Badge>
                    <code className="rounded bg-muted px-1.5 py-1 text-xs text-muted-foreground">{surface.path}</code>
                  </div>
                  <CardTitle className="font-heading text-2xl font-semibold normal-case tracking-tight">
                    {surface.name}
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm text-muted-foreground">
                    Ready-to-run workspace
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{surface.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="mb-16" />

        {/* Feature Articles Grid */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <h3 className="font-heading text-2xl font-semibold tracking-tight">What's Included</h3>
            <div className="flex-1 border-t border-foreground/10" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {includedFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <div key={feature.title} className="flex items-start gap-4 border border-foreground/10 p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-3 text-[0.6rem] tracking-[0.15em]">
                      {feature.label}
                    </Badge>
                    <h4 className="font-heading text-lg font-semibold">{feature.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <Separator className="mb-16" />

        {/* Spec Sheet / Detail Grid */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <h3 className="font-heading text-2xl font-semibold tracking-tight">Architecture Notes</h3>
            <div className="flex-1 border-t border-foreground/10" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <Cpu className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-heading text-lg font-semibold">Shared UI and Theme Package</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">@repo/ui</code> exports shadcn components,
                  Tailwind tokens, global styles, fonts, and the theme provider consumed by every React app in the
                  workspace.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <GitBranch className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-heading text-lg font-semibold">API Proxy</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Vite dev server proxies <code className="rounded bg-muted px-1 py-0.5 text-xs">/api/*</code> to the
                  Hono backend. Seamless local development with no CORS headaches.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <LayoutGrid className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-heading text-lg font-semibold">Typed Data Flows</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  TanStack Query keys, API helpers, TanStack Form state, and strict TypeScript keep data fetching and
                  mutations predictable across public and admin flows.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-foreground/10 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-heading text-lg font-semibold">Turborepo Pipeline and Docker Runtime</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Root scripts call Turbo tasks for development, tests, builds, real ESLint checks, type checks, and CI.
                  Production Docker targets run the built API and worker artifacts.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Separator className="mb-16" />

        {/* Workflow Checklist */}
        <section className="mb-16 grid gap-8 border border-foreground/10 p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
          <div>
            <Badge variant="default" className="mb-4 text-[0.6rem] tracking-[0.15em]">
              STARTER FLOW
            </Badge>
            <h3 className="font-heading text-3xl font-semibold tracking-tight">
              Designed to become your next product quickly.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The repo documents local services, migrations, admin seeding, uploads, app ports, and frontend data
              conventions so teams can clone, configure, and build from a working baseline.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {workflowItems.map((item) => (
              <div key={item} className="flex items-center gap-3 bg-muted/40 px-4 py-3 text-sm">
                <Zap className="h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <Separator className="mb-16" />

        {/* Editor's Note */}
        <footer className="flex flex-col items-center gap-6 pb-10">
          <blockquote className="max-w-2xl text-center">
            <p className="font-heading text-xl italic leading-relaxed text-muted-foreground md:text-2xl">
              "The best developer experience is the one you do not notice — it simply gets out of the way and lets you
              build."
            </p>
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-foreground/20" />
            <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              Editor's Note
            </span>
            <div className="h-px w-12 bg-foreground/20" />
          </div>
          <p className="max-w-lg text-center text-sm leading-relaxed text-muted-foreground">
            This page is rendered by <code className="rounded bg-muted px-1 py-0.5 text-xs">apps/web</code>, pulling
            live data from <code className="rounded bg-muted px-1 py-0.5 text-xs">apps/api</code>, and styled with
            theme-aware components from <code className="rounded bg-muted px-1 py-0.5 text-xs">packages/ui</code>. All
            running on Bun, orchestrated by Turborepo.
          </p>
        </footer>
      </div>
    </main>
  );
}

export default App;

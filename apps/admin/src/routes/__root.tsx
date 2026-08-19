import { createRootRoute, Link, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@repo/ui/components/button";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@repo/ui/components/sidebar";
import { ThemeToggle } from "@repo/ui/components/theme-toggle";
import { Toaster } from "@repo/ui/components/sonner";
import { TooltipProvider } from "@repo/ui/components/tooltip";
import { AdminChatWidget } from "@/components/admin-chat-widget";
import { AdminBreadcrumbs } from "@/components/admin-breadcrumbs";
import { AdminNotificationBell } from "@/components/admin-notification-bell";
import { AppSidebar } from "@/components/app-sidebar";
import { NavUser } from "@/components/nav-user";
import { adminApi, resolveApiUrl } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { adminProfileKeys } from "@/lib/query-keys";

type HeaderProfile = {
  name: string;
  email: string;
  image: string | null;
};

const fallbackUser = {
  name: "Admin",
  email: "",
  avatar: "",
};
const publicPaths = new Set(["/login", "/forgot-password", "/reset-password"]);

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    const { data: session } = await authClient.getSession();

    if (publicPaths.has(location.pathname)) {
      if (session) {
        throw redirect({ to: "/dashboard" });
      }

      return;
    }

    if (!session) {
      throw redirect({ to: "/login" });
    }
  },
  component: RootComponent,
  notFoundComponent: AdminNotFoundPage,
});

function RootComponent() {
  const location = useRouterState({ select: (s) => s.location });
  const isPublicPath = publicPaths.has(location.pathname);
  const { data: session } = authClient.useSession();
  const { data: profile } = useQuery({
    queryKey: adminProfileKeys.detail(),
    queryFn: async () => {
      const data = await adminApi<{ user: HeaderProfile }>("/api/admin/profile");

      return data.user;
    },
    enabled: Boolean(session) && !isPublicPath,
  });

  if (isPublicPath) {
    return <Outlet />;
  }

  const user = {
    name: profile?.name || session?.user.name || fallbackUser.name,
    email: profile?.email || session?.user.email || fallbackUser.email,
    avatar: resolveApiUrl(profile?.image || session?.user.image || fallbackUser.avatar),
  };

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <header className="flex h-14 min-w-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <AdminBreadcrumbs />
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <ThemeToggle />
              <AdminNotificationBell />
              <NavUser user={user} />
            </div>
          </header>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
      <AdminChatWidget />
      <Toaster />
    </TooltipProvider>
  );
}

function AdminNotFoundPage() {
  return (
    <main className="flex min-h-[calc(100svh-3.5rem)] flex-col bg-background text-foreground">
      <div className="flex flex-1 items-center justify-center bg-linear-to-b from-muted/35 via-background to-background px-4 py-12 sm:px-8">
        <section className="w-full max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-px w-10 bg-primary" aria-hidden />
          <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Page not found
          </p>
          <h1 className="font-heading mt-5 text-[clamp(4.75rem,14vw,9.5rem)] leading-[0.9] font-semibold tracking-tighter">
            404
          </h1>
          <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
            This path is not part of the admin app. It may be outdated or mistyped.
          </p>
          <div className="mt-9 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center sm:gap-3">
            <Button asChild className="min-w-0 sm:min-w-48">
              <Link to="/dashboard">Back to dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="min-w-0 sm:min-w-48">
              <Link to="/activity">Open activity</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

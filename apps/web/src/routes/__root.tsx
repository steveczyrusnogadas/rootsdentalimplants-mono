import type { ReactNode } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import appCss from "../index.css?url";
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
  }),
  component: Outlet,
  shellComponent: RootDocument,
  notFoundComponent: () => (
    <main className="missing-page">
      <p className="eyebrow">ROOTS DENTAL IMPLANT CENTER / 404</p>
      <h1>
        This page hasn’t
        <br />
        put down roots.
      </h1>
      <p>Let’s get you back to a familiar place.</p>
      <a href="/" className="button">
        Back to home
      </a>
    </main>
  ),
});
function RootDocument({ children }: { children: ReactNode }) {
  const { queryClient } = Route.useRouteContext();
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}

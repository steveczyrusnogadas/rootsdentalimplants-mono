import { useLocale, localizeTree } from "@/lib/i18n";
import type { ReactNode } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import appCss from "../index.css?url";
import innerCss from "../inner-pages.css?url";
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: innerCss },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon.png" },
    ],
  }),
  component: Outlet,
  shellComponent: RootDocument,
  notFoundComponent: MissingPage,
});
function MissingPage() {
  const locale = useLocale();
  return localizeTree(
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
    </main>,
    locale,
  );
}
function RootDocument({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const { queryClient } = Route.useRouteContext();
  return (
    <html lang={locale}>
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

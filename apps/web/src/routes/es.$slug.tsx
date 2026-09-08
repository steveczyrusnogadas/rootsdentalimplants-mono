import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { findPage } from "@/content/pages";
import { InnerPage } from "@/components/inner-page";
import { localizePage } from "@/lib/i18n";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/es/$slug")({
  loader: ({ params }) => {
    if (params.slug === "implantes-dentales") throw redirect({ href: "/es/dental-implants/", statusCode: 301 });
    const page = findPage(params.slug);
    if (!page) throw notFound();
    return localizePage(page, "es");
  },
  head: ({ loaderData }) => pageHead(loaderData, "es"),
  component: SpanishPublicPage,
});

function SpanishPublicPage() {
  return <InnerPage page={Route.useLoaderData()} />;
}

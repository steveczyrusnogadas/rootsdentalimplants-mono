import { createFileRoute, notFound } from "@tanstack/react-router";
import { findPage } from "@/content/pages";
import { InnerPage } from "@/components/inner-page";

export const Route = createFileRoute("/$slug")({
  loader: ({ params }) => {
    const page = findPage(params.slug);
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData: page }) => ({
    meta: page
      ? [
          { title: `${page.seoTitle ?? page.title} | Roots Dental Implant Center` },
          { name: "description", content: page.description },
          { property: "og:title", content: `${page.seoTitle ?? page.title} | Roots Dental Implant Center` },
          { property: "og:description", content: page.description },
          { property: "og:type", content: "website" },
        ]
      : [{ title: "Page not found | Roots Dental Implant Center" }],
  }),
  component: PublicPage,
});

function PublicPage() {
  return <InnerPage page={Route.useLoaderData()} />;
}

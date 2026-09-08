import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { findPage } from "@/content/pages";
import { pageHead } from "@/lib/page-head";
import { InnerPage } from "@/components/inner-page";

export const Route = createFileRoute("/$slug")({
  loader: ({ params }) => {
    if (params.slug === "implantes-dentales") throw redirect({ href: "/es/dental-implants/", statusCode: 301 });
    const page = findPage(params.slug);
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => pageHead(loaderData, "en"),
  component: PublicPage,
});

function PublicPage() {
  return <InnerPage page={Route.useLoaderData()} />;
}

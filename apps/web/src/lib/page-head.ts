import type { Page } from "@/content/pages";
import type { Locale } from "./i18n";
export function languageLinks(path: string) {
  return [
    { rel: "alternate", hrefLang: "en", href: path },
    { rel: "alternate", hrefLang: "es", href: `/es${path}` },
    { rel: "alternate", hrefLang: "x-default", href: path },
  ];
}
export function pageHead(page: Page | undefined, locale: Locale) {
  const title = page
    ? `${page.seoTitle ?? page.title} | Roots Dental Implant Center`
    : `${locale === "es" ? "Página no encontrada" : "Page not found"} | Roots Dental Implant Center`;
  return {
    meta: [
      { title },
      { name: "description", content: page?.description ?? "" },
      { property: "og:title", content: title },
      { property: "og:description", content: page?.description ?? "" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: locale === "es" ? "es_US" : "en_US" },
    ],
    links: page ? languageLinks(`/${page.slug}/`) : [],
  };
}

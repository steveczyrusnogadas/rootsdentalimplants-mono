import { languageLinks } from "./page-head";
import type { Locale } from "./i18n";
export function homeHead(locale: Locale = "en") {
  const title = "Roots Dental Implant Center | Oregon & Washington";
  const description =
    locale === "es"
      ? "Conozca la atención con implantes dentales y al equipo de Roots. Encuentre su centro en Portland, Gresham, Troutdale, Salem o Vancouver."
      : "Explore dental implant care and meet the Roots team. Find your implant center in Portland, Gresham, Troutdale, Salem, or Vancouver.";
  return {
    links: languageLinks("/"),
    meta: [
      { property: "og:locale", content: locale === "es" ? "es_US" : "en_US" },
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  };
}

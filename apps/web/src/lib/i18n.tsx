import { Children, cloneElement, isValidElement, type ReactNode, type ReactElement } from "react";
import { useRouterState } from "@tanstack/react-router";
import { esUi } from "@/content/es-ui";
import { esPages } from "@/content/es-pages";
import type { Page } from "@/content/pages";

export type Locale = "en" | "es";
export function localeForPath(path: string): Locale {
  return /^\/es(?:\/|$)/.test(path) || /^\/implantes-dentales\/?$/.test(path) ? "es" : "en";
}
export function useLocale(): Locale {
  return useRouterState({ select: (state) => localeForPath(state.location.pathname) });
}
export function localizedHref(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//") || /\.[a-z0-9]+(?:[?#]|$)/i.test(href)) return href;
  const path = href.replace(/^\/es(?=\/|$)/, "") || "/";
  return locale === "es" ? `/es${path}` : path;
}
export function translate(text: string, locale: Locale): string {
  if (locale === "en") return text;
  const key = text.replace(/\s+/g, " ").trim();
  const translated = esUi[key] ?? esPages[key];
  if (translated !== undefined) return text.replace(/\S[\s\S]*\S|\S/, translated);
  if (key.startsWith("Watch ")) return `Ver ${translate(key.slice(6), locale)}`;
  const patterns: [RegExp, string][] = [
    [/^View (.+)’s profile$/, "Ver el perfil de $1"],
    [/^Book in (.+)$/, "Reservar en $1"],
    [
      /^Before treatment, Roots gallery comparison (\d+)$/,
      "Antes del tratamiento, comparación $1 de la galería de Roots",
    ],
    [
      /^After treatment, Roots gallery comparison (\d+)$/,
      "Después del tratamiento, comparación $1 de la galería de Roots",
    ],
    [/^Book a visit in (.+)$/, "Reservar una cita en $1"],
    [/^Step (\d+) of (\d+)$/, "Paso $1 de $2"],
    [/^(.+) implant center$/, "Centro de implantes de $1"],
  ];
  for (const [pattern, replacement] of patterns) if (pattern.test(key)) return key.replace(pattern, replacement);
  return text;
}
/** Translate public text and accessible labels before React renders HTML; never modifies handlers, IDs or media URLs. */
export function localizeTree(node: ReactNode, locale: Locale): ReactNode {
  if (locale === "en") return node;
  if (typeof node === "string") return translate(node, locale);
  if (Array.isArray(node)) return Children.map(node, (child) => localizeTree(child, locale));
  if (!isValidElement(node)) return node;
  const element = node as ReactElement<Record<string, unknown>>;
  const props: Record<string, unknown> = {};
  for (const name of ["alt", "title", "aria-label", "placeholder"]) {
    if (typeof element.props[name] === "string") props[name] = translate(element.props[name] as string, locale);
  }
  if (
    typeof element.type === "string" &&
    typeof element.props.href === "string" &&
    !element.props["data-language-switch"]
  )
    props.href = localizedHref(element.props.href, locale);
  if (element.props.children !== undefined) props.children = localizeTree(element.props.children as ReactNode, locale);
  return cloneElement(element, props);
}
export function localizePage(page: Page, locale: Locale): Page {
  if (locale === "en") return page;
  return {
    ...page,
    title: translate(page.title, locale),
    seoTitle: page.seoTitle && translate(page.seoTitle, locale),
    eyebrow: translate(page.eyebrow, locale),
    description: translate(page.description, locale),
    imageAlt: page.imageAlt && translate(page.imageAlt, locale),
    sections: page.sections?.map((section) => ({
      title: translate(section.title, locale),
      paragraphs: section.paragraphs.map((text) => translate(text, locale)),
    })),
  };
}

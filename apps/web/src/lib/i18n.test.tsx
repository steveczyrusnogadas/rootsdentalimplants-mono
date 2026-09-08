import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { localizePage, localizedHref, localizeTree, localeForPath, translate } from "./i18n";
import { events, faqs, pages } from "@/content/pages";
import { esPages } from "@/content/es-pages";

describe("Spanish public site", () => {
  it("keeps English default and recognizes only the Spanish route prefix", () => {
    expect(localeForPath("/faq/")).toBe("en");
    expect(localeForPath("/es/faq/")).toBe("es");
    expect(localeForPath("/es")).toBe("es");
    expect(localeForPath("/estimate/")).toBe("en");
  });
  it("keeps route counterparts and booking, lender, media and anchor targets intact", () => {
    expect(localizedHref("/faq/#comfort", "es")).toBe("/es/faq/#comfort");
    expect(localizedHref("/es/faq/", "en")).toBe("/faq/");
    for (const href of [
      "https://app.nexhealth.com/appt/arvory_dental_management?lid=131670",
      "https://www.proceedfinance.com/application/create?referrer=8190-1539-28F4",
      "/images/clinic.jpg",
      "tel:503-855-6353",
      "#locations",
    ])
      expect(localizedHref(href, "es")).toBe(href);
  });
  it("renders translations in server HTML, preserving controls and language switch destination", () => {
    const html = renderToStaticMarkup(
      localizeTree(
        <div>
          <a href="/faq/">Frequently asked questions</a>
          <a href="/faq/" data-language-switch="true">
            English
          </a>
          <input id="first-name" placeholder="First name" />
          <span>$18,995</span>
        </div>,
        "es",
      ),
    );
    expect(html).toContain('href="/es/faq/"');
    expect(html).toContain("Preguntas frecuentes");
    expect(html).toContain('href="/faq/"');
    expect(html).toContain('id="first-name" placeholder="Nombre"');
    expect(html).toContain("$18,995");
  });
  it("covers every public page section, FAQ and event description", () => {
    for (const page of pages) {
      const localized = localizePage(page, "es");
      expect(localized.slug).toBe(page.slug);
      expect(localized.kind).toBe(page.kind);
      expect(localized.image).toBe(page.image);
      const fields = [
        page.description,
        page.eyebrow,
        ...(page.sections?.flatMap((s) => [s.title, ...s.paragraphs]) ?? []),
      ];
      for (const field of fields) expect(esPages[field.replace(/\s+/g, " ").trim()]).toBeDefined();
    }
    for (const faq of faqs)
      for (const value of [faq.question, faq.answer]) expect(translate(value, "es")).not.toBe(value);
    for (const event of events)
      for (const field of [event.videoTitle, event.offer, event.offerDetails])
        if (field) expect(translate(field, "es")).not.toBe(field);
  });
});

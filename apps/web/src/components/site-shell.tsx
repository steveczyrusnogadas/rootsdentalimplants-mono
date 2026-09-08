import { localizedHref, localizeTree, useLocale } from "@/lib/i18n";
import { useRouterState } from "@tanstack/react-router";
import "@/language-switch.css";
import { Fragment, useEffect, useRef, useState } from "react";
import { BackToTop } from "./back-to-top";
import { ArrowUpRight, ChevronDown, Languages, Menu, X } from "lucide-react";

const groups = [
  {
    label: "Treatments",
    links: [
      ["Explore dental implants", "/dental-implants/"],
      ["Single-tooth implants", "/single-tooth-implants/"],
      ["Full-arch implants", "/full-arch-dental-implants/"],
      ["Implant-supported dentures", "/implant-supported-dentures/"],
    ],
  },
  {
    label: "Patient resources",
    links: [
      ["Frequently asked questions", "/faq/"],
      ["Financing & insurance", "/finance-insurance/"],
      ["Before & after", "/before-after/"],
      ["Patient stories", "/testimonials/"],
      ["Implant eligibility quiz", "/implant-eligibility-quiz/"],
      ["Smile preview", "/smile-preview/"],
      ["Implant dinner events", "/contact-us/#events"],
    ],
  },
];

export function SiteHeader() {
  const currentPath = useRouterState({ select: (state) => state.location.pathname });
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<string | null>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) {
        setGroup(null);
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  const closeMenus = () => {
    setGroup(null);
    setOpen(false);
  };
  return localizeTree(
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header
        className="site-header"
        ref={header}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            const target =
              !open && group
                ? header.current?.querySelector<HTMLButtonElement>(`[data-group="${group}"]`)
                : header.current?.querySelector<HTMLButtonElement>(".menu-toggle");
            closeMenus();
            target?.focus();
          }
        }}
      >
        <a href="/" className="brand" aria-label="Roots Dental Implant Center home">
          <img src="/images/logo.png" width="1040" height="461" alt="Roots Dental Implant Center" />
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {groups.map((item, index) => (
            <Fragment key={item.label}>
              {index === 1 && <a href="/why-choose-us/">Our team</a>}
              <div
                className="nav-group"
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node)) setGroup(null);
                }}
              >
                <button
                  type="button"
                  data-group={item.label}
                  aria-expanded={group === item.label}
                  aria-controls={`nav-group-${index}`}
                  onClick={() => setGroup(group === item.label ? null : item.label)}
                >
                  {item.label}
                  <ChevronDown size={15} />
                </button>
                {group === item.label && (
                  <div id={`nav-group-${index}`} className="nav-dropdown">
                    {item.links.map(([label, href]) => (
                      <a href={href} key={href} onClick={closeMenus}>
                        {label}
                        <ArrowUpRight size={15} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </Fragment>
          ))}
          <a href="/locations/">Locations</a>
        </nav>
        <div className="header-actions">
          <a
            className="language-switch"
            href={localizedHref(currentPath, locale === "en" ? "es" : "en")}
            hrefLang={locale === "en" ? "es" : "en"}
            lang={locale === "en" ? "es" : "en"}
            aria-label={locale === "en" ? "Cambiar a español" : "Switch to English"}
            title={locale === "en" ? "Español" : "English"}
            data-language-switch="true"
          >
            <Languages size={20} aria-hidden="true" />
          </a>
          <a href="/contact-us/#locations" className="button header-book">
            Let’s talk <ArrowUpRight size={17} />
          </a>
        </div>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => {
            setOpen(!open);
            setGroup(null);
          }}
        >
          {open ? <X /> : <Menu />}
        </button>
        {open && (
          <nav id="mobile-navigation" className="mobile-nav expanded-mobile-nav" aria-label="Mobile navigation">
            <a href="/" onClick={closeMenus}>
              Home
            </a>
            <a href="/why-choose-us/" onClick={closeMenus}>
              Our team
              <ArrowUpRight size={18} />
            </a>
            {groups.map((item, index) => (
              <div className="mobile-nav-group" key={item.label}>
                <button
                  type="button"
                  data-group={item.label}
                  aria-expanded={group === item.label}
                  aria-controls={`mobile-group-${index}`}
                  onClick={() => setGroup(group === item.label ? null : item.label)}
                >
                  {item.label}
                  <ChevronDown size={18} />
                </button>
                {group === item.label && (
                  <div id={`mobile-group-${index}`}>
                    {item.links.map(([label, href]) => (
                      <a href={href} key={href} onClick={closeMenus}>
                        {label}
                        <ArrowUpRight size={16} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a href="/contact-us/" onClick={closeMenus}>
              Locations & contact
              <ArrowUpRight size={18} />
            </a>
          </nav>
        )}
      </header>
    </>,
    locale,
  );
}

export function SiteFooter() {
  const locale = useLocale();
  return localizeTree(
    <>
      <BackToTop />
      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="/" aria-label="Roots Dental Implant Center home">
              <img src="/images/logo.png" width="1040" height="461" alt="Roots Dental Implant Center" />
            </a>
            <p>
              Personalized implant care.
              <br />
              Rooted in Oregon & Washington.
            </p>
          </div>
          <nav aria-label="Footer implant care">
            <h2>Explore Roots</h2>
            <a href="/dental-implants/">Dental implant treatments</a>
            <a href="/before-after/">Before & after</a>
            <a href="/testimonials/">Patient stories</a>
            <a href="/why-choose-us/">Meet our team</a>
            <a href="/faq/">Frequently asked questions</a>
          </nav>
          <nav aria-label="Footer visit planning">
            <h2>Plan your visit</h2>
            <a href="/contact-us/">Locations & contact</a>
            <a href="/finance-insurance/">Financing & insurance</a>
            <a href="/implant-eligibility-quiz/">Implant eligibility quiz</a>
            <a href="/contact-us/#events">Implant dinner events</a>
            <a href="/smile-preview/">Smile preview</a>
            <a href="mailto:implants@rootsdental.com">implants@rootsdental.com</a>
          </nav>
          <div className="footer-consultation">
            <h2>Let’s talk about your smile.</h2>
            <p>Start with a conversation at your nearest Roots Implant Center.</p>
            <a className="button" href="/contact-us/#locations">
              Book a consultation <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Roots Dental Implant Center</span>
          <div className="footer-policy-links">
            <a href="/privacy/">Privacy</a>
            <a href="/terms/">SMS terms</a>
          </div>
        </div>
      </footer>
    </>,
    locale,
  );
}

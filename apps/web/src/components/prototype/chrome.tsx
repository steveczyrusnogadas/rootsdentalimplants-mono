// PROTOTYPE — shared Roots chrome for the homepage stub (ticket 08).
// Compact header locked by the look-principles ticket: logo, short nav,
// filled Book, quieter Call. Overlays the hero video, turns solid paper
// after a short scroll.
import { useEffect, useRef, useState } from "react";
import { navItems, PHONE_MAIN, locations } from "./data";

const innerNav = [
  { label: "Implant options", href: "#" },
  { label: "Why Roots", href: "#" },
  { label: "Smile stories", href: "#" },
  { label: "Our team", href: "#" },
  { label: "Locations", href: "#" },
] as const;

/** Inner-page header: solid paper from the start (look-principles ticket). */
export function PaperHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--paper)]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-8 px-6 lg:px-10">
        <a href="#" aria-label="Roots Dental Implant Center" className="shrink-0">
          <img src="/prototype/logo-color.png" alt="Roots Dental Implant Center" className="h-11 w-auto" />
        </a>
        <nav className="hidden items-center gap-8 text-[var(--forest)] lg:flex">
          {innerNav.map((item) => (
            <a key={item.label} href={item.href} className="font-display text-[0.95rem] font-semibold opacity-90 hover:opacity-100">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-6">
          <a href={`tel:${PHONE_MAIN}`} className="hidden text-base font-medium text-[var(--smoke)] sm:inline">
            Call {PHONE_MAIN}
          </a>
          <a
            href="#"
            className="font-display rounded-md bg-[var(--forest)] px-6 py-3 text-base font-semibold tracking-wide text-[var(--paper)] hover:bg-[var(--pine)]"
          >
            Book
          </a>
        </div>
      </div>
    </header>
  );
}

export function SiteHeader() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        solid ? "border-b border-[var(--line)] bg-[var(--paper)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-8 px-6">
        <a href="#" aria-label="Roots Dental Implant Center" className="shrink-0">
          <img src={solid ? "/prototype/logo-color.png" : "/prototype/logo-white.png"} alt="Roots Dental Implant Center" className="h-11 w-auto" />
        </a>
        <nav className={`hidden items-center gap-8 lg:flex ${solid ? "text-[var(--pine)]" : "text-[var(--paper)]"}`}>
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="font-display text-base font-medium tracking-wide opacity-90 hover:opacity-100">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-6">
          <a
            href="#locations"
            className={`hidden text-base font-medium sm:inline ${solid ? "text-[var(--smoke)]" : "text-[var(--paper)]/85"}`}
          >
            Call {PHONE_MAIN}
          </a>
          <a
            href="#book"
            className={`font-display rounded-md px-6 py-3 text-base font-semibold tracking-wide transition-colors ${
              solid
                ? "bg-[var(--forest)] text-[var(--paper)] hover:bg-[var(--pine)]"
                : "bg-[var(--paper)] text-[var(--forest)] hover:bg-[var(--mint)]"
            }`}
          >
            Book
          </a>
        </div>
      </div>
    </header>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[var(--pine)] text-[var(--paper)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <img src="/prototype/logo-white.png" alt="Roots Dental Implant Center" className="h-10 w-auto" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--paper)]/70">
            Five implant centers across Oregon and Southwest Washington. Call the location you’d like to visit.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xs font-semibold tracking-[0.18em] text-[var(--sage)] uppercase">Services</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-[var(--paper)]/80">
            <li>Dental Implants</li>
            <li>Full-Arch Dental Implants</li>
            <li>Single-Tooth Implants</li>
            <li>Implant-Supported Dentures</li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-xs font-semibold tracking-[0.18em] text-[var(--sage)] uppercase">Locations</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-[var(--paper)]/80">
            {locations.map((l) => (
              <li key={l.city} className="flex items-baseline justify-between gap-4">
                <span>{l.city}</span>
                <a href={`tel:${l.phone}`} className="text-[var(--paper)]/60 hover:text-[var(--paper)]">
                  {l.phone}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--line-light)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-5 text-xs text-[var(--paper)]/50 sm:flex-row sm:justify-between">
          <p>© 2026 Roots Dental Implant Center. All rights reserved.</p>
          <p>
            <a href="#" className="hover:text-[var(--paper)]">Privacy Policy</a>
            {" · "}
            <a href="#" className="hover:text-[var(--paper)]">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export function HeroVideo({
  children,
  scrim,
  className = "min-h-svh",
}: {
  children: React.ReactNode;
  scrim: string;
  className?: string;
}) {
  return (
    <div className={`relative flex flex-col overflow-hidden ${className}`}>
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/prototype/hero-poster.jpg"
      >
        <source src="/prototype/hero-video.mp4" type="video/mp4" />
      </video>
      <div className={`absolute inset-0 ${scrim}`} aria-hidden />
      {children}
    </div>
  );
}

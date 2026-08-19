// PROTOTYPE — Variant A "Quiet editorial": centered, light, generous rhythm.
// The Kai-clean take: one idea per band, calm type, photography-led.
import { HeroVideo, Reveal, SiteFooter, SiteHeader } from "./chrome";
import {
  doctors,
  experience,
  expertise,
  faqs,
  finalCta,
  hero,
  knowUs,
  locations,
  mapEmbed,
  pricing,
  stories,
  trustBadges,
  whyPoints,
  PHONE_MAIN,
} from "./data";

export const variantAName = "Quiet editorial";

export function VariantA() {
  return (
    <div className="roots-proto min-h-svh">
      <SiteHeader />

      <HeroVideo scrim="bg-[var(--forest)]/60" className="min-h-[68vh]">
        <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 pt-20 pb-14 text-center text-[var(--paper)]">
          <p className="font-display hero-in text-xs font-semibold tracking-[0.22em] uppercase">{hero.eyebrow}</p>
          <h1 className="font-display hero-in mt-6 text-5xl leading-[1.05] font-medium text-balance md:text-6xl" style={{ animationDelay: "90ms" }}>
            {hero.title}
          </h1>
          <p className="hero-in mt-6 max-w-xl text-lg leading-relaxed text-[var(--paper)]/85" style={{ animationDelay: "180ms" }}>
            {hero.support}
          </p>
          <div className="hero-in mt-10 flex flex-col items-center gap-4" style={{ animationDelay: "270ms" }}>
            <a
              href="#book"
              className="font-display rounded-md bg-[var(--paper)] px-8 py-3.5 text-base font-semibold tracking-wide text-[var(--forest)] transition-colors hover:bg-[var(--mint)]"
            >
              {hero.cta}
            </a>
            <a href="#locations" className="text-sm text-[var(--paper)]/75 underline-offset-4 hover:underline">
              or call {PHONE_MAIN}
            </a>
          </div>
        </div>
      </HeroVideo>

      <section className="border-b border-[var(--line)] bg-[var(--mint)]/60">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-3 px-6 py-8 text-center sm:flex-row sm:gap-10">
          <span className="font-display text-xs font-semibold tracking-[0.2em] text-[var(--smoke)] uppercase">
            You’re in good hands —
          </span>
          {trustBadges.map((b) => (
            <span key={b} className="font-display text-sm font-semibold tracking-wide text-[var(--forest)]">
              {b}
            </span>
          ))}
        </div>
      </section>

      <Reveal>
        <section className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
          <p className="font-display text-xs font-semibold tracking-[0.22em] text-[var(--sage)] uppercase">{pricing.eyebrow}</p>
          <h2 className="font-display mt-5 text-4xl font-medium text-balance md:text-5xl">{pricing.title}</h2>
          <div className="mt-14 grid gap-12 sm:grid-cols-2">
            {pricing.rows.map((row) => (
              <div key={row.label}>
                <p className="font-display text-sm font-medium tracking-[0.14em] text-[var(--smoke)] uppercase">{row.label}</p>
                <p className="font-display mt-3 text-5xl font-medium tracking-tight text-[var(--forest)]">{row.amount}</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--smoke)]">{row.note}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-12 max-w-md text-sm leading-relaxed text-[var(--smoke)]">{pricing.footnote}</p>
        </section>
      </Reveal>

      <section id="treatments" className="border-t border-[var(--line)] bg-[var(--mint)]/50">
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
          <Reveal>
            <h2 className="font-display text-center text-4xl font-medium text-balance md:text-5xl">Our areas of expertise</h2>
          </Reveal>
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {expertise.map((item, i) => (
              <Reveal key={item.title} delay={i * 90}>
                <article className="text-center">
                  <img src={item.image} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" loading="lazy" />
                  <h3 className="font-display mt-6 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--smoke)]">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
        <Reveal>
          <h2 className="font-display text-4xl font-medium text-balance md:text-5xl">Why choose us?</h2>
        </Reveal>
        <div className="mt-14 grid gap-x-12 gap-y-10 text-left sm:grid-cols-2">
          {whyPoints.map((point, i) => (
            <Reveal key={point.title} delay={i * 70}>
              <h3 className="font-display text-lg font-semibold">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--smoke)]">{point.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--line)]">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-24 md:grid-cols-2 md:py-32">
          <Reveal>
            <img src={experience.image} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" loading="lazy" />
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-display text-3xl font-medium text-balance md:text-4xl">{experience.title}</h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--smoke)]">{experience.body}</p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--mint)]/50">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <Reveal>
            <h2 className="font-display text-center text-4xl font-medium text-balance md:text-5xl">Meet our doctors</h2>
          </Reveal>
          <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
            {doctors.map((doc, i) => (
              <Reveal key={doc.name} delay={(i % 4) * 70}>
                <figure className="text-center">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="mx-auto aspect-square w-28 rounded-full object-cover md:w-36"
                    loading="lazy"
                  />
                  <figcaption className="mt-4">
                    <p className="font-display text-base font-semibold">{doc.name}</p>
                    <p className="mt-1 text-xs text-[var(--smoke)]">{doc.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line)]">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
          <Reveal>
            <h2 className="font-display text-4xl font-medium text-balance md:text-5xl">
              {knowUs.title} <span className="text-[var(--sage)]">({knowUs.length})</span>
            </h2>
            <figure className="group relative mt-12 overflow-hidden rounded-xl">
              <img src={knowUs.poster} alt="" className="aspect-video w-full object-cover" loading="lazy" />
              <span className="absolute inset-0 grid place-items-center bg-[var(--pine)]/30 transition-colors group-hover:bg-[var(--pine)]/40">
                <span className="grid size-16 place-items-center rounded-full bg-[var(--paper)]/95 text-[var(--forest)] transition-transform group-hover:scale-105">
                  <svg viewBox="0 0 16 16" className="ml-1 size-5 fill-current"><path d="M4 2l10 6-10 6z" /></svg>
                </span>
              </span>
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="bg-[var(--forest)] text-[var(--paper)]">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <Reveal>
            <h2 className="font-display text-center text-4xl font-medium text-balance md:text-5xl">Real stories, real smiles</h2>
            <p className="font-display mx-auto mt-10 max-w-2xl text-center text-2xl leading-snug font-medium text-balance text-[var(--mint)]">
              “{stories[0].quote}”
            </p>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {stories.map((story, i) => (
              <Reveal key={story.poster} delay={i * 90}>
                <figure className="group relative overflow-hidden rounded-lg">
                  <img src={story.poster} alt="" className="aspect-video w-full object-cover" loading="lazy" />
                  <span className="absolute inset-0 grid place-items-center bg-[var(--pine)]/35">
                    <span className="grid size-12 place-items-center rounded-full bg-[var(--paper)]/90 text-[var(--forest)]">
                      <svg viewBox="0 0 16 16" className="ml-0.5 size-4 fill-current"><path d="M4 2l10 6-10 6z" /></svg>
                    </span>
                  </span>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="proof" className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
        <Reveal>
          <h2 className="font-display text-4xl font-medium text-balance md:text-5xl">Before &amp; after</h2>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <Reveal>
            <figure>
              <img src="/prototype/before-1.jpg" alt="Before treatment" className="aspect-[4/3] w-full rounded-lg object-cover" loading="lazy" />
              <figcaption className="font-display mt-3 text-xs font-semibold tracking-[0.18em] text-[var(--smoke)] uppercase">Before</figcaption>
            </figure>
          </Reveal>
          <Reveal delay={120}>
            <figure>
              <img src="/prototype/after-1.jpg" alt="After treatment" className="aspect-[4/3] w-full rounded-lg object-cover" loading="lazy" />
              <figcaption className="font-display mt-3 text-xs font-semibold tracking-[0.18em] text-[var(--sage)] uppercase">After</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--mint)]/50">
        <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
          <Reveal>
            <h2 className="font-display text-center text-4xl font-medium text-balance md:text-5xl">
              Frequently asked questions
            </h2>
          </Reveal>
          <div className="mt-12 space-y-8">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <h3 className="font-display text-lg font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--smoke)]">{f.a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="locations" className="border-t border-[var(--line)]">
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
          <Reveal>
            <h2 className="font-display text-center text-4xl font-medium text-balance md:text-5xl">Five locations, one team</h2>
          </Reveal>
          <Reveal delay={120}>
            <iframe
              title="Roots Dental Implant Center locations map"
              src={mapEmbed}
              className="mt-12 h-96 w-full rounded-xl border border-[var(--line)]"
              loading="lazy"
            />
          </Reveal>
          <ul className="mx-auto mt-12 max-w-3xl divide-y divide-[var(--line)]">
            {locations.map((l) => (
              <li key={l.city} className="flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between">
                <span className="font-display text-xl font-semibold">{l.city}</span>
                <span className="text-sm text-[var(--smoke)]">{l.hours}</span>
                <a href={`tel:${l.phone}`} className="font-display text-base font-semibold text-[var(--forest)] hover:underline">
                  {l.phone}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="book" className="bg-[var(--forest)] text-[var(--paper)]">
        <div className="mx-auto max-w-2xl px-6 py-24 text-center md:py-32">
          <Reveal>
            <h2 className="font-display text-4xl leading-tight font-medium text-balance md:text-5xl">{finalCta.title}</h2>
            <a
              href="#"
              className="font-display mt-10 inline-block rounded-md bg-[var(--paper)] px-8 py-3.5 text-base font-semibold tracking-wide text-[var(--forest)] transition-colors hover:bg-[var(--mint)]"
            >
              {finalCta.cta}
            </a>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

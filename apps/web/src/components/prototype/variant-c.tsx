// PROTOTYPE — Variant C "Forest immersive": dark, moody, premium. Deep pine
// bands, mint type, giant display pricing, large story posters. Still logo
// greens — tests whether "clean" has to mean light.
import { HeroVideo, Reveal, SiteFooter, SiteHeader } from "./chrome";
import {
  doctors,
  experience,
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

export const variantCName = "Forest immersive";

export function VariantC() {
  return (
    <div className="roots-proto min-h-svh bg-[var(--pine)] text-[var(--paper)]">
      <SiteHeader />

      <HeroVideo scrim="bg-[var(--pine)]/70" className="min-h-[72vh]">
        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pt-20 pb-12">
          <p className="font-display hero-in text-xs font-semibold tracking-[0.24em] text-[var(--sage)] uppercase">{hero.eyebrow}</p>
          <h1
            className="font-display hero-in mt-6 max-w-3xl text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] font-medium text-balance"
            style={{ animationDelay: "90ms" }}
          >
            {hero.title}
          </h1>
          <p className="hero-in mt-6 max-w-lg text-lg leading-relaxed text-[var(--mint)]/85" style={{ animationDelay: "180ms" }}>
            {hero.support}
          </p>
          <div className="hero-in mt-10 flex flex-wrap items-center gap-6" style={{ animationDelay: "270ms" }}>
            <a
              href="#book"
              className="font-display rounded-md bg-[var(--sage)] px-8 py-3.5 text-base font-semibold tracking-wide text-[var(--pine)] transition-colors hover:bg-[var(--mint)]"
            >
              {hero.cta}
            </a>
            <a href="#locations" className="text-sm text-[var(--paper)]/70 underline-offset-4 hover:underline">
              or call {PHONE_MAIN}
            </a>
          </div>
        </div>
      </HeroVideo>

      <section className="border-y border-[var(--line-light)] bg-[var(--forest)]/40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-7">
          <span className="font-display text-xs font-semibold tracking-[0.2em] text-[var(--paper)]/50 uppercase">
            You’re in good hands —
          </span>
          {trustBadges.map((b) => (
            <span key={b} className="font-display text-sm font-semibold tracking-wide text-[var(--sage)]">
              {b}
            </span>
          ))}
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <Reveal>
            <p className="font-display text-xs font-semibold tracking-[0.24em] text-[var(--sage)] uppercase">{pricing.eyebrow}</p>
            <h2 className="font-display mt-5 max-w-xl text-3xl font-medium text-balance text-[var(--mint)] md:text-4xl">
              {pricing.title}
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-16 md:grid-cols-2">
            {pricing.rows.map((row, i) => (
              <Reveal key={row.label} delay={i * 120}>
                <div className="border-l-2 border-[var(--sage)]/50 pl-8">
                  <p className="font-display text-[clamp(3.5rem,8vw,6rem)] leading-none font-medium tracking-tight text-[var(--paper)] tabular-nums">
                    {row.amount}
                  </p>
                  <p className="font-display mt-4 text-sm font-semibold tracking-[0.16em] text-[var(--sage)] uppercase">{row.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--paper)]/60">{row.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-16 max-w-md text-sm leading-relaxed text-[var(--paper)]/50">{pricing.footnote}</p>
        </div>
      </section>

      <section id="why" className="border-t border-[var(--line-light)] bg-[var(--forest)]/40">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <Reveal>
            <h2 className="font-display max-w-lg text-3xl font-medium text-balance text-[var(--mint)] md:text-4xl">
              Why choose us?
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-lg bg-[var(--line-light)] sm:grid-cols-2 lg:grid-cols-4">
            {whyPoints.map((point) => (
              <div key={point.title} className="bg-[var(--pine)] p-7">
                <h3 className="font-display text-base font-semibold text-[var(--paper)]">{point.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--paper)]/60">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line-light)]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-24 md:grid-cols-2 md:py-32">
          <Reveal>
            <h2 className="font-display text-3xl font-medium text-balance text-[var(--mint)] md:text-4xl">{experience.title}</h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--paper)]/65">{experience.body}</p>
          </Reveal>
          <Reveal delay={120}>
            <img src={experience.image} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" loading="lazy" />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[var(--line-light)] bg-[var(--forest)]/40">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <Reveal>
            <h2 className="font-display text-3xl font-medium text-balance text-[var(--mint)] md:text-4xl">Meet our doctors</h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4 lg:grid-cols-7">
            {doctors.map((doc, i) => (
              <Reveal key={doc.name} delay={(i % 7) * 60}>
                <figure className="text-center">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="mx-auto aspect-square w-full max-w-32 rounded-full object-cover ring-2 ring-[var(--sage)]/40"
                    loading="lazy"
                  />
                  <figcaption className="mt-4">
                    <p className="font-display text-sm font-semibold text-[var(--paper)]">{doc.name}</p>
                    <p className="mt-1 text-[0.7rem] text-[var(--paper)]/50">{doc.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line-light)]">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
          <Reveal>
            <h2 className="font-display text-3xl font-medium text-balance text-[var(--mint)] md:text-4xl">
              {knowUs.title} <span className="text-[var(--sage)]">({knowUs.length})</span>
            </h2>
            <figure className="group relative mt-12 overflow-hidden rounded-xl">
              <img src={knowUs.poster} alt="" className="aspect-video w-full object-cover" loading="lazy" />
              <span className="absolute inset-0 grid place-items-center bg-[var(--pine)]/40 transition-colors group-hover:bg-[var(--pine)]/50">
                <span className="grid size-16 place-items-center rounded-full bg-[var(--paper)]/95 text-[var(--forest)] transition-transform group-hover:scale-105">
                  <svg viewBox="0 0 16 16" className="ml-1 size-5 fill-current"><path d="M4 2l10 6-10 6z" /></svg>
                </span>
              </span>
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[var(--line-light)] bg-[var(--forest)]/40">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <Reveal>
            <h2 className="font-display text-3xl font-medium text-balance text-[var(--mint)] md:text-4xl">
              Real stories, real smiles
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {stories.map((story, i) => (
              <Reveal key={story.poster} delay={i * 90}>
                <figure className="relative overflow-hidden rounded-lg">
                  <img src={story.poster} alt="" className="aspect-[4/5] w-full object-cover" loading="lazy" />
                  <span className="absolute inset-0 bg-gradient-to-t from-[var(--pine)]/90 via-[var(--pine)]/20 to-transparent" aria-hidden />
                  <span className="absolute top-4 left-4 grid size-10 place-items-center rounded-full bg-[var(--paper)]/90 text-[var(--forest)]">
                    <svg viewBox="0 0 16 16" className="ml-0.5 size-3.5 fill-current"><path d="M4 2l10 6-10 6z" /></svg>
                  </span>
                  <figcaption className="font-display absolute inset-x-5 bottom-5 text-base leading-snug font-medium text-[var(--paper)]">
                    “{story.quote}”
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="proof" className="border-t border-[var(--line-light)]">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <Reveal>
            <h2 className="font-display text-3xl font-medium text-balance text-[var(--mint)] md:text-4xl">Before &amp; after</h2>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            <Reveal>
              <figure>
                <img src="/prototype/before-1.jpg" alt="Before treatment" className="aspect-[4/3] w-full rounded-lg object-cover" loading="lazy" />
                <figcaption className="font-display mt-3 text-xs font-semibold tracking-[0.2em] text-[var(--paper)]/50 uppercase">
                  Before
                </figcaption>
              </figure>
            </Reveal>
            <Reveal delay={120}>
              <figure>
                <img src="/prototype/after-1.jpg" alt="After treatment" className="aspect-[4/3] w-full rounded-lg object-cover" loading="lazy" />
                <figcaption className="font-display mt-3 text-xs font-semibold tracking-[0.2em] text-[var(--sage)] uppercase">
                  After
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line-light)] bg-[var(--forest)]/40">
        <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
          <Reveal>
            <h2 className="font-display text-3xl font-medium text-balance text-[var(--mint)] md:text-4xl">
              Frequently asked questions
            </h2>
          </Reveal>
          <div className="mt-12 space-y-8">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <h3 className="font-display text-lg font-semibold text-[var(--paper)]">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--paper)]/60">{f.a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="locations" className="border-t border-[var(--line-light)]">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <Reveal>
            <h2 className="font-display text-3xl font-medium text-balance text-[var(--mint)] md:text-4xl">
              Five locations, one team
            </h2>
            <iframe
              title="Roots Dental Implant Center locations map"
              src={mapEmbed}
              className="mt-12 h-96 w-full rounded-xl border border-[var(--line-light)]"
              loading="lazy"
            />
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {locations.map((l, i) => (
              <Reveal key={l.city} delay={i * 60}>
                <div className="h-full rounded-lg border border-[var(--line-light)] bg-[var(--pine)]/60 p-6">
                  <p className="font-display text-lg font-semibold text-[var(--paper)]">{l.city}</p>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--paper)]/55">{l.hours}</p>
                  <a
                    href={`tel:${l.phone}`}
                    className="font-display mt-4 inline-block text-sm font-semibold text-[var(--sage)] hover:text-[var(--mint)]"
                  >
                    {l.phone}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="book" className="bg-[var(--paper)] text-[var(--pine)]">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <Reveal>
            <h2 className="font-display max-w-2xl text-[clamp(2rem,5vw,3.5rem)] leading-[1.08] font-medium text-balance">
              {finalCta.title}
            </h2>
            <a
              href="#"
              className="font-display mt-10 inline-block rounded-md bg-[var(--forest)] px-8 py-3.5 text-base font-semibold tracking-wide text-[var(--paper)] transition-colors hover:bg-[var(--pine)]"
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

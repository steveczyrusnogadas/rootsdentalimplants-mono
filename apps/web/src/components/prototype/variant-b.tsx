// PROTOTYPE — Variant B "The ledger": asymmetric editorial. Split hero (forest
// panel + video), bands on hairline rules with a left label rail, pricing as a
// ruled table, doctors as a horizontal strip.
import { Reveal, SiteFooter, SiteHeader } from "./chrome";
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
  PHONE_MAIN,
} from "./data";

export const variantBName = "The ledger";

function BandRail({ eyebrow, children, id }: { eyebrow: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="border-t border-[var(--line)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[220px_1fr] md:gap-16 md:py-24">
        <div>
          <p className="font-display text-xs font-semibold tracking-[0.22em] text-[var(--sage)] uppercase md:sticky md:top-28">
            {eyebrow}
          </p>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

export function VariantB() {
  return (
    <div className="roots-proto min-h-svh">
      <SiteHeader />

      <div className="grid min-h-[78vh] lg:grid-cols-2">
        <div className="relative flex items-center bg-[var(--forest)] px-6 pt-28 pb-14 text-[var(--paper)] lg:px-12">
          <div className="mx-auto w-full max-w-lg">
            <p className="font-display hero-in border-b border-[var(--line-light)] pb-4 text-[0.7rem] font-semibold tracking-[0.18em] text-[var(--sage)] uppercase">
              Portland · Vancouver · Salem · Gresham · Troutdale
            </p>
            <h1 className="font-display hero-in mt-7 text-4xl leading-[1.08] font-medium text-balance md:text-5xl" style={{ animationDelay: "90ms" }}>
              {hero.title}
            </h1>
            <p className="hero-in mt-5 text-base leading-relaxed text-[var(--paper)]/80" style={{ animationDelay: "180ms" }}>
              {hero.support}
            </p>
            <div className="hero-in mt-8 flex flex-wrap items-center gap-5" style={{ animationDelay: "270ms" }}>
              <a
                href="#book"
                className="font-display rounded-md bg-[var(--paper)] px-7 py-3 text-sm font-semibold tracking-wide text-[var(--forest)] transition-colors hover:bg-[var(--mint)]"
              >
                {hero.cta}
              </a>
              <a href="#locations" className="text-sm font-medium text-[var(--paper)]/75 underline-offset-4 hover:underline">
                or call {PHONE_MAIN}
              </a>
            </div>
          </div>
        </div>
        <div className="relative min-h-[40vh] overflow-hidden">
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
        </div>
      </div>

      <section className="border-b border-[var(--line)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-7">
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

      <BandRail eyebrow={pricing.eyebrow}>
        <Reveal>
          <h2 className="font-display max-w-lg text-3xl font-medium text-balance md:text-4xl">{pricing.title}</h2>
          <dl className="mt-10">
            {pricing.rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-t border-[var(--pine)]/60 py-6 last:border-b"
              >
                <div>
                  <dt className="font-display text-lg font-semibold">{row.label}</dt>
                  <dd className="mt-1 text-sm text-[var(--smoke)]">{row.note}</dd>
                </div>
                <dd className="font-display text-3xl font-medium tracking-tight text-[var(--forest)] tabular-nums md:text-4xl">
                  {row.amount}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm leading-relaxed text-[var(--smoke)]">{pricing.footnote}</p>
        </Reveal>
      </BandRail>

      <BandRail eyebrow="Expertise" id="treatments">
        <div className="space-y-16">
          {expertise.map((item, i) => (
            <Reveal key={item.title}>
              <article className={`grid items-center gap-8 md:grid-cols-2 ${i % 2 ? "md:[&>img]:order-2" : ""}`}>
                <img src={item.image} alt="" className="aspect-[4/3] w-full rounded-md object-cover" loading="lazy" />
                <div>
                  <h3 className="font-display text-2xl font-semibold">{item.title}</h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--smoke)]">{item.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </BandRail>

      <BandRail eyebrow="Experience" id="why">
        <Reveal>
          <div className="grid items-center gap-8 md:grid-cols-[1fr_1.2fr]">
            <img src={experience.image} alt="" className="aspect-square w-full rounded-md object-cover" loading="lazy" />
            <div>
              <h2 className="font-display text-3xl font-medium text-balance md:text-4xl">{experience.title}</h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--smoke)]">{experience.body}</p>
            </div>
          </div>
        </Reveal>
      </BandRail>

      <BandRail eyebrow="Doctors">
        <Reveal>
          <h2 className="font-display text-3xl font-medium text-balance md:text-4xl">Meet our doctors</h2>
        </Reveal>
        <div className="-mx-6 mt-10 overflow-x-auto px-6 pb-4">
          <div className="flex gap-6">
            {doctors.map((doc) => (
              <figure key={doc.name} className="w-44 shrink-0">
                <img src={doc.image} alt={doc.name} className="aspect-[3/4] w-full rounded-md object-cover" loading="lazy" />
                <figcaption className="mt-3">
                  <p className="font-display text-sm font-semibold">{doc.name}</p>
                  <p className="mt-0.5 text-xs text-[var(--smoke)]">{doc.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </BandRail>

      <BandRail eyebrow="The practice">
        <Reveal>
          <h2 className="font-display text-3xl font-medium text-balance md:text-4xl">
            {knowUs.title} <span className="text-[var(--sage)]">({knowUs.length})</span>
          </h2>
          <figure className="group relative mt-10 overflow-hidden rounded-md">
            <img src={knowUs.poster} alt="" className="aspect-video w-full object-cover" loading="lazy" />
            <span className="absolute inset-0 grid place-items-center bg-[var(--pine)]/30 transition-colors group-hover:bg-[var(--pine)]/40">
              <span className="grid size-16 place-items-center rounded-full bg-[var(--paper)]/95 text-[var(--forest)] transition-transform group-hover:scale-105">
                <svg viewBox="0 0 16 16" className="ml-1 size-5 fill-current"><path d="M4 2l10 6-10 6z" /></svg>
              </span>
            </span>
          </figure>
        </Reveal>
      </BandRail>

      <BandRail eyebrow="Patient stories">
        <Reveal>
          <p className="font-display max-w-2xl text-2xl leading-snug font-medium text-balance text-[var(--forest)] md:text-3xl">
            “{stories[1].quote}”
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {stories.map((story, i) => (
            <Reveal key={story.poster} delay={i * 90}>
              <figure className={`group relative overflow-hidden rounded-md ${i === 0 ? "sm:mt-10" : ""}`}>
                <img src={story.poster} alt="" className="aspect-video w-full object-cover" loading="lazy" />
                <span className="absolute inset-0 grid place-items-center bg-[var(--pine)]/30">
                  <span className="grid size-11 place-items-center rounded-full bg-[var(--paper)]/90 text-[var(--forest)]">
                    <svg viewBox="0 0 16 16" className="ml-0.5 size-4 fill-current"><path d="M4 2l10 6-10 6z" /></svg>
                  </span>
                </span>
              </figure>
            </Reveal>
          ))}
        </div>
      </BandRail>

      <BandRail eyebrow="Before & after" id="proof">
        <Reveal>
          <div className="grid gap-6 sm:grid-cols-[1fr_1fr]">
            <figure className="border border-[var(--line)] p-3">
              <img src="/prototype/before-1.jpg" alt="Before treatment" className="aspect-[4/3] w-full object-cover" loading="lazy" />
              <figcaption className="font-display pt-3 pb-1 text-xs font-semibold tracking-[0.18em] text-[var(--smoke)] uppercase">
                Before
              </figcaption>
            </figure>
            <figure className="border border-[var(--sage)] p-3">
              <img src="/prototype/after-1.jpg" alt="After treatment" className="aspect-[4/3] w-full object-cover" loading="lazy" />
              <figcaption className="font-display pt-3 pb-1 text-xs font-semibold tracking-[0.18em] text-[var(--sage)] uppercase">
                After
              </figcaption>
            </figure>
          </div>
        </Reveal>
      </BandRail>

      <BandRail eyebrow="FAQ">
        <Reveal>
          <h2 className="font-display text-3xl font-medium text-balance md:text-4xl">Frequently asked questions</h2>
        </Reveal>
        <dl className="mt-10">
          {faqs.map((f) => (
            <div key={f.q} className="border-t border-[var(--line)] py-6 last:border-b">
              <dt className="font-display text-lg font-semibold">{f.q}</dt>
              <dd className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--smoke)]">{f.a}</dd>
            </div>
          ))}
        </dl>
      </BandRail>

      <BandRail eyebrow="Locations" id="locations">
        <Reveal>
          <h2 className="font-display text-3xl font-medium text-balance md:text-4xl">Roots Dental Implant Center locations</h2>
          <iframe
            title="Roots Dental Implant Center locations map"
            src={mapEmbed}
            className="mt-10 h-96 w-full rounded-md border border-[var(--line)]"
            loading="lazy"
          />
        </Reveal>
        <div className="mt-10 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-5">
          {locations.map((l) => (
            <div key={l.city} className="bg-[var(--paper)] p-5">
              <p className="font-display text-base font-semibold">{l.city}</p>
              <p className="mt-2 text-xs leading-relaxed text-[var(--smoke)]">{l.hours}</p>
              <a
                href={`tel:${l.phone}`}
                className="font-display mt-3 inline-block text-sm font-semibold text-[var(--forest)] hover:underline"
              >
                {l.phone}
              </a>
            </div>
          ))}
        </div>
      </BandRail>

      <section id="book" className="border-t border-[var(--line)] bg-[var(--mint)]/60">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-20 md:grid-cols-[220px_1fr_auto] md:gap-16 md:py-24">
          <p className="font-display text-xs font-semibold tracking-[0.22em] text-[var(--sage)] uppercase">Book</p>
          <h2 className="font-display max-w-xl text-3xl leading-tight font-medium text-balance md:text-4xl">{finalCta.title}</h2>
          <a
            href="#"
            className="font-display justify-self-start rounded-md bg-[var(--forest)] px-7 py-3 text-sm font-semibold tracking-wide text-[var(--paper)] transition-colors hover:bg-[var(--pine)] md:justify-self-end"
          >
            {finalCta.cta}
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

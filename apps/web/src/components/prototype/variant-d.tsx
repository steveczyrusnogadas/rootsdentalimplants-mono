// PROTOTYPE — Variant D "Rooted motion".
// A composed, art-directed homepage based on the owner's reference:
// layered sections, overlapping consultation card, botanical/implant imagery,
// asymmetric services, an illustrated care path, and authored motion.
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  MapPin,
  Phone,
  Play,
} from "lucide-react";
import { HeroVideo, Reveal, SiteFooter } from "./chrome";
import {
  doctors,
  faqs,
  knowUs,
  locations,
  mapEmbed,
  pricing,
  stories,
  PHONE_MAIN,
} from "./data";

export const variantDName = "Rooted motion";

const careSteps = [
  {
    title: "Meet your implant team",
    body: "Tell us what you want to change. We listen first, then take a complete look at your smile.",
  },
  {
    title: "See the whole picture",
    body: "3D imaging helps us understand bone, bite, and the details that make your treatment yours.",
  },
  {
    title: "Build your plan",
    body: "You leave with clear options, transparent pricing, and a path that fits your life.",
  },
  {
    title: "Grow into your new smile",
    body: "Your team stays with you from placement through your final, confident result.",
  },
] as const;

const consultationTimes = [
  { value: "asap", label: "As soon as possible" },
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
] as const;

function RootsHeader() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ink = solid ? "text-[var(--forest)]" : "text-white";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        solid ? "border-b border-[var(--line)] bg-[var(--paper)]" : "bg-[var(--pine)]/55"
      }`}
    >
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-8 px-6 lg:px-10">
        <a href="#" aria-label="Roots Dental Implant Center" className="shrink-0">
          <img
            src={solid ? "/prototype/logo-color.png" : "/prototype/logo-white.png"}
            alt="Roots Dental Implant Center"
            className="h-12 w-auto"
          />
        </a>
        <nav className={`hidden items-center gap-8 lg:flex ${ink}`}>
          {[
            ["Implant options", "#services"],
            ["Why Roots", "#journey"],
            ["Smile stories", "#stories"],
            ["Our team", "#team"],
            ["Locations", "#locations"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="font-display text-[0.95rem] font-semibold transition-opacity hover:opacity-70"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={`tel:${PHONE_MAIN}`}
            className={`hidden items-center gap-2 rounded-lg px-3 py-2 font-display text-sm font-semibold sm:flex ${ink} ${
              solid ? "hover:bg-[var(--mint)]" : "hover:bg-white/10"
            }`}
          >
            <Phone className="size-4" />
            Call
          </a>
          <a
            href="#consultation"
            className={`font-display rounded-xl px-5 py-3 text-sm font-semibold shadow-[0_8px_20px_rgba(16,31,22,0.16)] transition-transform hover:-translate-y-0.5 ${
              solid ? "bg-[var(--forest)] text-white" : "bg-white text-[var(--forest)]"
            }`}
          >
            <span className="sm:hidden">Book</span>
            <span className="hidden sm:inline">Book a consultation</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function ConsultationCard() {
  const [time, setTime] = useState<"asap" | "morning" | "afternoon">("asap");

  return (
    <div
      id="consultation"
      className="relative z-20 mx-auto grid max-w-6xl gap-6 rounded-2xl bg-white p-5 shadow-[0_28px_70px_rgba(20,51,35,0.18)] md:grid-cols-[1.05fr_1fr_1.35fr_auto] md:items-end md:p-7"
    >
      <div>
        <p className="font-display text-2xl leading-tight font-semibold text-[var(--pine)]">
          Start with a conversation
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--smoke)]">
          No pressure. Just clear answers from an implant team.
        </p>
      </div>
      <label className="block">
        <span className="mb-2 flex items-center gap-2 font-display text-sm font-semibold text-[var(--forest)]">
          <MapPin className="size-4 text-[var(--sage)]" />
          Closest location
        </span>
        <select className="h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 text-sm text-[var(--pine)] outline-none focus:ring-2 focus:ring-[var(--sage)]">
          <option>Choose a location</option>
          {locations.map((location) => (
            <option key={location.city}>{location.city}</option>
          ))}
        </select>
      </label>
      <div>
        <span className="mb-2 flex items-center gap-2 font-display text-sm font-semibold text-[var(--forest)]">
          <CalendarDays className="size-4 text-[var(--sage)]" />
          Best time
        </span>
        <div className="flex flex-wrap gap-2">
          {consultationTimes.map((option) => {
            const active = time === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setTime(option.value)}
                className={`h-12 rounded-xl px-3 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-[var(--mint)] text-[var(--forest)] ring-1 ring-[var(--sage)]"
                    : "bg-[var(--paper)] text-[var(--smoke)] hover:bg-[var(--mint)]/60"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--forest)] px-6 font-display text-sm font-semibold whitespace-nowrap text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--pine)]"
      >
        Continue
        <ArrowRight className="size-4" />
      </button>
    </div>
  );
}

function SmileComparison() {
  const [position, setPosition] = useState(54);

  return (
    <div className="relative aspect-[5/3] overflow-hidden rounded-[2rem] bg-[var(--mint)]">
      <img
        src="/prototype/after-1.jpg"
        alt="Smile after treatment"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img
          src="/prototype/before-1.jpg"
          alt="Smile before treatment"
          className="h-full max-w-none object-cover"
          style={{ width: "min(100vw, 720px)" }}
        />
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-lg" style={{ left: `${position}%` }}>
        <span className="absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[var(--forest)] shadow-xl">
          ↔
        </span>
      </div>
      <span className="absolute bottom-5 left-5 rounded-lg bg-[var(--pine)]/85 px-3 py-1.5 font-display text-xs font-semibold text-white">
        Before
      </span>
      <span className="absolute right-5 bottom-5 rounded-lg bg-white/90 px-3 py-1.5 font-display text-xs font-semibold text-[var(--forest)]">
        After
      </span>
      <input
        type="range"
        min="10"
        max="90"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-label="Compare before and after treatment"
        className="absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}

function ServiceComposition() {
  return (
    <section id="services" className="bg-[var(--paper)] px-6 pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display max-w-2xl text-4xl leading-[1.04] font-semibold tracking-[-0.03em] text-balance text-[var(--pine)] md:text-6xl">
              Single tooth, several, or a full arch.
              <span className="block text-[var(--sage)]">We'll rebuild what you're missing.</span>
            </h2>
            <p className="max-w-md text-lg leading-relaxed text-[var(--smoke)]">
              From one missing tooth to a complete smile, your care stays with a team that focuses on implants every day.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <Reveal className="h-full">
            <article className="group relative min-h-[34rem] overflow-hidden rounded-[2rem] bg-[var(--forest)] text-white">
              <img
                src="/prototype/clinic.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--pine)] via-[var(--forest)]/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
                <h3 className="font-display max-w-xl text-4xl leading-tight font-semibold text-balance md:text-5xl">
                  Full-arch teeth that feel like yours again
                </h3>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-white/78">
                  A permanent full set of teeth supported by implants, planned, placed, and restored by one experienced team.
                </p>
                <a href="#" className="mt-7 inline-flex items-center gap-2 font-display text-sm font-semibold text-[var(--mint)]">
                  Explore full-arch implants
                  <ArrowUpRight className="size-4" />
                </a>
              </div>
            </article>
          </Reveal>

          <div className="grid gap-5">
            <Reveal>
              <article className="group relative overflow-hidden rounded-[2rem] bg-[var(--mint)] p-8">
                <div className="relative z-10">
                  <h3 className="font-display text-3xl leading-tight font-semibold text-[var(--forest)]">
                    Replace one tooth.
                    <span className="block text-[var(--sage)]">Keep life moving.</span>
                  </h3>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--smoke)]">
                    A durable, natural-looking implant without involving neighboring teeth.
                  </p>
                  <a href="#" className="mt-6 inline-flex items-center gap-2 font-display text-sm font-semibold text-[var(--forest)]">
                    Single-tooth implants
                    <ArrowRight className="size-4" />
                  </a>
                </div>
                <img
                  src="/prototype/roots-implant-botanical.png"
                  alt=""
                  className="pointer-events-none absolute -right-12 -bottom-28 w-72 opacity-75 transition-transform duration-700 group-hover:-translate-y-2 group-hover:rotate-2"
                />
              </article>
            </Reveal>
            <Reveal>
              <article className="relative overflow-hidden rounded-[2rem] bg-[#d6e6c9] p-8">
                <p className="font-display text-lg font-semibold text-[var(--forest)]">Implant-supported dentures</p>
                <div className="mt-8 flex items-end justify-between gap-5">
                  <p className="font-display text-5xl font-semibold tracking-[-0.03em] text-[var(--pine)]">
                    Smile.
                    <br />
                    Eat.
                    <br />
                    Speak.
                  </p>
                  <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[var(--forest)] text-white">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function CareJourney() {
  return (
    <section id="journey" className="relative overflow-hidden bg-[var(--mint)] px-6 py-24 md:py-32">
      <div className="roots-leaf roots-leaf-a" aria-hidden />
      <div className="roots-leaf roots-leaf-b" aria-hidden />
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="font-display mx-auto max-w-3xl text-center text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-[var(--pine)] md:text-6xl">
            A clear path from questions
            <span className="block text-[var(--sage)]">to confident teeth.</span>
          </h2>
        </Reveal>

        <div className="relative mt-20 grid items-center gap-12 lg:grid-cols-[1fr_0.85fr_1fr]">
          <div className="space-y-12">
            {careSteps.slice(0, 2).map((step, index) => (
              <Reveal key={step.title} delay={index * 100}>
                <div className="lg:text-right">
                  <span className="font-display text-sm font-semibold text-[var(--sage)]">0{index + 1}</span>
                  <h3 className="font-display mt-2 text-2xl font-semibold text-[var(--forest)]">{step.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-[var(--smoke)]">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-[8%] rounded-full border border-[var(--sage)]/35" />
            <div className="absolute inset-[18%] rounded-full border border-[var(--sage)]/25" />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" aria-hidden>
              <path
                className="root-path"
                d="M200 18c-10 80 30 94 1 155-22 47-77 46-72 109 3 40 26 75 61 100M201 174c55 10 75 43 71 95-3 40-18 79-47 113M184 212c-40 18-74 13-112-12M219 226c40-7 72-27 101-62"
                fill="none"
                stroke="var(--sage)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <img
              src="/prototype/roots-implant-botanical.png"
              alt="Dental implant growing from an illustrated root system and fern leaves"
              className="botanical-float relative z-10 h-full w-full object-contain"
            />
          </div>

          <div className="space-y-12">
            {careSteps.slice(2).map((step, index) => (
              <Reveal key={step.title} delay={index * 100}>
                <div>
                  <span className="font-display text-sm font-semibold text-[var(--sage)]">0{index + 3}</span>
                  <h3 className="font-display mt-2 text-2xl font-semibold text-[var(--forest)]">{step.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-[var(--smoke)]">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StoriesAndDoctors() {
  const [featured, ...rest] = stories;

  return (
    <>
      <section id="stories" className="bg-[var(--forest)] py-24 text-white md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="font-display mx-auto max-w-4xl text-center text-4xl leading-[1.04] font-semibold tracking-[-0.03em] text-balance md:text-6xl">
              Their teeth changed.
              <span className="block text-[var(--sage)]">So did everything around them.</span>
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-5 lg:grid-cols-[1.45fr_0.9fr]">
            <Reveal className="h-full">
              <figure className="relative min-h-[28rem] overflow-hidden rounded-[2rem] lg:min-h-full">
                <img src={featured.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--pine)] via-[var(--pine)]/20 to-transparent" />
                <button
                  type="button"
                  aria-label="Play patient story"
                  className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[var(--forest)] shadow-xl transition-transform hover:scale-105"
                >
                  <Play className="ml-0.5 size-5 fill-current" />
                </button>
                <figcaption className="font-display absolute inset-x-7 bottom-7 max-w-xl text-2xl leading-snug font-semibold text-white md:text-3xl">
                  “{featured.quote}”
                </figcaption>
              </figure>
            </Reveal>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {rest.map((story, index) => (
                <Reveal key={story.poster} delay={(index + 1) * 80}>
                  <figure className="group relative overflow-hidden rounded-[1.75rem]">
                    <img src={story.poster} alt="" className="aspect-[16/10] w-full object-cover lg:aspect-[16/9]" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--pine)]/90 via-[var(--pine)]/20 to-transparent" />
                    <button
                      type="button"
                      aria-label="Play patient story"
                      className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white text-[var(--forest)] shadow-lg transition-transform group-hover:scale-105"
                    >
                      <Play className="ml-0.5 size-4 fill-current" />
                    </button>
                    <figcaption className="font-display absolute inset-x-5 bottom-5 text-lg leading-snug font-semibold text-white">
                      “{story.quote}”
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={120}>
            <button
              id="know-us"
              type="button"
              className="mt-10 flex w-full items-center gap-5 rounded-[1.75rem] bg-[var(--pine)] px-5 py-4 text-left transition-colors hover:bg-[#0c1811]"
            >
              <span className="relative block w-36 shrink-0 overflow-hidden rounded-xl sm:w-48">
                <img src={knowUs.poster} alt="" className="aspect-video w-full object-cover" loading="lazy" />
                <span className="absolute inset-0 grid place-items-center bg-[var(--pine)]/25">
                  <span className="grid size-9 place-items-center rounded-full bg-white text-[var(--forest)]">
                    <Play className="ml-0.5 size-3.5 fill-current" />
                  </span>
                </span>
              </span>
              <span className="min-w-0">
                <span className="font-display block text-xl font-semibold">{knowUs.title}</span>
                <span className="mt-1 block text-sm text-white/70">{knowUs.length} with the implant team</span>
              </span>
              <ArrowRight className="ml-auto hidden size-5 shrink-0 text-[var(--sage)] sm:block" />
            </button>
          </Reveal>
        </div>
      </section>

      <section className="bg-[var(--paper)] px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div>
              <h2 className="font-display text-4xl leading-[1.04] font-semibold tracking-[-0.03em] text-balance text-[var(--pine)] md:text-6xl">
                See the change.
                <span className="block text-[var(--sage)]">Move the line.</span>
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--smoke)]">
                Every smile starts somewhere different. Drag across a real before-and-after from the Roots gallery.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <SmileComparison />
          </Reveal>
        </div>
      </section>

      <section id="team" className="bg-[#dbe9d5] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl text-center">
          <Reveal>
            <h2 className="font-display text-4xl leading-[1.04] font-semibold tracking-[-0.03em] text-balance text-[var(--pine)] md:text-6xl">
              Meet the implant team
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--smoke)]">
              Seven providers. Five centers. One team focused on helping people eat, speak, and smile with confidence again.
            </p>
          </Reveal>
          <div className="mt-16 flex flex-wrap justify-center">
            {doctors.map((doctor, index) => (
              <Reveal key={doctor.name} delay={(index % 4) * 70} className="w-1/2 px-3 py-6 sm:w-1/3 lg:w-1/4">
                <figure className="text-center">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="mx-auto aspect-square w-28 rounded-full object-cover ring-4 ring-white/80 md:w-36"
                    loading="lazy"
                  />
                  <figcaption className="mt-4">
                    <p className="font-display text-base font-semibold text-[var(--pine)]">{doctor.name}</p>
                    <p className="mt-1 text-sm text-[var(--smoke)]">{doctor.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <a
              href="#"
              className="mt-12 inline-flex items-center gap-2 rounded-xl bg-[var(--forest)] px-6 py-3.5 font-display text-sm font-semibold text-white"
            >
              Meet the whole team
              <ArrowRight className="size-4" />
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function PricingAndLocations() {
  return (
    <>
      <section className="relative overflow-hidden bg-[var(--paper)] px-6 py-24 md:py-32">
        <div className="roots-leaf roots-leaf-c" aria-hidden />
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="rounded-[2.5rem] bg-[var(--forest)] px-7 py-12 text-white md:px-14 md:py-16">
              <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
                <div>
                  <h2 className="font-display text-4xl leading-[1.04] font-semibold tracking-[-0.03em] text-balance md:text-6xl">
                    Clear numbers.
                    <span className="block text-[var(--sage)]">No teaser prices.</span>
                  </h2>
                  <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75">
                    Your consultation produces one comprehensive plan. We will meet or beat any local competitor pricing with a written quote.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {pricing.rows.map((row) => (
                    <div key={row.label} className="rounded-2xl bg-white p-6 text-[var(--pine)]">
                      <p className="font-display text-sm font-semibold text-[var(--sage)]">{row.label}</p>
                      <p className="font-display mt-3 text-5xl font-semibold tracking-[-0.03em]">{row.amount}</p>
                      <p className="mt-3 text-sm leading-relaxed text-[var(--smoke)]">{row.note}</p>
                      <span className="mt-5 flex items-center gap-2 text-sm font-semibold text-[var(--forest)]">
                        <Check className="size-4" />
                        Membership pricing
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="locations" className="bg-[var(--mint)] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <h2 className="font-display max-w-2xl text-4xl leading-[1.04] font-semibold tracking-[-0.03em] text-balance text-[var(--pine)] md:text-6xl">
                Five places to put down
                <span className="block text-[var(--sage)]">new roots.</span>
              </h2>
              <p className="max-w-sm text-lg leading-relaxed text-[var(--smoke)]">
                The same implant-focused team, close to home across Oregon and Southwest Washington.
              </p>
            </div>
          </Reveal>
          <div className="mt-14 grid overflow-hidden rounded-[2rem] bg-white shadow-[0_22px_55px_rgba(20,51,35,0.12)] lg:grid-cols-[0.72fr_1.28fr]">
            <div className="divide-y divide-[var(--line)] p-3">
              {locations.map((location, index) => (
                <a
                  key={location.city}
                  href={`tel:${location.phone}`}
                  className={`group flex items-center justify-between gap-4 rounded-xl px-5 py-4 transition-colors hover:bg-[var(--mint)] ${
                    index === 0 ? "bg-[var(--mint)]" : ""
                  }`}
                >
                  <div>
                    <p className="font-display text-lg font-semibold text-[var(--forest)]">{location.city}</p>
                    <p className="mt-1 text-sm text-[var(--smoke)]">{location.hours}</p>
                  </div>
                  <ArrowUpRight className="size-5 text-[var(--sage)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
            <iframe title="Roots Dental Implant Center locations" src={mapEmbed} className="min-h-[34rem] w-full" loading="lazy" />
          </div>
        </div>
      </section>
    </>
  );
}

function FaqAndFinalCta() {
  return (
    <>
      <section className="bg-[var(--paper)] px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <Reveal>
            <div>
              <h2 className="font-display text-4xl leading-[1.04] font-semibold tracking-[-0.03em] text-balance text-[var(--pine)] md:text-5xl">
                Questions are a good place to start.
              </h2>
              <p className="mt-5 max-w-sm text-lg leading-relaxed text-[var(--smoke)]">
                If yours is not here, call us. You will talk with a real person at the location you choose.
              </p>
            </div>
          </Reveal>
          <div className="divide-y divide-[var(--line)] border-t border-[var(--line)]">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-display text-xl font-semibold text-[var(--forest)]">
                  {faq.q}
                  <ChevronDown className="size-5 shrink-0 text-[var(--sage)] transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-4 max-w-2xl pr-10 text-base leading-relaxed text-[var(--smoke)]">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#cfe2c9] px-6 py-24 md:py-32">
        <div className="absolute -right-20 -bottom-40 h-[38rem] w-[38rem] rounded-full border border-[var(--sage)]/35" aria-hidden />
        <div className="absolute -right-8 -bottom-28 h-[28rem] w-[28rem] rounded-full border border-[var(--sage)]/35" aria-hidden />
        <div className="relative mx-auto max-w-5xl text-center">
          <Reveal>
            <h2 className="font-display text-5xl leading-[1.02] font-semibold tracking-[-0.03em] text-balance text-[var(--pine)] md:text-7xl">
              A stronger smile starts
              <span className="block text-[var(--forest)]">with one honest conversation.</span>
            </h2>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#consultation"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--forest)] px-7 py-4 font-display text-base font-semibold text-white shadow-[0_12px_30px_rgba(16,31,22,0.2)] transition-transform hover:-translate-y-0.5"
              >
                Request a consultation
                <ArrowRight className="size-5" />
              </a>
              <a
                href={`tel:${PHONE_MAIN}`}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-display text-base font-semibold text-[var(--forest)] transition-transform hover:-translate-y-0.5"
              >
                <Phone className="size-5" />
                Call {PHONE_MAIN}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export function VariantD() {
  return (
    <div className="roots-proto roots-motion min-h-svh bg-[var(--paper)]">
      <RootsHeader />

      <main>
        <HeroVideo
          scrim="bg-gradient-to-r from-[var(--pine)]/78 via-[var(--forest)]/50 to-[var(--forest)]/32"
          className="min-h-svh"
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--pine)]/55 to-transparent"
            aria-hidden
          />
          <div className="relative z-10 flex min-h-svh flex-col">
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pt-28 pb-6 lg:px-10">
              <p className="font-display hero-in max-w-3xl text-[clamp(2.6rem,8vw,6rem)] leading-[0.96] font-semibold tracking-[-0.04em] text-balance text-white">
                A new smile with
                <span className="block text-[var(--mint)]">deeper roots.</span>
              </p>
              <p
                className="hero-in mt-5 max-w-xl text-base leading-relaxed text-white/82 md:mt-7 md:text-xl"
                style={{ animationDelay: "100ms" }}
              >
                Implant-focused care for one tooth or a complete smile, planned by a team that stays with you from first scan to final result.
              </p>
            </div>
            <div className="relative z-20 px-6 pb-6 md:pb-10">
              <ConsultationCard />
            </div>
          </div>
        </HeroVideo>

        <ServiceComposition />
        <CareJourney />
        <StoriesAndDoctors />
        <PricingAndLocations />
        <FaqAndFinalCta />
      </main>

      <SiteFooter />
    </div>
  );
}

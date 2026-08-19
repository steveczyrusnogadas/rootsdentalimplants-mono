// PROTOTYPE — C "Card on still" with an owned quiz (not HighLevel).
// Still-plus-card stays as the intro. Location is step 1 of the form.
import { PaperHeader, SiteFooter } from "../chrome";
import { OwnedQuiz } from "./owned-form";
import { findQuizLocation, quizCopy } from "./data";

export const variantCName = "Card on still";

export function VariantC({ locationSlug }: { locationSlug?: string }) {
  const chosen = findQuizLocation(locationSlug);

  return (
    <div className="roots-proto min-h-svh bg-[var(--paper)]">
      <PaperHeader />
      <section className="relative min-h-[70vh] overflow-hidden">
        <img src="/prototype/clinic.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[var(--forest)]/55" aria-hidden />
        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end px-6 py-16">
          <div className="max-w-xl">
            <h1 className="font-display text-4xl leading-[1.08] font-semibold tracking-tight text-white md:text-5xl">
              {quizCopy.headline}
            </h1>
            <p className="mt-4 text-lg text-white/85">
              This short quiz helps us see whether implants are a good next step.
            </p>
          </div>
          <div className="mt-10 max-w-3xl rounded-md bg-white p-6 shadow-[0_24px_60px_rgba(16,31,22,0.22)] md:p-8">
            <p className="font-display text-2xl font-semibold text-[var(--pine)]">Three short steps</p>
            <p className="mt-2 text-sm text-[var(--smoke)]">
              Location, your teeth, then how to reach you. No HighLevel widget.
            </p>
            <a
              href="#quiz-stage"
              className="font-display mt-6 inline-block rounded-md bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-white"
            >
              Take the quiz
            </a>
          </div>
        </div>
      </section>
      <main id="quiz-stage" className="mx-auto max-w-3xl px-6 py-16">
        {chosen ? (
          <p className="text-sm text-[var(--smoke)]">
            {chosen.city} · {chosen.street}
          </p>
        ) : (
          <p className="text-sm text-[var(--smoke)]">Pick a location in the first step</p>
        )}
        <h2 className="font-display mt-2 text-3xl font-semibold text-[var(--pine)]">Take the quiz</h2>
        <div className="mt-8 rounded-md border border-[var(--line)] bg-white p-4 sm:p-6">
          <OwnedQuiz locationSlug={locationSlug} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

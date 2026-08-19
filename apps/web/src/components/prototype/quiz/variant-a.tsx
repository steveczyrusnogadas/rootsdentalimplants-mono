// PROTOTYPE — A "Chooser then stage". Location is a full-page destination;
// the HighLevel iframe only appears after a city is chosen. No extra bands.
import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { PaperHeader, SiteFooter } from "../chrome";
import { HighLevelQuiz } from "./embed";
import { findQuizLocation, quizCopy, quizLocations } from "./data";

export const variantAName = "Chooser then stage";

export function VariantA({ locationSlug }: { locationSlug?: string }) {
  const chosen = findQuizLocation(locationSlug);

  return (
    <div className="roots-proto min-h-svh bg-[var(--paper)]">
      <PaperHeader />
      {chosen ? (
        <main className="mx-auto max-w-3xl px-6 py-14">
          <p className="text-sm text-[var(--smoke)]">Eligibility quiz</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-[var(--pine)]">{chosen.city}</h1>
              <p className="mt-2 text-[var(--smoke)]">
                {chosen.street}, {chosen.region}
              </p>
            </div>
            <Link
              to="/prototype/quiz"
              search={(prev) => ({ variant: prev.variant })}
              className="font-display text-sm font-semibold text-[var(--forest)] underline-offset-4 hover:underline"
            >
              Change location
            </Link>
          </div>
          <div className="mt-10 rounded-md border border-[var(--line)] bg-white p-4 sm:p-6">
            <HighLevelQuiz location={chosen} />
          </div>
        </main>
      ) : (
        <main className="relative mx-auto max-w-5xl px-6 py-16">
          <img
            src="/prototype/roots-implant-botanical.png"
            alt=""
            className="pointer-events-none absolute -top-10 -right-8 w-64 opacity-25"
          />
          <p className="text-sm font-medium tracking-wide text-[var(--forest)]">{quizCopy.pickerLabel}</p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl leading-[1.1] font-semibold tracking-tight text-[var(--pine)] md:text-5xl">
            {quizCopy.headline}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--smoke)]">{quizCopy.support}</p>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {quizLocations.map((location) => (
              <li key={location.slug}>
                <Link
                  to="/prototype/quiz"
                  search={(prev) => ({ ...prev, location: location.slug })}
                  className="flex h-full w-full flex-col rounded-md border border-[var(--line)] bg-white p-6 text-left transition-colors hover:border-[var(--forest)] hover:bg-[var(--mint)]"
                >
                  <span className="flex items-center gap-2 font-display text-xl font-semibold text-[var(--pine)]">
                    <MapPin className="size-4 text-[var(--forest)]" />
                    {location.city}
                  </span>
                  <span className="mt-3 text-sm leading-relaxed text-[var(--smoke)]">
                    {location.street}
                    <br />
                    {location.region}
                  </span>
                  <span className="mt-4 text-sm text-[var(--forest)]">{location.hours}</span>
                </Link>
              </li>
            ))}
          </ul>
        </main>
      )}
      <SiteFooter />
    </div>
  );
}

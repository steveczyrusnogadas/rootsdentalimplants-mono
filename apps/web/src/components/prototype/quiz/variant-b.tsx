// PROTOTYPE — B "Persistent rail". Location stays visible; picking one
// swaps the HighLevel iframe in place. Tool-like, no marketing footer.
import { Link } from "@tanstack/react-router";
import { PaperHeader } from "../chrome";
import { HighLevelQuiz } from "./embed";
import { findQuizLocation, quizCopy, quizLocations } from "./data";

export const variantBName = "Persistent rail";

export function VariantB({ locationSlug }: { locationSlug?: string }) {
  const chosen = findQuizLocation(locationSlug);

  return (
    <div className="roots-proto flex min-h-svh flex-col bg-[var(--paper)]">
      <PaperHeader />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="border-b border-[var(--line)] bg-[var(--mint)] lg:w-80 lg:shrink-0 lg:border-r lg:border-b-0">
          <div className="px-6 py-8">
            <p className="text-xs font-semibold tracking-[0.16em] text-[var(--forest)] uppercase">Location</p>
            <h1 className="font-display mt-3 text-2xl leading-tight font-semibold text-[var(--pine)]">
              {quizCopy.pickerLabel}
            </h1>
          </div>
          <ul>
            {quizLocations.map((location) => {
              const active = location.slug === chosen?.slug;
              return (
                <li key={location.slug}>
                  <Link
                    to="/prototype/quiz"
                    search={(prev) => ({ ...prev, location: location.slug })}
                    className={`flex w-full flex-col px-6 py-4 text-left transition-colors ${
                      active ? "bg-[var(--forest)] text-[var(--paper)]" : "text-[var(--pine)] hover:bg-white/70"
                    }`}
                  >
                    <span className="font-display text-lg font-semibold">{location.city}</span>
                    <span className={`mt-1 text-sm ${active ? "text-[var(--paper)]/75" : "text-[var(--smoke)]"}`}>
                      {location.street}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
        <main className="min-w-0 flex-1 bg-[var(--paper)] px-6 py-10 lg:px-12">
          {chosen ? (
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-3xl font-semibold text-[var(--pine)]">{quizCopy.headline}</h2>
              <p className="mt-3 max-w-lg text-[var(--smoke)]">
                You’re taking the {chosen.city} quiz. Switch cities in the list whenever you need to.
              </p>
              <div className="mt-8">
                <HighLevelQuiz location={chosen} />
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-80 items-center justify-center">
              <p className="max-w-sm text-center text-lg text-[var(--smoke)]">
                Pick a location to load the quiz. It stays in this column so you can change cities without leaving the
                page.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

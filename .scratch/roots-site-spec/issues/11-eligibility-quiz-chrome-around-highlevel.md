# Eligibility quiz chrome around HighLevel

Type: prototype
Status: resolved
Blocked by: 07

## Question

What does the redesigned `/implant-eligibility-quiz/` page look like around the v1 HighLevel embed?

[V1 marketing surface cut](04-v1-marketing-surface-cut.md) locked the route in, with owned chrome redesigned and the quiz itself still a HighLevel iframe after a Location is chosen (`?location=` widgets). This ticket raises fidelity on that chrome (picker, page shell, what we wrap vs iframe). Do not migrate the quiz off HighLevel — that is out of scope for this map.

## Answer

v1 owns the quiz. HighLevel is gone. The spec cites **C (Card on still)** with an owned three-step form, not A/B and not an iframe.

**Asset.** [`/prototype/quiz`](../../../apps/web/src/routes/prototype/quiz.tsx) (default `?variant=c`). Shell: `apps/web/src/components/prototype/quiz/variant-c.tsx`. Form: `owned-form.tsx`. Clinic still: `/prototype/clinic.jpg`. A/B stay in the switcher as discarded HighLevel chrome.

**What C is.** Inner-page paper header (Book + Call, quiz not in nav). Clinic still under a forest scrim. Conversation card is the intro only: “Three short steps” and a Take the quiz jump to the well. No location chips on the card. The form always sits below: heading “Take the quiz”, a city line once Location is chosen (or “Pick a location in the first step”), bordered well. No review or film bands. Footer as other inner pages. `?location=` pre-fills step 1. `/portland/` still 301s to this route with no Location.

**Flow.** Three steps, same HighLevel questions, Location inside the form.

1. Location (five cities). Continue.
2. Teeth: mouth part (single tooth / several teeth / one arch / both arches), pain yes/no, how long considering, optional notes.
3. You: TV ads yes/no, financing (same four options as Book), name, phone, email, two SMS checkboxes with Book wording, Privacy and Terms links. Submit.

On-page confirmation in the well. No HighLevel thank-you.

**Lead.** Same table, `kind: eligibility_quiz`. `source` is `/implant-eligibility-quiz/`. Shared columns with Book: name, email, phone, Location, financing, seen TV ads, marketing SMS consent, transactional SMS consent (both required to submit, live Gravity wording). Quiz-only: mouth part, pain, considering duration, notes (optional). No preferred window, no reason chip, no answer-the-phone. First-class columns, not a JSON bag.

**SMS sending.** Collect the two booleans. Do not wire a messaging vendor, TCPA sender, or actual texts in this spec. Later effort.

**Not this.** HighLevel widgets and per-Location quiz IDs. Outside-the-form Location picker. Extra proof bands on this route.

## Comments

- 2026-08-19: Q5–Q7 confirmed. HighLevel off this route. Quiz creates Lead `kind: eligibility_quiz`. Two SMS boxes with Book wording; sending deferred (map Out of scope). Ticket closed.

- Prototype at [`/prototype/quiz`](../../../apps/web/src/routes/prototype/quiz.tsx) (`http://localhost:5173/prototype/quiz`). Three variants, real HighLevel iframes keyed by Location.slug: A Chooser then stage, B Persistent rail, C Card on still. Inner-page paper header. No extra review/story bands. Awaiting owner reaction.

- 2026-08-19: page was unstyled (`Hello "__root"!`, no `index.css`) after the TanStack route generator replaced `apps/web/src/routes/__root.tsx`. Restored the document shell, skipped Baseplate chrome on `/prototype`, dropped `overflow-hidden` around the iframe, and made Location picks real links.


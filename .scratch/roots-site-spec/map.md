# Replace the WordPress site

## Destination

A spec an implementer can follow to replace [rootsdentalimplants.com](https://rootsdentalimplants.com/) with this repo’s public marketing site plus an owned consultation-request flow. This map does not rebuild the site, run the cutover, or ship a scrape product.

## Notes

Domain: the public marketing site and the admin operations that feed it. Skills every session should consult: grilling, domain-modeling. Research tickets use the research skill against the live WordPress site and [Kai Dental](https://kaidentalmaui.com/) as primary sources. Prototype tickets use the prototype skill. The corpus task is a one-shot dump, not a product.

Standing preferences (locked in charting — do not re-open):

- Destination is the spec at `.scratch/roots-site-spec/spec.md`. Do not migrate application code on this map.
- Vehicle is current `apps/web` (TanStack Start), `apps/admin`, and Hono. Do not reopen the [Public site TanStack Start spec](../web-start-ssr/map.md).
- Kai Dental is feel and cleanliness, not a clone. Keep Roots brand, implant-center voice, and five-location reality.
- One-shot corpus: pages, images, and a URL list, re-runnable until cutover. Not an internal scrape tool. Do not download every patient video; grab posters and note embed hosts.
- Admin for operations: Location, Provider, hours, Blog post, Media asset, and consultation-request Leads. Marketing page copy stays in code. No WordPress page builder in admin.
- Booking v1 is a structured consultation request that creates a Lead, with a persistent Book CTA. No practice-software sync and no real calendar in this spec.
- Keep WordPress paths by default. Drop a route only with a documented redirect.
- Generate assets when the corpus has gaps.

## Decisions so far

<!-- the index — one line per closed ticket: enough to judge relevance, then zoom the link for the detail the ticket holds -->

- [WordPress route and embed census](issues/01-wordpress-route-and-embed-census.md) — 32 pages + 3 Blog posts; Gravity + popup 1043 + HighLevel quizzes/dinners; NexHealth outbound book; `/locations/{city}` 301s to `/locations/`.
- [Kai Dental booking and cleanliness cues](issues/02-kai-booking-and-cleanliness-cues.md) — fixed-header Book, five-step request modal (not a calendar), low chrome; Call is the only competing CTA.
- [Capture the WordPress corpus](issues/03-capture-the-wordpress-corpus.md) — dump in `corpus/` (48 HTML pages, 78 images, 40 posters); media REST 403; two live image 404s; `/locations/{city}/` 301s to the archive.
- [V1 marketing surface cut](issues/04-v1-marketing-surface-cut.md) — keep core + proof + owned quiz + dinner landings (owned RSVP); one finance URL (Cherry/Proceed); drop public blog, popups, NexHealth, smile-preview, Spanish.
- [Consultation-request Lead shape](issues/05-consultation-request-lead-shape.md) — one Lead with `kind`; required name/email/phone/Location/window (ASAP or Location-open days + AM/PM); optional reason+message; live financing/TV/answer-phone/two SMS; `source` is the mount. Quiz is a later kind: [Eligibility quiz chrome around HighLevel](issues/11-eligibility-quiz-chrome-around-highlevel.md).
- [Location and Provider public data](issues/06-location-and-provider-public-data.md) — ops Location (structured hours, Call picker, no city pages) and Provider (bio/headshot/optional intro); slug immutable; dinner routes in code; `/locations/{city}/` and city-root except `/portland/` are 404.
- [Look principles for Kai-clean Roots](issues/07-look-principles-for-kai-clean-roots.md) — logo greens (not Astra blue / Kai navy / admin violet); geometric display + humanist body; compact header; `/` hero is `Untitled-video.mp4` + forest scrim; strict one-action bands; admin stays ADR-0004.
- [Cheap homepage stub](issues/08-cheap-homepage-stub.md) — owner settled on D (Rooted motion) at `/prototype/home`; spec cites that composition (video hero + conversation card, no marquee, circular team, featured+stack stories). Shots: `prototype-shots/proto4-d-*.png`.
- [Blog and testimonial treatment](issues/09-blog-and-testimonial-treatment.md) — keep live YT/Vimeo embeds in code; `/` shows 3 films + 3 placeholder review cards + “See all stories”; `/testimonials/` is full films + same cards; no Testimonial entity.
- [Eligibility quiz chrome around HighLevel](issues/11-eligibility-quiz-chrome-around-highlevel.md) — C (Card on still) + owned three-step form (location in the form); Lead `kind: eligibility_quiz`; HighLevel gone; two SMS boxes stored, sending later.
- [Implant dinner RSVP Lead shape](issues/12-implant-dinner-rsvp-lead-shape.md) — `kind: implant_dinner_rsvp` for dated and TBA; Location from route; who/history/learn + answer-phone required; snapshot event start (null = waitlist); no financing/TV; Gravity SMS.
- [Write the replacement spec](issues/10-write-the-replacement-spec.md) — [spec.md](spec.md) compiles the route cut, Lead kinds, Location/Provider, look + homepage D + quiz C, and dinner chrome for an implementer.

## Not yet specified

## Out of scope

- Rebuilding or shipping the site — this effort ends at the spec
- Cutover, DNS, and redirect execution (the spec may list redirects; it does not run them)
- A maintained scrape product or admin re-scrape surface
- Practice-software sync (Open Dental, NexHealth, and the like) and a real patient-facing calendar
- A page builder in admin
- Copying Kai Dental page-for-page
- Reopening the TanStack Start migration
- JSON-LD and Google Analytics — later marketing pass, same cut as the Start map
- SMS sending / messaging vendor against the two consent booleans (boxes are collected on Book, the quiz, and dinner RSVP; texts are a later effort)
- Dark mode on the marketing site (light paper only, per look principles)

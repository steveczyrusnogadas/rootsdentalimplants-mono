# Cheap homepage stub

Type: prototype
Status: resolved
Blocked by: 03, 04, 07

## Question

Does a cheap homepage stub — real corpus images, the v1 surfaces, the look principles — feel like the site the owner would sign off on?

Raise fidelity so the spec can point at a reaction, not adjectives. Throwaway. Link the stub as an asset.

## Answer

Yes, close enough to spec against. The owner settled on **D (Rooted motion)** after four passes. The spec should point at this composition, not at A/B/C and not at adjectives.

**Asset.** [`/prototype/home`](../../../apps/web/src/routes/prototype/home.tsx) (default `?variant=d`). Implementation: `apps/web/src/components/prototype/variant-d.tsx`. Live hero file in `apps/web/public/prototype/hero-video.mp4`. Fourth-pass shots: [prototype-shots/proto4-d-*.png](../prototype-shots/).

**What D is.** Full-viewport clinic video under a medium forest scrim, compact header overlaying it then turning paper, conversation card on the hero (location + ASAP/Morning/Afternoon), asymmetric treatment band (full-arch featured, single-tooth, implant-supported dentures), illustrated four-step care path with the generated implant/fern art, featured-plus-stack patient stories and a 5-minute practice row, circular provider portraits with names visible, interactive before/after, membership prices as copy, map-led five locations, accordion FAQ. Logo greens, geometric display + humanist body, modest radius. No marquee. No provider mosaic. No story rail.

**What it is not.** Production. A/B/C stay in the switcher as discarded alternatives. Inner-page chrome is still the look-principles ticket, not this stub.

## Comments

- Stub lives at `apps/web/src/routes/prototype/home.tsx` (route `/prototype/home?variant=a|b|c|d`, components in `apps/web/src/components/prototype/`, assets in `apps/web/public/prototype/` incl. the live `Untitled-video.mp4` hero). Screenshots: [prototype-shots/](../prototype-shots/). Built 2026-08-19; awaiting owner's reaction.

- First reaction (2026-08-19): all three read bland/empty; full-viewport hero rejected; nav type too small; too few bands; locations need a map; motion expected (light is fine). Second pass same day: heroes shortened (A 68vh centered, B split forest-panel + video, C 72vh dark), nav to text-base on h-20, bands restored from live copy (trust strip, experience, 5-minute practice video, FAQ teaser), Google Maps embed in locations, hero entrance + scroll-reveal motion. Second-pass screenshots: `prototype-shots/proto2-*.png`. Awaiting second reaction.

- Second reaction (2026-08-19): A still too basic; B's composition rejected; C illegible; owner pointed to the Smilix Dribbble shot and Kai Dental for full, visually distinct sections, richer motion, and Roots-specific generated botanical/tree assets. Third pass adds D — **Rooted motion** — and makes it the default: pale botanical hero with generated implant/root/fern art, overlapping consultation card, moving trust ribbon, asymmetric treatment composition, illustrated four-step root path, animated patient-story rail, interactive before/after, provider mosaic, pricing stage, map-led locations, accordion FAQ, and restrained authored motion. Desktop/mobile screenshots: `prototype-shots/proto-d-*.png`. Type-check, production build, lint, and design detector pass. Awaiting third reaction.

- Third reaction (2026-08-19): D is the keeper. Keep the conversation card. Put the live clinic video back in a full-viewport hero. Drop the marquee. "One implant center" doesn't read. Prefer A's circular doctor portraits over D's mosaic. Change the patient-story carousel layout. Fourth pass stays on D: full-viewport `Untitled-video.mp4` hero with forest scrim and the conversation card sitting on the video; marquee removed; treatment band retitled to "Single tooth, several, or a full arch"; stories become one featured film plus two stacked stills and a 5-minute practice row; team is A's circular portraits with names always visible. Shots: `prototype-shots/proto4-d-*.png`. Type-check and design detector pass. Awaiting fourth reaction.

- Fourth reaction (2026-08-19): owner settled on D for now. Ticket resolved. Spec cites D, not A/B/C.

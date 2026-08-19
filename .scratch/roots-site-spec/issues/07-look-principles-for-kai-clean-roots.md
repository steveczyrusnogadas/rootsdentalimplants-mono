# Look principles for Kai-clean Roots

Type: grilling
Status: resolved
Blocked by: 02

## Question

What visual bar should the spec set — type, color, chrome, photography — so implementers hit “Kai-clean” without cloning Kai or keeping the current WordPress clutter?

Roots brand and implant-center voice stay. This ticket names the principles (hierarchy, CTA chrome, density, image treatment), not a component inventory.

## Answer

Public `apps/web` is Roots-branded and Kai-*clean*, not a Kai clone and not the live Elementor pile. Admin does not follow. This is the bar for [Cheap homepage stub](08-cheap-homepage-stub.md) and the spec; not a component inventory.

**Color.** Palette comes from the logo: forest, sage, mint, plus ink, paper, and smoke. Drop WordPress/Astra `#0170B9`. Do not use Kai navy/teal. Do not use the current `@repo/ui` blue-violet on marketing. The spec lists a small token set (those six roles, hex/OKLCH sampled from the mark) when it is written — this ticket names the roles, not the digits.

**Admin split.** `apps/admin` stays on [ADR-0004](../../../docs/adr/0004-shadcn-new-york-style.md) (new-york, Noto, violet). The spec records that exception; this map does not rewrite the ADR.

**Type.** Two self-hosted families. Geometric / Futura-adjacent **display** for headings, nav, and buttons. A quieter humanist **body** for paragraphs and form copy. No Adobe Fonts / Typekit kit `vrx6pxv`. No Playfair, Roboto Slab, or Montserrat-as-Kai. Exact foundry files are an implementer pick against those jobs.

**Chrome.** One compact header: logo, short nav, filled **Book**, quieter Call picker. Title-case. Modest radius (not Kai full-pills / uppercase tracking, not the Elementor button pile). Light paper header. If the corpus logo PNG is baked on black, generate a transparent color mark.

On `/` only, that header **overlays** the hero video and turns solid paper after a short scroll. Inner pages: solid paper from the start.

**Photography.** Homepage hero is the live background file [`/wp-content/uploads/2025/02/Untitled-video.mp4`](https://rootsdentalimplants.com/wp-content/uploads/2025/02/Untitled-video.mp4) — `autoplay muted loop playsinline`, mobile on, as today. Corpus skipped the file; implementers copy it from live WordPress. Medium **forest scrim** where type sits — not a Kai navy dunk, not a full-color wash. Poster/fallback: a still generated from the mp4 (JSON-LD `roots-dental-implants-hero.jpg` 404s). No looping video on other routes (today it is only on `/` and dropped `/implantes-dentales/`).

Other bands are still-led: large practice / provider / before-after from the corpus, generate gaps, stock last resort. Overlay is for legibility only.

**Density.** Strict: one headline, one supporting block, at most one primary action per band. Generous vertical rhythm. Meet-or-beat and membership prices stay as copy in their own bands. Quiz and dinner stay off the header and are not extra magnets on every band.

## Comments

- Named Kai moves (persistent header Book, five-step request not a calendar, low chrome, photography-led, Call as the only peer CTA, preference chips, generous rhythm): [research/kai-booking-and-cleanliness-cues.md](../research/kai-booking-and-cleanliness-cues.md). Do not cargo-cult the single Kihei address, Maui-vacation voice, or general-family mega-menu.

- Grilled 2026-08-19. Logo greens; two families (geometric display + humanist body); compact header; homepage hero keeps `Untitled-video.mp4` under a forest scrim; strict density; admin stays on ADR-0004.

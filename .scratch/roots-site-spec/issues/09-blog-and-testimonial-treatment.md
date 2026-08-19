# Blog and testimonial treatment

Type: grilling
Status: resolved
Blocked by: 03, 04

## Question

Do we import existing testimonial videos from the corpus, rewrite them, or start empty? If they stay, do the videos remain YouTube/Vimeo embeds or become hosted Media assets?

Public blog is out of v1 ([V1 marketing surface cut](04-v1-marketing-surface-cut.md)): `/blog/` and the three posts 301 to `/`; admin Blog post remains. This ticket is testimonials only.

## Answer

Keep the live patient films. They stay YouTube/Vimeo **embeds** (poster, click-to-play, iframe) — same pattern as Provider `introEmbedUrl`. Do not ingest them as Media assets. Quote, poster, and embed URL live in **code**. No Testimonial admin entity; do not reuse Blog post.

**Homepage (`/`).** Featured-plus-stack is the first three YouTube films, live quotes. After that band and the 5-minute practice row, before the team portraits: the same three written-review cards. One quiet text link on the film band — “See all stories” → `/testimonials/`. Spec cites [Cheap homepage stub](08-cheap-homepage-stub.md) D **plus** this written-review band; do not re-prototype.

| YouTube | Quote (live) |
|---|---|
| `2FPTk-kRf2U` | The function of my teeth suffered for years. Dr. Huish restored my entire smile. |
| `YEPJpGkD14U` | My teeth deteriorated due to medical issues. Dental implants gave me the freedom to smile again. |
| `sGpBwyDRxyI` | Coming here for my dental implants was the best decision. |

**`/testimonials/`.** Stories page only: the four YouTube films, then the five untitled Vimeo clips, then the same three review cards. Header Book is the only CTA. No doctor mosaic, financing band, on-page form, Google/Trustindex widget, or star chrome. Do not duplicate Vimeo `1040622074` (it appears twice on the live page).

| YouTube (fourth, this route only) | Quote (live) |
|---|---|
| `fgPvxnh0nDY` | I used to hide my smile. Dental implants made me an all around healthier person. |

Vimeo (posters only, no invented quotes): `1040252443`, `1040255650`, `1040251039`, `1040259033`, `1040622074`.

**Written reviews.** Three cards, one list in code, shown on `/` and `/testimonials/`. Fields: name, city, quote. Ship with obvious placeholders (`Patient name` / `City` / `Quote to come`). Not the live six (Bethany V., Liz B., …). Swapping real copy later is a code change.

Public blog stays dropped per the surface cut.

## Comments

- Live testimonials are YouTube + Vimeo embeds with CDN posters, not files in `wp-content/uploads/`. Three Blog posts. Census: [research/wordpress-route-and-embed-census.md](../research/wordpress-route-and-embed-census.md).

- Surface cut dropped the public blog (redirects to `/`). Do not reopen that here.

- Round 1 (2026-08-19): keep the live YouTube + Vimeo patient films. Written review *section* stays, with placeholders for now (do not import the live six as-is). Homepage featured-plus-stack is the first three YouTube films; `/testimonials/` is the full set. Copy and embed URLs live in code — no Testimonial admin entity, do not reuse Blog post. `/testimonials/` is a stories page (films + review section); no doctor mosaic, financing band, or on-page form.

- Round 2 (2026-08-19): films stay YouTube/Vimeo embeds (poster, click-to-play, iframe) — not Media assets. Keep all five untitled Vimeo clips on `/testimonials/` with no invented quotes. Written reviews are three code cards with obvious placeholder name/city/quote; no stars, no Google mark, not the live six. Homepage also gets a written-review section; `/testimonials/` houses reviews plus the films.

- Round 3 (2026-08-19): same three review cards on `/` and `/testimonials/`. Homepage band after films + 5-minute row, before team; spec cites D plus that band. Quiet “See all stories” on the homepage film band. Shared understanding confirmed.

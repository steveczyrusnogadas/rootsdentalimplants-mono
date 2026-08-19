# Replace the WordPress marketing site

An implementer can follow this file to replace [rootsdentalimplants.com](https://rootsdentalimplants.com/) with this repo's public marketing site and an owned consultation-request flow. Decisions live in the [Replace the WordPress site](map.md) map tickets; this spec is the compiled bar. It does not rebuild the site, run cutover, or ship a scrape product.

Stack: current `apps/web` (TanStack Start), `apps/admin`, and Hono. Do not reopen the Public site TanStack Start spec. Marketing page copy stays in code. Staff edit operations data in admin. Do not add a page builder.

Throwaway prototypes stay at `/prototype/*` for reference. Production routes do not ship them.

Copy, images, and posters: [corpus/](corpus/). Re-run `python3 corpus/capture.py` until cutover. After launch, delete the dump.

## Done when

- Every keep route below is a first-party page on `apps/web` at the WordPress path (trailing slash as live WP; the other form redirects).
- Header **Book** and every other Book mount create a Lead (`kind: consultation_request`). Quiz and dinner RSVP create Leads of their kinds. HighLevel, NexHealth, Gravity Forms, and Elementor popups are gone.
- Admin can edit Location, Provider, Blog post, Media asset, and Leads of every kind. Unpublished Locations and Providers never appear on the public site.
- Look matches [Look principles for Kai-clean Roots](issues/07-look-principles-for-kai-clean-roots.md) and the homepage composition in [Cheap homepage stub](issues/08-cheap-homepage-stub.md) D.

## Out of this spec

- Cutover, DNS, and running redirects in production
- Practice-software sync (Open Dental, NexHealth) and a real patient-facing calendar
- SMS sending against the two consent booleans
- JSON-LD, Google Analytics, GTM, Meta pixel, CallRail
- Dark mode on the marketing site (light paper only)
- Importing corpus HTML into admin. Staff enter Location and Provider from the seed values below.
- A public blog, Spanish `/implantes-dentales/`, `/smile-preview/`, CareCredit, Sunbit
- Cloning Kai Dental page-for-page

## Look

Public `apps/web` is Roots-branded and Kai-clean. `apps/admin` stays on [ADR-0004](../../docs/adr/0004-shadcn-new-york-style.md) (new-york, Noto, violet). Do not put `@repo/ui` blue-violet or Astra `#0170B9` on marketing. Do not use Kai navy/teal.

**Color.** Six roles, sampled from the mark (prototype tokens in `apps/web/src/components/prototype/proto.css`):

| Role | Hex | OKLCH |
|---|---|---|
| forest | `#1d3a29` | `oklch(32.0% 0.047 156.7)` |
| ink | `#101f16` | `oklch(22.2% 0.027 157.0)` |
| sage | `#7ea98d` | `oklch(69.6% 0.062 155.9)` |
| mint | `#e9f1e8` | `oklch(95.0% 0.015 142.2)` |
| paper | `#faf8f3` | `oklch(97.9% 0.007 88.6)` |
| smoke | `#5c6a5f` | `oklch(50.9% 0.024 151.8)` |

**Type.** Two self-hosted families. Geometric / Futura-adjacent **display** for headings, nav, and buttons (prototype used Jost). Quieter humanist **body** for paragraphs and form copy (prototype used Source Sans 3). Exact foundry files are an implementer pick against those jobs. No Adobe Fonts kit `vrx6pxv`. No Playfair, Roboto Slab, or Montserrat-as-Kai.

**Chrome.** One compact header: logo, short nav, filled **Book**, quieter Call picker. Title-case. Modest radius. Light paper header. If the corpus logo PNG is baked on black, use a transparent color mark (prototype: `/prototype/logo-color.png` and `/prototype/logo-white.png`).

On `/` only, that header overlays the hero video and turns solid paper after a short scroll. Inner pages: solid paper from the start.

**Photography.** `/` hero is the live file `/wp-content/uploads/2025/02/Untitled-video.mp4` (`autoplay muted loop playsinline`, mobile on). Corpus skipped it; copy it from live WordPress into `apps/web` public assets. Medium forest scrim where type sits. Poster/fallback: a still generated from the mp4 (live `roots-dental-implants-hero.jpg` 404s). No looping video on other routes.

Other bands are still-led: large practice / provider / before-after from the corpus, generate gaps, stock last. Overlay is for legibility only.

**Density.** One headline, one supporting block, at most one primary action per band. Generous vertical rhythm. Quiz and dinner stay off the header and are not extra magnets on every band.

## Header, nav, footer

Persistent Book in the header. Call is the only peer CTA. Call opens a Location picker (displayName + `tel:` from each published Location). Footer `tel:` is the Location with `isDefaultCall` (Portland).

**Nav** (five items, labels from homepage stub D, WordPress paths):

| Label | Target |
|---|---|
| Implant options | children: `/dental-implants/`, `/full-arch-dental-implants/`, `/single-tooth-implants/`, `/implant-supported-dentures/` |
| Why Roots | `/why-choose-us/` with Provider children (`/dr-…/`, `/adam-kearns/`) |
| Smile stories | `/testimonials/` |
| Our team | `/why-choose-us/#team` or the team band; Provider children also listed |
| Locations | `/locations/` |

Quiz and dinner are not in the header. Eligibility Quiz is not a nav item.

**Footer.** Default Call, `implants@rootsdental.com`, YouTube [`@dentaleducation`](https://www.youtube.com/@dentaleducation), Facebook [`rootsdentalportland`](https://www.facebook.com/rootsdentalportland/). Services (four treatments). Quick links: Why Roots, Before & after, FAQs, Testimonials, Contact, Financing. `/privacy/` and `/terms/`. No blog. Copyright year is current.

## Routes

Keep WordPress paths. Drop a route only with a documented redirect.

### Keep

| Path | Notes |
|---|---|
| `/` | Homepage stub D plus the written-review band |
| `/dental-implants/` | Treatment. Copy from corpus |
| `/full-arch-dental-implants/` | Treatment |
| `/single-tooth-implants/` | Treatment |
| `/implant-supported-dentures/` | Treatment |
| `/why-choose-us/` | Providers from admin, copy in code |
| `/dr-clark-brinton/` | Provider. Dental Implant Hero badge stays in code |
| `/dr-seth-huish/` | Provider |
| `/dr-jonathan-gold/` | Provider |
| `/dr-brian-hale/` | Provider |
| `/dr-chris-epperson/` | Provider |
| `/dr-jacob-kaufman/` | Provider. Gresham sentence lives in his bio |
| `/adam-kearns/` | Provider (CRNA; no `dr-` slug) |
| `/locations/` | Cards + map from Location records |
| `/contact-us/` | Same consultation-request fields as header Book |
| `/thank-you/` | After a consultation request |
| `/faq/` | Copy from corpus |
| `/privacy/` | Linked from SMS boxes |
| `/terms/` | SMS/TCPA terms. Linked from SMS boxes |
| `/before-after/` | Corpus stills, interactive compare |
| `/testimonials/` | Films + the three review cards |
| `/financing-options/` | Cherry + Proceed outbound apply. No lender iframes |
| `/implant-eligibility-quiz/` | Owned three-step quiz. `?location=` pre-fills step 1 |
| `/implant-dinner-gresham/` | Dated RSVP |
| `/implant-dinner-halsey/` | TBA waitlist. Location is Portland |
| `/implant-dinner-vancouver/` | TBA waitlist |
| `/implant-dinner-salem/` | TBA waitlist |
| `/implant-dinner-troutdale/` | TBA waitlist |
| `/implant-dinner-thank-you/` | After dinner RSVP |

### Redirect (301)

| From | To |
|---|---|
| `/blog/` | `/` |
| `/post-surgery-care-what-to-expect/` | `/` |
| `/how-to-prepare-for-a-dental-implant-procedure/` | `/` |
| `/benefits-of-dental-implants-over-traditional-dentures/` | `/` |
| `/category/blog/` | `/` |
| `/author/rootsdentalimplants-admin/` | `/` |
| `/finance-insurance/` | `/financing-options/` |
| `/smile-preview/` | `/` |
| `/implantes-dentales/` | `/` |
| `/portland/` | `/implant-eligibility-quiz/` (no Location pre-fill) |

### 404, no index, no redirect

`/locations/{city}/` for each city slug. City-root `/gresham/`, `/salem/`, `/troutdale/`, `/vancouver/`. Unpublished Provider URLs.

### Gone, no public remnant

Elementor popups `1043` (pricing guide) and `882` (Call Us). Public NexHealth buttons. HighLevel on dinner and quiz. Homepage click-arbitrage notice.

## Homepage

Cite [Cheap homepage stub](issues/08-cheap-homepage-stub.md) **D (Rooted motion)** at [`/prototype/home`](../../apps/web/src/routes/prototype/home.tsx) (`apps/web/src/components/prototype/variant-d.tsx`). Shots: `prototype-shots/proto4-d-*.png`. Do not spec A/B/C.

Composition:

1. Full-viewport clinic video under a medium forest scrim. Compact header overlays it, then turns paper.
2. Conversation card sitting on the video: Location, then preferred window (ASAP, or that Location's open days plus Morning/Afternoon). This is an in-page Book mount. After window, continue through the remaining consultation-request fields in the same flow. Do not POST a partial Lead.
3. Asymmetric treatment band. Title: "Single tooth, several, or a full arch." Full-arch featured, then single-tooth, then implant-supported dentures. Links to the three treatment routes (`/dental-implants/` can live under Implant options in nav).
4. Illustrated four-step care path with the generated implant/fern art from the stub.
5. Featured-plus-stack patient stories: first three YouTube films, live quotes. Quiet text link "See all stories" → `/testimonials/`. Then the 5-minute practice row (YouTube `pN3CBJLzDLE`). Then the three placeholder review cards. Then circular Provider portraits with names visible.
6. Interactive before/after from corpus pairs.
7. Membership prices as copy: as low as **$18,995** / **$35,995** with the implant membership plan. Meet-or-beat any local competitor pricing with a written quote, as its own band.
8. Map-led five Locations (lat/lng from Location). Not JetEngine.
9. Accordion FAQ teaser; fuller copy on `/faq/`.

No marquee. No Provider mosaic. No story rail. No looping video except this hero.

Films on `/` (YouTube id → live quote):

| Id | Quote |
|---|---|
| `2FPTk-kRf2U` | The function of my teeth suffered for years. Dr. Huish restored my entire smile. |
| `YEPJpGkD14U` | My teeth deteriorated due to medical issues. Dental implants gave me the freedom to smile again. |
| `sGpBwyDRxyI` | Coming here for my dental implants was the best decision. |

Embeds are poster, click-to-play, iframe. Quote, poster, and embed URL live in code. Not Media assets. Not a Testimonial entity.

**Written reviews.** Three cards, one list in code, shown on `/` and `/testimonials/`. Fields: name, city, quote. Ship placeholders (`Patient name` / `City` / `Quote to come`). Not the live six. Swapping real copy later is a code change. No stars, no Google mark.

## Inner pages

Inner-page paper header. Still-led bands. Strict density. Header Book is available everywhere.

**Treatments.** Copy and stills from the matching corpus page. One primary Book action per page, not a repeated form on every band.

**Provider.** `displayName`, `honorificPrefix`, `credentials`, headshot, bio paragraphs, optional `introEmbedUrl`. Brinton intro: Vimeo `1041278519`. Huish intro: Vimeo `1041321604`. Others null. Consultation requests do not pick a Provider.

**`/locations/`.** Published Location cards (address, phone, hours grouped from `weeklyHours`) and a map of `lat`/`lng`. No NexHealth. No sister-site "About" links. No per-Location public pages.

**`/contact-us/`.** The consultation-request form in the page. Confirmation `/thank-you/`. `source` is `/contact-us/`.

**`/testimonials/`.** Stories page only: the four YouTube films (homepage three plus `fgPvxnh0nDY` / "I used to hide my smile. Dental implants made me an all around healthier person."), then Vimeo `1040252443`, `1040255650`, `1040251039`, `1040259033`, `1040622074` (posters only, no invented quotes; do not duplicate `1040622074`), then the same three review cards. Header Book is the only CTA. No doctor mosaic, financing band, on-page form, or star chrome.

**`/before-after/`.** Corpus `before_N` / `after_N` stills as interactive compares.

**`/financing-options/`.** Outbound only:

- Cherry: `https://pay.withcherry.com/roots-dental-`
- Proceed, one apply link per implant Location (live referrers):

| Location slug | Label | URL |
|---|---|---|
| gresham | Roots Dental - Gresham | `https://www.proceedfinance.com/application/create?referrer=8190-1542-F00E` |
| portland | Roots Dental Implant Center | `https://www.proceedfinance.com/application/create?referrer=8190-1539-28F4` |
| salem | Salem Dental | `https://www.proceedfinance.com/application/create?referrer=8190-1541-82A7` |
| troutdale | Troutdale Dental | `https://www.proceedfinance.com/application/create?referrer=8190-1540-FF5C` |
| vancouver | Vancouver Dental | `https://www.proceedfinance.com/application/create?referrer=8190-6031-BEA6` |

Do not keep Carlton / Hollywood / Powell Proceed buttons (sister GP offices, not these Locations). No CareCredit. No Sunbit. No iframes.

**`/faq/`, `/privacy/`, `/terms/`.** Copy from corpus. `/terms/` is the SMS/TCPA page.

## Eligibility quiz

Cite [Eligibility quiz chrome around HighLevel](issues/11-eligibility-quiz-chrome-around-highlevel.md) **C (Card on still)** at [`/prototype/quiz`](../../apps/web/src/routes/prototype/quiz.tsx) (`quiz/variant-c.tsx`, `quiz/owned-form.tsx`). HighLevel is gone.

Inner-page paper header. Clinic still under a forest scrim. Conversation card is intro only ("Three short steps" and a jump to the well). No location chips on the card. Form always sits below in a bordered well. No review or film bands. `?location=` pre-fills step 1. `/portland/` 301s here with no Location.

Three steps:

1. Location (five published cities). Continue.
2. Teeth: mouth part (single tooth / several teeth / one arch / both arches), pain yes/no, how long considering (1-3 months / 3 months to a year / I've wanted them for years), optional notes.
3. You: TV ads yes/no, financing (same four options as Book), name, phone, email, two SMS checkboxes with Book wording, Privacy and Terms links. Submit.

On-page confirmation in the well. `kind: eligibility_quiz`. `source` is `/implant-eligibility-quiz/`.

## Implant dinner

Ad landings, not in the header. Same inner-page chrome as the quiz: paper header, still under a forest scrim, intro card, owned form in a bordered well, no extra proof bands. Dated vs TBA is copy and the Lead snapshot, not a second layout.

| Path | Location.slug | v1 copy | `eventStartsAt` |
|---|---|---|---|
| `/implant-dinner-gresham/` | `gresham` | 29 Oct 2026, Bumpers, 21935 NE Halsey St #100, Fairview, OR 97024. Corpus has no clock time; snapshot the advertised date. | that date (not null) |
| `/implant-dinner-halsey/` | `portland` | More dinners coming soon / TBA. Waitlist. | null |
| `/implant-dinner-vancouver/` | `vancouver` | TBA waitlist | null |
| `/implant-dinner-salem/` | `salem` | TBA waitlist | null |
| `/implant-dinner-troutdale/` | `troutdale` | TBA waitlist | null |

Event date and venue copy live in code, keyed by Location.slug. A sixth Location does not invent a dinner route. Same field list on dated and TBA pages. Confirmation `/implant-dinner-thank-you/`. `kind: implant_dinner_rsvp`. `source` is the dinner path. Location is inferred from the route, no picker.

## Lead

One table, `kind` discriminator, first-class columns, not a JSON bag and not a second table. `source` is the mount, not overloaded for kind. Admin `status` / `priority` / `internalNotes` stay admin-only. Converting to a Contact leaves this Lead intact; name / email / phone copy over.

Public POST on Hono creates the row. Today's `lead.message` NOT NULL is wrong for v1; message is nullable. Phone is required.

### Shared identity (every kind)

| Field | Required | Notes |
|---|---|---|
| name | yes | Single field, not first/last |
| email | yes | |
| phone | yes | |
| Location | yes | Stored as the Location, not a city string |
| marketing SMS consent | yes | Must be true to submit |
| transactional SMS consent | yes | Must be true to submit |

SMS boxes keep `/privacy/` and `/terms/` links. Verbatim Gravity wording:

- Marketing: "I consent to receive marketing text messages from Roots Dental at the phone number provided. Frequency may vary. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out."
- Transactional: "I consent to receive non-marketing text messages from Roots Dental about my order updates, appointment reminders etc. Frequency may vary. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out."

Collect the two booleans. Do not wire a messaging vendor in this spec.

### `kind: consultation_request`

Same field list on every Book mount. Location is chosen **before** preferred-window chips. Skip Kai's new-vs-existing patient type.

| Field | Required | Notes |
|---|---|---|
| preferred window | yes | **ASAP**, or one-or-more **open days of that Location** plus at least one of **Morning / Afternoon**. No calendar. Persist what they submitted (asap flag, weekdays, day-parts) as columns. ASAP skips days. Morning/Afternoon are not derived from hours. |
| reason | no | Chip: Dental implants, Full-arch dental implants, Single-tooth implants, Implant-supported dentures, Not sure |
| message | no | Free text, nullable |
| financing | yes | Financing (default) / Personal funds / Combination of both / Unsure / Need guidance |
| seen TV ads | no | Yes / No, default No |
| can answer the phone | no | Yes / No, default Yes |

`source`: `header`, `/contact-us/`, or in-page Book. Confirmation `/thank-you/`.

### `kind: eligibility_quiz`

Shared with Book: name, email, phone, Location, financing, seen TV ads, both SMS consents. Quiz-only: mouth part, pain, considering duration, notes (optional). No preferred window, no reason chip, no answer-the-phone.

### `kind: implant_dinner_rsvp`

| Field | Required | Notes |
|---|---|---|
| who needs implants | yes | Me / Friend / Family Member |
| implant history | yes | Live textarea: past dentures, implants, related treatment |
| what to learn | yes | Live textarea |
| can answer the phone | yes | Yes / No |
| event start | no | Snapshot of advertised local date+time; **null = waitlist** |

Not on this form: preferred window, reason, message, financing, TV ads, party size, quiz mouth/pain/notes. Venue stays page copy.

## Location and Provider

Staff (Admin and Manager) edit these in admin. Create/hide allowed. Page copy stays in code.

### Location

| Field | Notes |
|---|---|
| slug | Set at create, then immutable. `portland`, `gresham`, `troutdale`, `salem`, `vancouver` |
| displayName | `Portland`, `Gresham`, … |
| street, suite, city, region, postalCode | Structured. Portland is 4224 NE Halsey #330, not Hollywood/Powell |
| phone | Number on the card, not CallRail |
| weeklyHours | Mon-Sun: `closed` plus `open`/`close` as local wall-clock. Public line grouped from this. No holiday calendar |
| lat, lng | Custom map on `/locations/` and the homepage map |
| sortOrder | Cards and pickers |
| published | Unpublished omitted from every public use |
| isDefaultCall | Exactly one. Footer `tel:` |

No NexHealth id, no sister-site URL, no per-Location email, no timezone, no building photo. No Provider↔Location join.

Seed from live cards (hours as structured Mon-Sun):

| slug | displayName | street | suite | city | region | postalCode | phone | open days | open-close | lat | lng | isDefaultCall |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| portland | Portland | 4224 NE Halsey St | #330 | Portland | OR | 97213 | 503-647-6135 | Mon-Thu | 08:00-17:00 | 45.5333859 | -122.6200202 | yes |
| gresham | Gresham | 22400 SE Stark St | Suite 103 | Gresham | OR | 97030 | 503-512-6184 | Mon-Thu | 08:00-17:00 | 45.5187366 | -122.43212752704 | no |
| troutdale | Troutdale | 191 E Historic Columbia River Hwy | | Troutdale | OR | 97060 | 503-855-6792 | Tue-Fri | 08:00-17:00 | 45.5409352 | -122.38734832471 | no |
| salem | Salem | 2510 12th St SE | | Salem | OR | 97302 | 503-506-6339 | Mon-Fri | 08:00-15:00 | 44.9166413 | -123.0302308 | no |
| vancouver | Vancouver | 16600 SE 15th St | | Vancouver | WA | 98683 | 360-310-4683 | Mon-Thu | 08:00-15:00 | 45.61042565 | -122.50235005 | no |

### Provider

| Field | Notes |
|---|---|
| slug | Keep live paths |
| displayName | `Clark Brinton`, `Adam Kearns` |
| honorificPrefix | `Dr.` or empty (CRNA) |
| credentials | `DMD`, `MS CRNA` |
| headshot | Media asset |
| bio | Plain text, paragraphs |
| sortOrder | Nav and `/why-choose-us/` |
| published | Unpublished omitted from nav and `/why-choose-us/`; old URL 404s |
| introEmbedUrl | Optional Vimeo/YouTube |

Seed slugs and intros: `dr-clark-brinton` (Vimeo `1041278519`), `dr-seth-huish` (Vimeo `1041321604`), `dr-jonathan-gold`, `dr-brian-hale`, `dr-chris-epperson`, `dr-jacob-kaufman`, `adam-kearns` (no prefix, `MS CRNA`). Bios and headshots from corpus. Headshots are Media assets.

## Blog post and Media asset

Admin Blog post stays (draft/publish as today). No public blog route.

Media asset is the admin library (object storage) for Provider headshots and other reusable files. Patient films stay YouTube/Vimeo embeds, not ingested.

## SEO

Per keep route, copy `<title>` and meta description from the matching corpus HTML as the starting tags. Open Graph title/description may match. No JSON-LD. No Twitter Cards required. No GTM / GA / Meta pixel in this spec.

## Assets to generate or copy

- Hero mp4 from live WordPress, plus a generated still poster
- Transparent color logo and reversed white logo if corpus marks are unusable
- Homepage four-step botanical/implant art from stub D (already generated under `apps/web/public/prototype/`)
- Any inner-page still the corpus 404s (`Roots-Dental-Logo.png`, `roots-dental-implants-hero.jpg`)

## Decisions this spec compiles

- [WordPress route and embed census](issues/01-wordpress-route-and-embed-census.md)
- [Kai Dental booking and cleanliness cues](issues/02-kai-booking-and-cleanliness-cues.md)
- [Capture the WordPress corpus](issues/03-capture-the-wordpress-corpus.md)
- [V1 marketing surface cut](issues/04-v1-marketing-surface-cut.md)
- [Consultation-request Lead shape](issues/05-consultation-request-lead-shape.md)
- [Location and Provider public data](issues/06-location-and-provider-public-data.md)
- [Look principles for Kai-clean Roots](issues/07-look-principles-for-kai-clean-roots.md)
- [Cheap homepage stub](issues/08-cheap-homepage-stub.md)
- [Blog and testimonial treatment](issues/09-blog-and-testimonial-treatment.md)
- [Eligibility quiz chrome around HighLevel](issues/11-eligibility-quiz-chrome-around-highlevel.md)
- [Implant dinner RSVP Lead shape](issues/12-implant-dinner-rsvp-lead-shape.md)

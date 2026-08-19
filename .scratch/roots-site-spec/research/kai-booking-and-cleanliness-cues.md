# Kai Dental booking and cleanliness cues

Date: 2026-08-18

Kai Dental’s live site ([https://kaidentalmaui.com/](https://kaidentalmaui.com/)) is a Next.js marketing surface with a **fixed two-row header**, a **short nav**, and a **same-origin five-step appointment-request modal** (not a live calendar). Book and Call are the only repeated actions; photography and a muted hero video carry the page; interrupting chrome (chat, coupon bars, cookie walls, quizzes) is absent from the fetched HTML. This note names those **moves** so later tickets can decide what Roots should do. It is not a visual clone spec — do not copy Kai’s brand, colors, copy, or page-for-page structure.

## Named UX moves

1. **Persistent Book CTA in a fixed header** — The whole `<header>` is `fixed top-0 left-0 right-0 z-50`. A slim utility row holds **Book Appointment** (button) plus the practice phone. After `scrollY > 40`, the main bar also reveals **Book Now**. On narrow viewports a **Book Now** pill stays in the main bar so Book never requires opening the menu. There is no sticky bottom tab bar. Cited: [https://kaidentalmaui.com/](https://kaidentalmaui.com/) (homepage HTML header classes); layout bundle `https://kaidentalmaui.com/_next/static/chunks/app/layout-38ea88dd88ca04ca.js` (`scrollY>40`).

2. **Short path: five-step request, not a scheduler** — Every Book / Book Now / Book Online control calls `openBooking()` and opens a same-origin modal on the current URL. There is no `/book/` or `/booking/` route (both 404). There is no NexHealth, Zocdoc, Open Dental, Calendly, or booking iframe. Submit is `POST /api/booking/` (GET returns 405) and lands on a thank-you page, not a reserved slot. Cited: [https://kaidentalmaui.com/](https://kaidentalmaui.com/); [https://kaidentalmaui.com/book/](https://kaidentalmaui.com/book/) (404); [https://kaidentalmaui.com/booking/](https://kaidentalmaui.com/booking/) (404); [https://kaidentalmaui.com/api/booking/](https://kaidentalmaui.com/api/booking/) (405 GET); [https://kaidentalmaui.com/confirmation/](https://kaidentalmaui.com/confirmation/).

3. **Low chrome** — Desktop nav is six uppercase items (Home, About, Services, Implants, Patients, Contact) plus the Book/Call cluster. Depth lives in dropdowns, not a second link row. Header omits Blog, patient portal, careers, shop, specials/coupons, FAQ-as-a-top-item, a standalone Reviews page, and a location picker. Fetched HTML has no cookie/CMP banner, chat widget, announcement strip, exit-intent, or quiz magnet. Cited: [https://kaidentalmaui.com/](https://kaidentalmaui.com/); same header on [https://kaidentalmaui.com/team/](https://kaidentalmaui.com/team/), [https://kaidentalmaui.com/services/](https://kaidentalmaui.com/services/), [https://kaidentalmaui.com/services/dental-implants-maui/](https://kaidentalmaui.com/services/dental-implants-maui/), [https://kaidentalmaui.com/contact/](https://kaidentalmaui.com/contact/).

4. **Photography- and video-led sections** — The hero is a near-full-bleed muted looping MP4 (`/videos/kai-dental-broll-720p.mp4`) under a heavy navy-to-teal wash, with three lines of type and two CTAs. Later bands use large practice/team/clinical photos (hover zoom, little overlay text). Welcome uses one large still that opens a Vimeo lightbox. Office mosaic: six photos, no CTA on the images. Not illustration-led. Cited: [https://kaidentalmaui.com/](https://kaidentalmaui.com/).

5. **Phone as the only competing action** — Utility bar: Book Appointment + `tel:+18088791117`. Hero: **Book Online 24/7** + **Call Now | (808) 879-1117**. Mobile drawer: Book + Call. Footer contact also offers **Text Us** (`sms:+18088425801`). No chat, coupon, or quiz CTA. Cited: [https://kaidentalmaui.com/](https://kaidentalmaui.com/).

6. **“Book Online 24/7” copy on a request form** — Hero CTA label is **Book Online 24/7**. Site schema / config lists a `LocationFeatureSpecification` named **“24/7 Online Booking” with `value: false`**. The modal collects preference chips (days, AM/PM, ASAP), not a date-time. Cited: [https://kaidentalmaui.com/](https://kaidentalmaui.com/) (hero button + JSON-LD); site config in `https://kaidentalmaui.com/_next/static/chunks/8568-8a32f5e8e45852ff.js` (`bookingUrl:""`, amenity `24/7 Online Booking` false).

7. **Preference chips over a calendar** — Step 3 is “When works best for you? / Select all that apply”: ASAP toggle, Mon–Fri day chips (Sat/Sun disabled because `closed: true`), Morning | Afternoon. No calendar widget, no clock time. Cited: layout bundle above; hours also printed on the homepage location band at [https://kaidentalmaui.com/](https://kaidentalmaui.com/).

8. **Chrome stays consistent on inner pages** — Team, services index, implant service, first-visit, and contact all keep the same fixed header, nav labels, and Book buttons. Confirmation / contact-thank-you strip marketing chrome to logo + message + Return to Home. Cited: [https://kaidentalmaui.com/team/](https://kaidentalmaui.com/team/); [https://kaidentalmaui.com/services/dental-implants-maui/](https://kaidentalmaui.com/services/dental-implants-maui/); [https://kaidentalmaui.com/confirmation/](https://kaidentalmaui.com/confirmation/); [https://kaidentalmaui.com/thank-you-contact/](https://kaidentalmaui.com/thank-you-contact/).

9. **Reviews in-page, not a reviews landing** — About → Patient Reviews is `#reviews` on the current page. Homepage reviews band is a Trustindex embed plus **Read More Reviews** out to Google Maps. No Reviews item in the footer. Cited: [https://kaidentalmaui.com/](https://kaidentalmaui.com/) (`#reviews`, `cdn.trustindex.io/loader.js`).

10. **Generous vertical rhythm, one family, pill CTAs** — Most homepage sections use `py-[100px]`. One self-hosted family (Montserrat). Headlines are large and light; body is smaller with `line-height: 1.75`. Buttons are small uppercase, wide-tracked, `rounded-full`. Cited: [https://kaidentalmaui.com/](https://kaidentalmaui.com/); `https://kaidentalmaui.com/_next/static/css/761e008e8b234785.css`; `https://kaidentalmaui.com/_next/static/css/7ea69f5ba32add63.css`.

## Booking path

**Kind:** custom same-origin **appointment-request wizard** in a modal (`role="dialog"`, `aria-label="Book an appointment"`, `max-w-[690px]`). Not a live calendar. If `bookingUrl` were set, the same click would `window.open` an external URL; live config has `bookingUrl:""`, so the modal always opens.

**How you get there:** any **Book Appointment** / **Book Now** / **Book Online 24/7** button on [https://kaidentalmaui.com/](https://kaidentalmaui.com/) (and the same header buttons on inner pages). Progress labels in the wizard: Patient Type → Appointment → Schedule → Your Info → Final Details. Next / Back; submit label **Request My Appointment** (busy: “Sending…”).

| Step | URL | Heading | Fields |
|---|---|---|---|
| 1 | Current page (modal). Example: [https://kaidentalmaui.com/](https://kaidentalmaui.com/) | “Are you a new or existing patient?” | Patient type (required): **New Patient** \| **Existing Patient** |
| 2 | Same modal / same URL | “What type of appointment are you looking for?” | Appointment type (required), each with a duration chip: **General Exam + Cleaning** (90 min), **Emergency** (30 min), **Cosmetic or Implant Consultation** (60 min), **Other** (60 min) |
| 3 | Same | “When works best for you?” / “Select all that apply” | **ASAP!** toggle (clears / disables day+time chips). Else **Preferred Days** (Mon–Fri; Sat/Sun disabled) and **Preferred Time of Day** (**Morning** \| **Afternoon**). Required unless ASAP. No date picker. |
| 4 | Same | “How can we reach you?” | **Name** (required), **Email** (required, simple regex), **Phone Number** (required, 10 US digits, formatted) |
| 5 | Same | “Almost done!” | **Message** — “Anything else you'd like us to know?” (optional; placeholder “Optional”). Privacy line: “For your privacy, please do not include sensitive medical information in this form.” Hidden honeypot `booking-b-email`. reCAPTCHA (badge CSS-hidden; text disclosure + Google Privacy / Terms). Submit: **Request My Appointment** |
| Submit | `POST https://kaidentalmaui.com/api/booking/` | — | First-party API. Client JS also emails via a Make.com webhook (URL is in public JS; do not reuse). Payload includes patient/appointment/preferences/contact, `recaptchaToken`, `submittedAt`, `pageUrl`. Config lists `referralSource` as required; the live five-step UI does **not** collect it (2026-08-18). |
| Done | [https://kaidentalmaui.com/confirmation/](https://kaidentalmaui.com/confirmation/) | “Thank You!” | Copy: “Your appointment request has been submitted and we will be in touch as soon as we can…” Check icon, **Return to Home**. No booked date/time. `robots.txt` disallows `/confirmation/`. |

**Side path, not the Book CTA:** [https://kaidentalmaui.com/contact/](https://kaidentalmaui.com/contact/) is a single-page “Ask a Question” / “get in touch” form (Name, Email, Phone Number, New or Existing Patient, Message) with **Book Now** and **Message Us** tabs. Submit goes to [https://kaidentalmaui.com/thank-you-contact/](https://kaidentalmaui.com/thank-you-contact/). Homepage “Ask a Question” links to `/contact/#message`.

## Chrome inventory

**Header (every marketing page fetched except confirmation/thank-you)** — [https://kaidentalmaui.com/](https://kaidentalmaui.com/):

1. **Utility bar** (`bg-primary`, `h-10` / `sm:h-[50px]`): one street address linking to Google Maps (“1325 S. Kihei Rd Suite 201, Kihei, HI 96753”); then **Book Appointment** + **(808) 879-1117**. Book+phone cluster is `hidden sm:flex`.
2. **Main bar** (~100px, shrinks to 85px after scroll): logo → home; desktop nav `hidden lg:flex`; mobile Book Now pill + hamburger `lg:hidden`.

**Desktop nav labels, in order** ([https://kaidentalmaui.com/](https://kaidentalmaui.com/)):

| Item | Destination | Notes |
|---|---|---|
| Home | `/` | Also the logo. Accent-colored on the homepage. |
| About | dropdown; parent href `/team/` | Meet Our Team → `/team/`; Smile Transformations → `/smile-transformations/`; Patient Reviews → `#reviews`; Technology → `/technology/` |
| Services | mega-menu; parent `/services/` | Long treatment list + View All. Pediatric Dentistry leaves the site to [https://justkeiki.com/](https://justkeiki.com/) |
| Implants | dropdown; parent `/services/dental-implants-maui/` | Pulled out as its own top-level item |
| Patients | dropdown; parent `/first-visit-expectations/` | First Visit Expectations; Insurance & Financing → `/insurance-and-financing/` |
| Contact | `/contact/` | Last text item |

Nav type cue: `text-[16px] font-bold tracking-widest uppercase`.

**Mobile** (same HTML, `lg:hidden`): hamburger opens a right drawer (`fixed … w-80`) with a dim overlay (`bg-black/50`). Drawer repeats the five groups (plus Home in the desktop list), a full-width **Book Appointment**, and a **Call** `tel:` link.

**CTA copy actually used**

| Surface | Copy |
|---|---|
| Utility bar | Book Appointment |
| Main bar after scroll; mobile pill; contact hero tab | Book Now |
| Hero | Book Online 24/7 |
| Location / hours band | Book Appointment |
| Peer action | Call Now \| (808) 879-1117 |
| Footer contact | Text Us |
| Modal submit | Request My Appointment |

**Not in the header (low chrome)** — Blog, Patient Portal / login, Careers, Shop, Specials / new-patient coupon, FAQ as a top-level item, a standalone Reviews URL, multi-location picker, chat launcher, cookie consent bar, second promo row.

**Footer** ([https://kaidentalmaui.com/](https://kaidentalmaui.com/)): copyright, then Home \| About \| Services \| Implants \| Contact \| Privacy Policy ([https://kaidentalmaui.com/privacy-policy/](https://kaidentalmaui.com/privacy-policy/)). Instagram is the only social href in the homepage HTML. Circular **Back to top** after 300px (`fixed bottom-[60px] right-[10px]`) — not a marketing widget.

**Third-party UI that is present** (booking/chrome only): Trustindex review widgets; Google Maps embed in the location band; CallRail number swap; GTM `GTM-NL53S36M` (hidden iframe); reCAPTCHA on booking submit (badge hidden). Vimeo lightbox on the welcome still. No Intercom / Drift / Tidio / Tawk / Crisp; no OneTrust / Osano; no Facebook pixel / Hotjar / Clarity in the homepage HTML.

## Typography / spacing / photography cues

Observations only — not a rec palette or type scale to copy.

**Color impression:** ocean navy (`--primary:#21568a`), one teal accent (`--accent:#0097b2`), near-black type (`--foreground:#1a1a1a`) on white, pale smoke bands (`--white-smoke:#f5f5f5`, `--accent-smoke:#f0f9fb`). Cool coastal, not warm sand. Cited: `https://kaidentalmaui.com/_next/static/css/761e008e8b234785.css`.

**Type:** one family — Next/font Montserrat, self-hosted woff2 (`--font-montserrat`; `body` is Montserrat, Arial, sans-serif). No Typekit, no Google Fonts stylesheet, no second display serif. Hero display “We Build Confident Smiles” is `text-4xl sm:text-5xl lg:text-6xl font-extrabold`. The real `<h1>` is the quieter “Locally-Owned Dentist in Kihei, HI” at `text-lg`. Section titles `text-4xl lg:text-5xl font-light`. Body ~1rem / `p{line-height:1.75}`. Buttons `text-sm uppercase tracking-wider` and `rounded-full`. Cited: [https://kaidentalmaui.com/](https://kaidentalmaui.com/); both CSS files above.

**Spacing:** generous. Most homepage sections `py-[100px]` (some `pt-[80px] pb-[100px]`). Hero taller (`pt-[180px] pb-[140px]`) and tucked under the fixed header (`-mt-[100px]`). `html` `scroll-padding-top` 125px / 135px so `#reviews` clears the header. `.content-container` is 90% → 80% at 1200px → 75% at 1366px → 65% / `max-width: 1400px` at 2400px. Hero copy capped at `max-w-2xl` so the video can dominate.

**Photography vs illustration:** real photos — office interiors, team group, faded doctor cutouts, service stills (toothache, implant, crown, cleaning). Hero is video, not a stock gradient alone. No icon-illustration service grid as the primary visual.

**Motion (low, decorative):** muted autoplay loop on the hero video; a word-reveal on “Confident”; 1300ms logo/nav color fade (white-on-hero → standard as the page lightens); photo hover `scale-[1.04]`; logo hover `scale-[0.93]`; FAQ accordion; modal fade ~500–600ms. No scroll-jacking or full-page slider in the fetched HTML.

**Homepage section order at low information density** ([https://kaidentalmaui.com/](https://kaidentalmaui.com/)) — kind inventory, not a structure to copy: fixed header → hero video + wash → welcome + playable still → four service photo cards on dark → two doctors → six-image office mosaic → insurance/financing on dark → FAQ accordion → in-page reviews → schedule + map → quiet footer.

## What would not transfer to a five-location implant center

Facts about Kai that are single-location or Kai-specific. Not recommendations.

1. **One address in the chrome.** The utility bar is a single Kihei street that maps to one Google place. There is no location picker, no “find an office,” no city list in the header. Schema `@type: Dentist` is one geo point (20.747967, −156.454539). Cited: [https://kaidentalmaui.com/](https://kaidentalmaui.com/) header + JSON-LD.

2. **Island / community-of-one voice.** H1 is “Locally-Owned Dentist in Kihei, HI.” Copy names Maui towns (Wailea, Makena, Kahului, Paia, Pukalani, Makawao). Amenities include “Curated Local Art,” soft pillows, blankets — spa/vacation-office cues. Visual language is ocean navy + teal over island b-roll. Cited: [https://kaidentalmaui.com/](https://kaidentalmaui.com/); config `communities` / `amenities` in the 8568 chunk.

3. **General-family practice menu, not implant-center IA.** Top-level Services is a full-mouth mega-menu (cleanings, fillings, CEREC, peds). Implants is a *pull-out* from that general list. Pediatric Dentistry exits to [https://justkeiki.com/](https://justkeiki.com/). Booking step 2 leads with a 90-minute “General Exam + Cleaning.” Cited: [https://kaidentalmaui.com/](https://kaidentalmaui.com/) nav; [https://kaidentalmaui.com/services/](https://kaidentalmaui.com/services/).

4. **“24/7 booking” as a label on a preference form.** The live path is a five-question request emailed through a webhook. Schema marks 24/7 online booking false. Published hours are Mon–Thu 8:00 AM–4:30 PM, Fri 8:00 AM–1:00 PM, weekend closed — the chips match those hours, not an anytime calendar. Cited: [https://kaidentalmaui.com/](https://kaidentalmaui.com/) JSON-LD; [https://kaidentalmaui.com/confirmation/](https://kaidentalmaui.com/confirmation/).

5. **Single-office contact stack.** One voice number, one SMS number, one Instagram, one maps embed, doctors introduced as the local pair (Hollander, Núñez). Confirmation copy assumes “our office” singular. There is no provider- or location-picker in the booking modal. Cited: [https://kaidentalmaui.com/](https://kaidentalmaui.com/); [https://kaidentalmaui.com/team/](https://kaidentalmaui.com/team/); [https://kaidentalmaui.com/confirmation/](https://kaidentalmaui.com/confirmation/).

## Source list

- [https://kaidentalmaui.com/](https://kaidentalmaui.com/) — homepage HTML, nav, CTAs, sections, schema, third-party tags (fetched 2026-08-18). Local copy: `.scratch/roots-site-spec/research/_raw/kai-home.html`.
- [https://kaidentalmaui.com/team/](https://kaidentalmaui.com/team/), [https://kaidentalmaui.com/services/](https://kaidentalmaui.com/services/), [https://kaidentalmaui.com/services/dental-implants-maui/](https://kaidentalmaui.com/services/dental-implants-maui/), [https://kaidentalmaui.com/first-visit-expectations/](https://kaidentalmaui.com/first-visit-expectations/), [https://kaidentalmaui.com/contact/](https://kaidentalmaui.com/contact/) — inner-page chrome check.
- [https://kaidentalmaui.com/confirmation/](https://kaidentalmaui.com/confirmation/) — post-request thank-you. Local: `_raw/kai-confirmation.html`.
- [https://kaidentalmaui.com/thank-you-contact/](https://kaidentalmaui.com/thank-you-contact/) — contact-form thank-you.
- [https://kaidentalmaui.com/book/](https://kaidentalmaui.com/book/) and [https://kaidentalmaui.com/booking/](https://kaidentalmaui.com/booking/) — 404; modal-only booking.
- `POST https://kaidentalmaui.com/api/booking/` — first-party submit (GET 405).
- [https://kaidentalmaui.com/robots.txt](https://kaidentalmaui.com/robots.txt) — disallows `/confirmation/`, `/thank-you-contact/`, `/privacy-policy/`.
- [https://kaidentalmaui.com/sitemap.xml](https://kaidentalmaui.com/sitemap.xml) — no `/book/` URL; marketing pages only.
- `https://kaidentalmaui.com/_next/static/chunks/app/layout-38ea88dd88ca04ca.js` — wizard steps, fields, header scroll behavior, modal chrome.
- `https://kaidentalmaui.com/_next/static/chunks/8568-8a32f5e8e45852ff.js` — `bookingUrl:""`, hours, amenities including “24/7 Online Booking” false.
- `https://kaidentalmaui.com/_next/static/css/761e008e8b234785.css` and `…/7ea69f5ba32add63.css` — Montserrat, tokens, `.content-container`, recaptcha-badge hide.
- [https://justkeiki.com/](https://justkeiki.com/) — pediatric off-site (nav omission of in-house kids dentistry).

# WordPress route and embed census

Date: 2026-08-18

The live site at [https://rootsdentalimplants.com/](https://rootsdentalimplants.com/) is WordPress 7.0.4 (Astra + child, Elementor 3.30.3 / Pro 3.30.1, Gravity Forms 2.10.5, JetEngine 3.6.8, Yoast). Yoast `robots.txt` allows all crawlers and points at `sitemap_index.xml`. Public marketing routes are 32 WordPress pages plus 3 Blog posts; five Location CPT records (`map-view`) exist in REST at `/locations/{city}/` but those permalinks HTTP 301 to the `/locations/` archive. Consultation-request Leads are captured by Gravity Forms 1/2 (and Spanish form 3); dinner RSVPs and the eligibility quiz are HighLevel (LeadConnector) iframes; booking is NexHealth outbound links, not an on-page slot picker. No Intercom/Drift/Tidio chat widget appears in page source.

Sources cited below were fetched 2026-08-18 (sitemaps + homepage HTML already in `research/_raw/`; remaining pages re-fetched into `research/_raw/census/` and REST into `research/_raw/rest/`). Media library and videos were not downloaded.

## Public route tree

Discovery: [robots.txt](https://rootsdentalimplants.com/robots.txt) (`User-agent: *`, empty `Disallow`; sitemap `https://rootsdentalimplants.com/sitemap_index.xml`). Yoast index children: [page-sitemap.xml](https://rootsdentalimplants.com/page-sitemap.xml) (32 pages), [post-sitemap.xml](https://rootsdentalimplants.com/post-sitemap.xml) (3 Blog posts), [map-view-sitemap.xml](https://rootsdentalimplants.com/map-view-sitemap.xml) (`/locations/` only), [category-sitemap.xml](https://rootsdentalimplants.com/category-sitemap.xml) (`/category/blog/`), [author-sitemap.xml](https://rootsdentalimplants.com/author-sitemap.xml) (`/author/rootsdentalimplants-admin/`). REST [`/wp-json/wp/v2/pages?per_page=100`](https://rootsdentalimplants.com/wp-json/wp/v2/pages?per_page=100) returns the same 32 published pages (`X-WP-Total: 32`). REST types expose Location as CPT `map-view` (`rest_base`: `map-view`, archive `/locations/`).

**Visibility key:** **nav** = header menu on [home](https://rootsdentalimplants.com/) / [contact-us](https://rootsdentalimplants.com/contact-us/); **footer** = Elementor footer id 76; **sitemap** = Yoast page/post sitemap; **REST-only** = in WP REST but not a stable public page.

### Home

| Path | Visibility | Notes |
|---|---|---|
| `/` | nav (logo), sitemap, REST page 19 | Hero, Gravity Form 2 (hidden wrapper `#gform_wrapper_2`), Location map, videos |

### Treatments

| Path | Visibility | Notes |
|---|---|---|
| `/dental-implants/` | nav Services, footer Services, sitemap | |
| `/full-arch-dental-implants/` | nav Services, footer Services, sitemap | |
| `/single-tooth-implants/` | nav Services, footer Services, sitemap | |
| `/implant-supported-dentures/` | nav Services, footer Services, sitemap | |

### Providers

Header **About Us** → `/why-choose-us/` with Provider children ([contact-us](https://rootsdentalimplants.com/contact-us/) menu `#menu-1-828aae2`):

| Path | Visibility | Notes |
|---|---|---|
| `/why-choose-us/` | nav About Us, footer Quick Links, sitemap | |
| `/dr-clark-brinton/` | nav, sitemap | Provider |
| `/dr-seth-huish/` | nav, sitemap | Provider |
| `/dr-jonathan-gold/` | nav, sitemap | Provider |
| `/dr-brian-hale/` | nav, sitemap | Provider |
| `/dr-chris-epperson/` | nav, sitemap | Provider |
| `/dr-jacob-kaufman/` | nav, sitemap | Provider |
| `/adam-kearns/` | nav, sitemap | Provider (CRNA; slug has no `dr-`) |

### Locations

Five Location records in REST [`/wp-json/wp/v2/map-view`](https://rootsdentalimplants.com/wp-json/wp/v2/map-view?per_page=100). Cards and Leaflet map are rendered on the archive, not as standalone city marketing pages.

| Path | Visibility | Notes |
|---|---|---|
| `/locations/` | nav (custom item `/locations`), sitemap (`map-view-sitemap.xml`), REST archive | JetEngine listing id 261; five cards + Leaflet map |
| `/locations/gresham/` | REST `map-view` 1328 | HTTP **301** → `/locations/` ([probe](https://rootsdentalimplants.com/locations/gresham/)) |
| `/locations/troutdale/` | REST `map-view` 1327 | Same pattern (REST link; not in page sitemap) |
| `/locations/salem/` | REST `map-view` 258 | Same pattern |
| `/locations/portland/` | REST `map-view` 256 | Same pattern |
| `/locations/vancouver/` | REST `map-view` 254 | Same pattern |

Card data on [locations](https://rootsdentalimplants.com/locations/) (address / phone / hours / NexHealth `lid` / sister-site “About” link):

| Location | Address | Phone | Hours | NexHealth `lid` | About (leaves this host) |
|---|---|---|---|---|---|
| Gresham | 22400 SE Stark St Suite 103, Gresham, OR 97030 | 503-512-6184 | Mon–Thu 8:00 AM–5:00 PM | 38552 | `http://rootsdental.com/roots-dental-gresham/` |
| Troutdale | 191 E Historic Columbia River Hwy, Troutdale, OR 97060, United States | 503-855-6792 | Tue–Fri 8:00am–5:00pm | 38541 | `http://rootsdental.com/roots-dental-troutdale/` |
| Salem | 2510 12th St SE, Salem, OR 97302 | 503-506-6339 | Mon–Fri 8:00am–3:00pm | 38526 (also Google Reserve `gei` / `rwg_token`) | `http://rootsdental.com/salem/` |
| Portland | 4224 NE Halsey St #330, Portland, OR 97213 | 503-647-6135 | Mon–Thu 8:00am–5:00pm | 38546 (also global header Book Now) | `http://rootsdental.com/portland/` |
| Vancouver | 16600 SE 15th St, Vancouver, WA 98683 | 360-310-4683 | Mon–Thu 8:00am–3:00pm | 77842 (also Google Reserve tokens) | `http://rootsdental.com/vancouver/` |

Leaflet markers (lat/lng) on the same page: Gresham 45.5187366, −122.43212752704; Troutdale 45.5409352, −122.38734832471; Salem 44.9166413, −123.0302308; Portland 45.5333859, −122.6200202; Vancouver 45.61042565, −122.50235005. Marker image: `/wp-content/uploads/2024/12/marker2.png`. Map popup API: `/wp-json/jet-engine/v2/get-map-marker-info/`.

### Blog

| Path | Visibility | Notes |
|---|---|---|
| `/blog/` | nav Resources, footer Quick Links, sitemap | Index |
| `/post-surgery-care-what-to-expect/` | post sitemap | Blog post |
| `/how-to-prepare-for-a-dental-implant-procedure/` | post sitemap | Blog post |
| `/benefits-of-dental-implants-over-traditional-dentures/` | post sitemap | Blog post |
| `/category/blog/` | category sitemap | Same 3 posts |
| `/author/rootsdentalimplants-admin/` | author sitemap | Author archive |

### Legal

| Path | Visibility | Notes |
|---|---|---|
| `/privacy/` | sitemap; linked from Gravity Form HTML | Not in header nav |
| `/terms/` | sitemap; linked from Gravity Form HTML | H1 is SMS/TCPA terms (prior pass) |

### Campaign / dinner

Not in header or footer. Each dinner page embeds a distinct HighLevel form iframe.

| Path | Visibility | HighLevel form id | Source |
|---|---|---|---|
| `/implant-dinner-troutdale/` | sitemap, REST 1907 | `11n5gtzxyeo2612GAB0v` | [page](https://rootsdentalimplants.com/implant-dinner-troutdale/) |
| `/implant-dinner-gresham/` | sitemap, REST 1896 | `R4LajQi8NjYsISJZz2SQ` | [page](https://rootsdentalimplants.com/implant-dinner-gresham/) |
| `/implant-dinner-halsey/` | sitemap, REST 1749 | `OqNiYQtOXtn4APgNNKxE` | Portland/Halsey dinner |
| `/implant-dinner-vancouver/` | sitemap, REST 1662 | `nMKSMbkKjmSq87ckvEc6` | |
| `/implant-dinner-salem/` | sitemap, REST 1555 | `mlXsZpOh1Djk5hULYx2j` | |

### Thank-you

| Path | Visibility | Notes |
|---|---|---|
| `/thank-you/` | sitemap, REST 1419 | Post-submit confirmation page (Gravity AJAX also supports `gformRedirect()`) |
| `/implant-dinner-thank-you/` | sitemap, REST 1579 | Dinner RSVP thank-you |

### Spanish

| Path | Visibility | Notes |
|---|---|---|
| `/implantes-dentales/` | sitemap, REST 1126 | Spanish implant landing + Gravity Form 3. Not in English header nav |

### Tools (quiz, smile-preview)

| Path | Visibility | Notes |
|---|---|---|
| `/implant-eligibility-quiz/` | nav “Eligibility Quiz”, sitemap, REST 1455 | Location picker only (no quiz iframe) |
| `/implant-eligibility-quiz/?location=portland` | query on same page | HighLevel quiz `6Jqj2q4IejAU265WmjlN` |
| `?location=gresham` | query | HighLevel quiz `pN48bE91TTMcG4spipTf` |
| `?location=troutdale` | query | HighLevel quiz `qD0PVPyldIKWgTPnepcr` |
| `?location=vancouver` | query | HighLevel quiz `0664GBz8Y5cezIEOKqKE` |
| `?location=salem` | query | HighLevel quiz `AX8Z6PGN67rCkrkJm4Yd` |
| `/smile-preview/` | sitemap only, REST 1853 | Gravity Form 6 + first-party `ai-photo-editor` (AIPE 0.3.2) photo UI. Not in header nav |

### Other sitemap / REST pages

| Path | Visibility | Notes |
|---|---|---|
| `/faq/` | nav Resources, footer Quick Links, sitemap | |
| `/finance-insurance/` | nav Resources, sitemap | Lender logos + outbound links |
| `/financing-options/` | sitemap only | Cherry + Proceed apply links |
| `/before-after/` | nav Resources, footer, sitemap | Jet image-comparison Media assets |
| `/testimonials/` | nav, footer Quick Links, sitemap | YouTube + Vimeo embeds |
| `/contact-us/` | nav, footer, sitemap | Primary Gravity Form 1 consultation request |

### Header menu tree (actual)

From [contact-us](https://rootsdentalimplants.com/contact-us/) / [home](https://rootsdentalimplants.com/) Elementor nav:

- About Us → `/why-choose-us/`
  - Dr. Clark Brinton, Dr. Seth Huish, Dr. Jonathan Gold, Dr. Brian Hale, Dr. Chris Epperson, Dr. Jacob Kaufman, Adam Kearns
- Services → `#` (no landing)
  - Dental Implants, Full-Arch Dental Implants, Single-Tooth Implants, Implant-Supported Dentures
- Resources → `#`
  - FAQs, Finance & Insurance, Before & After, Blog
- Testimonials → `/testimonials/`
- Locations → `/locations`
- Eligibility Quiz → `/implant-eligibility-quiz/`
- Contact Us → `/contact-us/`
- Header **Book Now** → `https://app.nexhealth.com/appt/arvory_dental_management?lid=38546`

Footer (id 76): phone `(503) 647-6135`, `implants@rootsdental.com`, Facebook icon (no href on the Facebook `<a>`), YouTube `@dentaleducation`, Services (same four treatments), Quick Links (Why Choose Us, Before & After, FAQs, Blog, Testimonials, Contact Us). Copyright 2026. No privacy/terms in the footer list.

## Main intake surfaces and field lists

No live-chat vendor in source. Booking is NexHealth (outbound). Lead capture is Gravity Forms + one Elementor popup + HighLevel dinner/quiz widgets.

### Gravity Form 1 — contact / consultation request (primary)

Seen on [contact-us](https://rootsdentalimplants.com/contact-us/) as `id='gform_1'` `data-formid='1'`, action `/contact-us/#gf_1`. Same form id also embeds on service, Provider, FAQ, finance, blog, before-after, and testimonials pages. reCAPTCHA v3 sitekey `6LcTzLYqAAAAAIs1TIXGmKzD-qElhl-5pHovNpCa`. Submit label: **Submit**. Confirmation is AJAX (`gform_ajax_frame_1`); script branches on inline confirmation vs `gformRedirect()`. A `/thank-you/` page exists; this fetch did not submit the form, so the live redirect was not observed. Checkboxes use class `ghl-checkboxes` (HighLevel-oriented CSS), but the form itself is Gravity Forms.

| Field id | Label | Type | Required | Options / notes |
|---|---|---|---|---|
| `field_1_1` | Name | text | yes | |
| `field_1_3` | Email | email | yes | |
| `field_1_4` | Phone | tel | no | |
| `field_1_6` | Preferred Location | select | no | placeholder “Select Location”; Salem, Portland, Vancouver, Troutdale, Gresham |
| `field_1_5` | Message | textarea | no | |
| `field_1_13` | Have you seen our TV commercials? | radio | no | Yes; No (default No) |
| `field_1_15` | Would you prefer to use financing or personal funds for treatment? | radio | yes | Financing (default); Personal funds; Combination of both; Unsure / Need guidance |
| `field_1_14` | Will you be able to answer the phone if we call you? | radio | no | Yes (default); No |
| `field_1_7` | (HTML) | html | — | reCAPTCHA notice; hidden |
| `field_1_9` | Marketing Message Consent | checkbox | yes | Exact wording: “I consent to receive marketing text messages from Roots Dental at the phone number provided. Frequency may vary. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out.” |
| `field_1_10` | Appointment & Update Notifications | checkbox | yes | Exact wording: “I consent to receive non-marketing text messages from Roots Dental about my order updates, appointment reminders etc. Frequency may vary. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out.” |
| `field_1_11` | (HTML) | html | — | Links to `/privacy/` and `/terms/` |

### Gravity Form 2 — homepage consultation request

[Home](https://rootsdentalimplants.com/) `id='gform_2'`, wrapper `style='display:none'` (popup / `#freeconsultation` section). Same reCAPTCHA sitekey. Submit: **Submit**.

| Field | Type | Required | Options |
|---|---|---|---|
| First Name | text | yes | |
| Last Name | text | yes | |
| Phone | tel | yes | |
| Email | email | yes | |
| Preferred Location | select | no | Salem, Portland, Vancouver, Troutdale, Gresham |
| What Would You Like To Learn About Dental Implants? | textarea | no | |
| Have you seen our TV commercials? | radio | no | Yes; No (default No) |
| Would you prefer to use financing or personal funds for treatment? | radio | yes | Financing (default); Personal funds; Combination of both; Unsure / Need guidance |
| Will you be able to answer the phone if we call you? | radio | no | Yes (default); No |
| Marketing Message Consent | checkbox | yes | Same marketing SMS wording as form 1 |
| Appointment & Update Notifications | checkbox | yes | Same transactional SMS wording as form 1 |

Form 2 also includes an HTML warning about click-arbitrage “free implant” ads, with image on `assets.cdn.filesafe.space`.

### Gravity Form 3 — Spanish landing

[implantes-dentales](https://rootsdentalimplants.com/implantes-dentales/) (prior pass; not re-fetched this write). Fields: Nombre de pila*, Apellido*, Teléfono*, Email*, Ubicación preferida (Salem, Portland, Vancouver only — no Troutdale/Gresham), ¿Qué le gustaría aprender sobre los implantes dentales? (textarea). No SMS checkboxes in that HTML.

### Gravity Form 6 — smile-preview Lead

[smile-preview](https://rootsdentalimplants.com/smile-preview/) `id='gform_6'`. Submit: **Submit**. No file field on this Gravity Form. No consent checkboxes.

| Field | Type | Required | Options |
|---|---|---|---|
| Name | text | yes | |
| Email | email | yes | |
| Phone | tel | no | |
| Preferred Location | select | yes | Salem, Portland, Vancouver, Gresham, Troutdale (no empty placeholder) |

Same page also mounts first-party plugin **AI Photo Editor** (`/wp-content/plugins/ai-photo-editor/`, AIPE 0.3.2): file input `accept="image/jpeg,image/png,image/webp"`, “Click to Generate”, before/after compare. Copy claims “Your photo never leaves this page.” Generation endpoint is not a third-party iframe in the HTML (runtime host would be in `aipe-frontend.js` / admin-ajax; not executed here).

### Elementor popup 1043 — Free Implant Pricing Guide

`data-elementor-id="1043"` on [home](https://rootsdentalimplants.com/) (`_raw/home.html`). Heading: “Not Ready to Schedule? Request Our Free Implant Pricing Guide!” Form `name="Dental Implants Exit Intent Popup Form"` (`form_id=ad9c3ca`, `post_id=1043`). Fields: First Name*, Last Name*, Phone*, Email*, Preferred Location* (same five cities), What Would You Like To Learn About Dental Implants? (textarea). reCAPTCHA v3. No SMS checkboxes.

### Elementor popup 882 — Call Us

`data-elementor-id="882"` on [home](https://rootsdentalimplants.com/). Heading: “Please call the location you’d like to visit.” Per-Location `tel:` buttons only (no form).

### HighLevel dinner RSVP (Troutdale sampled)

Iframe `https://api.leadconnectorhq.com/widget/form/11n5gtzxyeo2612GAB0v` plus `https://link.msgsndr.com/js/form_embed.js` on [implant-dinner-troutdale](https://rootsdentalimplants.com/implant-dinner-troutdale/). Fields from the iframe HTML ([api.leadconnectorhq.com/widget/form/11n5gtzxyeo2612GAB0v](https://api.leadconnectorhq.com/widget/form/11n5gtzxyeo2612GAB0v)):

| Label | Type | Required | Options |
|---|---|---|---|
| Who is in need of implants? | radio | yes | Me; Friend; Family Member |
| Please share a brief history of the person needing implants, including any past dentures, implants, or other related dental treatments. | textarea | yes | |
| Is there any specific dental implant information you would like to learn at the dinner? | textarea | yes | |
| Will you be able to answer the phone if we call you? | radio | yes | (Yes/No in widget) |
| Full Name | text | yes | |
| Phone | tel | yes | |
| Email | email | yes | |
| (consent) | checkbox | | “By checking this box, I consent to receive non-marketing text messages from Roots Dental about Implant Dinner Information. Message frequency varies, message & data rates may apply. Text HELP for assistance, reply STOP to opt out.” |
| (consent) | checkbox | | “By checking this box, I consent to receive marketing and promotional messages including special offers, discounts, new product updates among others.from Roots Dental at the phone number provided. Frequency may vary. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out.” |

Submit: **Submit**. Page copy: “Please RSVP by June 4th… Registration is free (No Cost).” Other dinner pages use different form ids (table above); field lists were not re-fetched for each.

### HighLevel eligibility quiz (Portland sampled)

Landing [implant-eligibility-quiz](https://rootsdentalimplants.com/implant-eligibility-quiz/) is a Location picker (buttons to `?location={city}`). After a Location is chosen, a HighLevel **quiz** iframe loads. Portland widget: [api.leadconnectorhq.com/widget/quiz/6Jqj2q4IejAU265WmjlN](https://api.leadconnectorhq.com/widget/quiz/6Jqj2q4IejAU265WmjlN).

| Label | Type | Required | Options |
|---|---|---|---|
| Do you experience tooth pain that interferes with your daily activities? | radio | yes | Yes; No |
| How long have you been considering Dental Implants as a solution? | radio | yes | 1-3 months; 3 months to 1 year; I have wanted them for years |
| What part of your mouth is giving you issues? | radio | yes | Single Tooth; Multiple Teeth; Single row (arch); Both upper and lower (double arch) |
| Can you tell us more about your teeth issues? | textarea | no | |
| Are you familiar with our TV advertisements? | radio | yes | Yes; No |
| Would you prefer to use financing or personal funds for treatment? | radio | yes | Financing; Personal funds; Combination of both; Unsure / Need guidance |
| Full Name | text | | |
| Phone | tel | yes | |
| Email | email | yes | |
| I agree to terms & conditions provided by the company. By providing my phone number, I agree to receive text messages from the business. | checkbox | | |

Other Location quiz ids listed in the route tree. Internal `data-q` attributes still contain leftover chiropractic slugs (`back_pain`, `neck_stiffness`); visible labels are dental.

### NexHealth (booking, not a Lead form)

Org `arvory_dental_management` on `app.nexhealth.com`. Per-Location `lid` values in the Locations table. Not an embed; `target="_blank"` buttons.

### Financing (outbound, not embeds)

[finance-insurance](https://rootsdentalimplants.com/finance-insurance/): accordion + logo Media assets for Proceed (`www.proceedfinance.com`), Sunbit (`sunbit.com`), CareCredit (`www.carecredit.com`), Cherry (`www.withcherry.com`). [financing-options](https://rootsdentalimplants.com/financing-options/): `pay.withcherry.com/roots-dental-` and Proceed `www.proceedfinance.com/application/create?referrer=8190-…` links (prior pass). No CareCredit/Sunbit/Cherry/Proceed iframe widgets.

## Third-party hosts

| Host | Purpose | Where seen | Public IDs |
|---|---|---|---|
| `www.googletagmanager.com` | Analytics container | Sitewide (e.g. [home](https://rootsdentalimplants.com/), [contact-us](https://rootsdentalimplants.com/contact-us/)) | `GTM-5LCL4JQ` |
| `www.google.com` | reCAPTCHA v3 | Gravity + Elementor forms | sitekey `6LcTzLYqAAAAAIs1TIXGmKzD-qElhl-5pHovNpCa` |
| `www.facebook.com` / `connect.facebook.net` | Meta pixel; social | Sitewide | Pixel `710305895488093`; page `facebook.com/rootsdentalportland/` |
| `cdn.callrail.com` | Phone number swap | Sitewide (`swap.js`) | company `303096992`, path `wp-0-5-3` |
| `app.nexhealth.com` | Booking | Header, [locations](https://rootsdentalimplants.com/locations/), [contact-us](https://rootsdentalimplants.com/contact-us/) | org `arvory_dental_management`; lids 38546, 38552, 38541, 38526, 77842 |
| `use.typekit.net` | Adobe Fonts | Sitewide | kit `vrx6pxv.css` |
| `player.vimeo.com` / `i.vimeocdn.com` | Video embeds + posters | Home, [testimonials](https://rootsdentalimplants.com/testimonials/), quiz, dinner, FAQ, Provider pages | IDs below |
| `www.youtube.com` / `i.ytimg.com` | Video embeds + posters; channel | Home, testimonials, FAQ, dinner | Channel `@dentaleducation`; IDs below |
| `www.instagram.com` | Social | JSON-LD / chrome | `instagram.com/roots_dental/` |
| `api.leadconnectorhq.com` / `link.msgsndr.com` / `backend.leadconnectorhq.com` / `images.leadconnectorhq.com` / `stcdn.leadconnectorhq.com` | HighLevel forms + quizzes | Dinner pages; quiz `?location=` | Form/quiz ids in route tables |
| `fonts.googleapis.com` / `fonts.gstatic.com` | HighLevel widget fonts | HighLevel iframes | Roboto |
| `challenges.cloudflare.com` | Turnstile (HighLevel iframe) | HighLevel widgets | |
| `storage.googleapis.com` | HighLevel iframe resizer / pixel | HighLevel widgets | `builder-preview/iframe/` |
| `assets.cdn.filesafe.space` / `cdn.filesafe.space` | GHL media CDN | Home click-arbitrage PNG; HighLevel preconnect | `74Vbf0yFwCjMaZDjnUQF/media/681943a515c1703c4e069051.png` |
| `www.proceedfinance.com` | Finance apply | finance pages | |
| `pay.withcherry.com` | Cherry pay | `/financing-options/` | path `roots-dental-` |
| `sunbit.com` | Lender outbound | `/finance-insurance/` | logo only on-site |
| `www.carecredit.com` | Lender outbound | `/finance-insurance/` | |
| `www.withcherry.com` | Lender outbound | `/finance-insurance/` copy | |
| `lh3.googleusercontent.com` / `search.google.com` | Google review avatars / place | Quiz pages (WP Social Reviews) | placeid `ChIJRUBuglH_v1QRCbjCrnOX1ok` (prior pass) |
| `secure.gravatar.com` | Author avatars | Blog / author archive | |
| `www.dentalimplanthero.com` | Outbound badge | `/dr-clark-brinton/` (prior pass) | |
| `rootsdental.com` | Sister general-practice Location pages | Location card “About {city}” | |
| `policies.google.com` | reCAPTCHA legal links | Forms | |
| `gmpg.org` | XFN profile link | `<head>` | |

Self-hosted Elementor font CSS under `/wp-content/uploads/elementor/google-fonts/css/` (Roboto, Roboto Slab, Playfair Display, Montserrat). Leaflet CSS/JS is self-hosted from JetEngine (`…/leaflet/leaflet.css`). No Mapbox/Google Maps JS host in HTML; OSM/other tiles would load at runtime.

**Not found in page source:** Intercom, Drift, Tidio, Tawk, Crisp, Facebook Messenger plugin, Calendly, Zocdoc, Open Dental, HubSpot chat, Hotjar, TikTok pixel, standalone GA `G-` / `UA-` (only GTM), Wistia, Vidyard, Typeform, Outgrow.

## Media hosts

| Host / path | Role | Notes |
|---|---|---|
| `rootsdentalimplants.com/wp-content/uploads/` | Media assets | Logos, Provider headshots, before/after stills (`before_1.jpg`…`after_9.jpg` on [before-after](https://rootsdentalimplants.com/before-after/)), video posters, Depositphotos stock (`Depositphotos_*` in [page-sitemap.xml](https://rootsdentalimplants.com/page-sitemap.xml)), homepage background video setting `/wp-content/uploads/2025/02/Untitled-video.mp4` |
| `player.vimeo.com` | Embeds (not downloaded) | Recurring: `1040251039`, `1040252443`, `1040255650`, `1040259033`, `1040622074`, `1101752183`, `1108607676`; home `1043809908`; Provider extras `1041278519`, `1041321604` (prior pass) |
| `i.vimeocdn.com` | Vimeo posters | Used as Jet video overlays on [testimonials](https://rootsdentalimplants.com/testimonials/) |
| `www.youtube.com/embed/` | Embeds (not downloaded) | Testimonials/home shared: `2FPTk-kRf2U`, `YEPJpGkD14U`, `sGpBwyDRxyI`, `fgPvxnh0nDY`, `z7WdOxs6twQ`; home also `pN3CBJLzDLE`, FAQ `iRSN7rHyZZk`, `FHHAhgexIh8`; dinner Troutdale `x_hY-3fO7tE` |
| `i.ytimg.com` | YouTube posters | e.g. `vi_webp/x_hY-3fO7tE/maxresdefault.webp` |
| `assets.cdn.filesafe.space` | One GHL PNG | Click-arbitrage explainer |
| `lh3.googleusercontent.com` | Reviewer avatars | Quiz / WP Social Reviews |
| `secure.gravatar.com` | Blog author | |

Before/after: Jet image-comparison sliders, local uploads only — no video embeds on that page. Testimonials: Jet lazy YouTube + Vimeo iframes; posters from Vimeo CDN / YouTube, not WP uploads for those clips.

## Gaps / redirects / 404s

- `/locations/{city}/` exists in REST as published `map-view` Locations but **301 to `/locations/`**. Yoast `map-view-sitemap.xml` lists only the archive. There is no distinct public city page on this host.
- `/portland/` **301** → `/implant-eligibility-quiz/` (not a Portland Location page).
- `/salem/`, `/gresham/`, `/troutdale/`, `/vancouver/` were previously observed collapsing to `/locations/` (prior pass).
- REST pages list matches the page sitemap: **no extra published pages** hiding from nav-and-sitemap. Location CPTs are the REST-only records, and they redirect.
- Gravity confirmation redirect to `/thank-you/` is inferred from the page existing and AJAX `gformRedirect()` support; not confirmed by a live submit.
- HighLevel dinner forms besides Troutdale were not opened; quiz widgets besides Portland were id-census only.
- Leaflet tile hosts and any GTM-injected tags (GA4 `G-`, extra pixels) are not visible in static HTML.
- First GET of `/dr-clark-brinton/` timed out in an earlier pass; later 200.
- `sitemap_index.xml` was 200 here; an earlier attempt reported 500 (flaky).
- No 404s among the required fetches (locations, contact, quiz, smile-preview, testimonials, before-after, dinner-troutdale, REST types/pages/posts/map-view).
- Chat/booking widgets named in the brief (Intercom, Drift, Zocdoc, Open Dental) were not present.
- This pass did not execute JavaScript beyond reading iframe HTML for HighLevel, did not download Media assets or videos, and did not fill forms.

## Surfaces of interest for the v1 cut

All exist on the live site (2026-08-18):

| Surface | Where | What it is |
|---|---|---|
| Eligibility quiz | [`/implant-eligibility-quiz/`](https://rootsdentalimplants.com/implant-eligibility-quiz/) | Location picker, then HighLevel quiz iframe |
| Pricing-guide magnet | Elementor popup `1043` | Exit-intent Lead form, not a PDF download |
| Call Us | Elementor popup `882` | `tel:` list, no form |
| Finance & insurance | [`/finance-insurance/`](https://rootsdentalimplants.com/finance-insurance/), [`/financing-options/`](https://rootsdentalimplants.com/financing-options/) | Lender logos + outbound apply links; no iframes |
| Before & after | [`/before-after/`](https://rootsdentalimplants.com/before-after/) | Jet image-comparison stills, no video |
| Testimonials | [`/testimonials/`](https://rootsdentalimplants.com/testimonials/) | YouTube + Vimeo embeds |
| Click-arbitrage notice | Homepage Gravity Form 2 HTML + `filesafe.space` PNG | Warning about “free implant” ads |
| Meet-or-beat / membership prices | Homepage | “As low as $18,995 / $35,995 with implant membership plan”; “meet or beat any local competitor pricing with a written quote” |
| Implant dinners | `/implant-dinner-{city}/` × 5 + thank-you | HighLevel RSVP widgets |
| Smile preview | [`/smile-preview/`](https://rootsdentalimplants.com/smile-preview/) | Gravity Form 6 + first-party AI photo editor |
| Spanish landing | [`/implantes-dentales/`](https://rootsdentalimplants.com/implantes-dentales/) | Gravity Form 3; not in header nav |
| Header Book Now | NexHealth | Outbound `app.nexhealth.com`, not a Lead form |

## Source list

- [https://rootsdentalimplants.com/](https://rootsdentalimplants.com/) and Yoast sitemaps (page, post, category, author, map-view).
- Local dumps under `.scratch/roots-site-spec/research/_raw/` (`home.html`, `contact-us.html`, quiz, smile-preview, dinners, thank-you, LeadConnector iframe HTML).

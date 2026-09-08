# Public-page preview — 2026-09-08

The current stage adds 30 inner routes to the existing homepage. It is committed locally on main in this publication checkout, but has not been pushed or deployed. Keep the existing `noindex, nofollow` metadata and robots disallow.

## Implemented routes

| Area                  | Preserved paths                                                                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Treatments            | `/dental-implants/`, `/single-tooth-implants/`, `/full-arch-dental-implants/`, `/implant-supported-dentures/`                                  |
| About                 | `/why-choose-us/`                                                                                                                              |
| Provider profiles     | `/dr-clark-brinton/`, `/dr-seth-huish/`, `/dr-jonathan-gold/`, `/dr-brian-hale/`, `/dr-chris-epperson/`, `/dr-jacob-kaufman/`, `/adam-kearns/` |
| Resources             | `/faq/`, `/finance-insurance/`, `/financing-options/`, `/before-after/`, `/testimonials/`                                                      |
| Locations and contact | `/locations/`, `/contact-us/`                                                                                                                  |
| Dinner events         | `/implant-dinner-gresham/`, `/implant-dinner-troutdale/`, `/implant-dinner-halsey/`, `/implant-dinner-vancouver/`, `/implant-dinner-salem/`    |
| Preview experiences   | `/implant-eligibility-quiz/`, `/smile-preview/`, `/thank-you/`, `/implant-dinner-thank-you/`                                                   |
| Policy preview        | `/privacy/`, `/terms/`                                                                                                                         |

`apps/web/src/content/pages.ts` contains the public content and route allowlist. The `$slug` route returns a real not-found response for unknown slugs. Shared navigation groups treatments and patient resources; profiles are reached through the team directory and individual dinner pages through the contact page. Metadata is rendered on the server. Booking continues to use the five established NexHealth location IDs.

The homepage hero, treatment interaction, evidence sections and location composition are retained. Header/footer were extracted into a shared shell with dedicated page links. The floating back-to-top control is shared, appears after 400px, and respects reduced motion; the redundant footer control was removed. The user subsequently approved the separate homepage experiment: qualified pricing, a separate Why Choose Us video and TV interview link, and all seven provider cards are now integrated. Hero JSX/effects/media remain unchanged.

## Explicit preview behavior

The user authorized **UI/layout only** for the quiz, callback, pricing-guide, RSVP and smile-preview experiences. They do not post, persist or send entries, load GHL, contact a backend or generate patient images. The quiz is a new sample interface, not an imported or clinically validated eligibility algorithm. It cannot produce an eligibility finding. Thank-you routes explicitly say no submission or reservation occurred. The disabled smile photo control does not read or upload files. Real calls and NexHealth booking remain available separately.

Privacy and SMS terms are condensed draft adaptations of the existing policies, not a legal-equivalence migration. They are visibly identified as preview editions requiring business review. Full policy review remains required before launch and before connecting data-collection workflows.

## Sources and content limits

Fresh primary-source HTTPS reads on 2026-09-08 covered the legacy [page sitemap](https://rootsdentalimplants.com/page-sitemap.xml), [post sitemap](https://rootsdentalimplants.com/post-sitemap.xml), and the map-view/category/author sitemaps, as well as the individual implemented pages. Legacy paths in the table map directly to `https://rootsdentalimplants.com` plus the path for provenance; no visitor-facing links point back to that site or the parent-brand website.

Copy is a concise adaptation, not full content parity. The seven profiles use verified legacy biographies and identify six DMDs plus Adam Kearns, MS CRNA, accurately. All nine before/after pairs from the [original gallery](https://rootsdentalimplants.com/before-after/) are local and displayed without cropping; patient identities/treatment specifics are not invented. The testimonial page currently retains Crystal and the three existing attributed excerpts; additional videos remain a separate possible refinement.

Clinical wording avoids the original site's blanket lifetime/permanent guarantees and broad whole-body health claims. General implant risks, healing and ongoing-care context were cross-checked against the [FDA patient information](https://www.fda.gov/medical-devices/dental-devices/dental-implants-what-you-should-know). Final clinical copy still needs the practice's review. Financing lists the providers named by Roots and links to provider information, without reproducing unverified approval rates, loan limits or credit promises.

Event information was checked against each legacy event page on 2026-09-08. Gresham lists October 29, 2026, 5:30 PM at Bumpers, with October 23 RSVP deadline. Halsey, Vancouver and Salem list past May/June dates and are marked past; Troutdale's date/venue remain unannounced. The Gresham offer retains the per-arch amount, maximum, attendee qualification and 30-day booking condition. Old event discounts and stale urgency are not presented as current. Confirm new event dates before changing these states.

New local assets and original sources:

- `hale.webp`: `/wp-content/uploads/2025/05/Brian-R.-Hale-DMD-tall.webp`
- `epperson.jpg`: `/wp-content/uploads/2025/09/Epperson-Headshot-1024x769.jpg`
- `kaufman.jpg`: `/wp-content/uploads/2025/11/image7.jpg`
- `kearns.jpg`: `/wp-content/uploads/2024/12/Adam11.jpg`
- Gallery pairs 2 and 4–9: `/wp-content/uploads/2024/12/before_N.jpg` and `after_N.jpg`, except pair 2's before file is `before_2-1.jpg`. Local names use hyphens. Pairs 1 and 3 were already present.
- Favicon: documented in [the deployment guide](roots-deployment.md).

These source paths are on the legacy implant domain and were retrieved directly. Original assets remain subject to the client's production reuse approval. No stock replacement or generated patient image was introduced.

## Deferred by the user's latest direction

- `/implantes-dentales/`: Spanish explicitly deferred for later; no replacement or redirect has been invented.
- `/blog/`, `/post-surgery-care-what-to-expect/`, `/how-to-prepare-for-a-dental-implant-procedure/`, `/benefits-of-dental-implants-over-traditional-dentures/`: reuse the existing blog system in a later stage. Do not substitute static article pages. These routes are not implemented or linked in this stage.
- `/category/blog/` and `/author/rootsdentalimplants-admin/`: preserve in the blog migration inventory; decide appropriate archive behavior with that integration.
- GHL integration, custom backend forms and smile-image generation: not part of this stage.
- Production canonical URLs, sitemap and launch crawl policy: deferred until the final domain and launch are authorized.

The inherited blog is reusable: PostgreSQL `blog_post`, public published-post API, admin editor/publishing, Tiptap rendering and SEO helpers already exist. The unchanged API also needs Redis; editorial images need the existing media storage configuration. Later work should import the three real posts, preserve their top-level paths through shared route wrappers, and update the admin/public URL helper rather than exposing broken API-dependent routes now. The legacy posts identify Roots Dental Implants as author and December 25, 2024 as publication date.

## Validation

Web type checks, lint, 18 tests and production build pass. The HTTP preview check validates server-rendered headings, descriptions, noindex, favicon, all local links/fragments, local image responses, the five booking IDs, preview-form contracts and unknown-path 404s. Browser checks cover desktop/mobile navigation, Escape/focus handling, the preview request notice, quiz progression and mobile layouts. Final viewport and production-smoke details are recorded in the project handoff. No deployment, database migration, form submission or booking was performed.

## Testimonial video expansion — 2026-09-08

`/testimonials/` now contains all nine distinct video stories from the original testimonials page, with Crystal included once. Roots Vimeo stories: Crystal `1040622074/fdb63c88e1`, Shayla `1040252443/9a229591cd`, Renee `1040255650/81fe3c3f07`, Charlotte `1040251039/8d88d03bf5`, Diane `1040259033/beabccb16d`. Names and unlisted hashes were verified using the legacy embed configuration and Vimeo oEmbed metadata (11:10 Productions). Original posters are stored locally as `/images/story-<id>.jpg`.

The legacy page also embeds YouTube videos `2FPTk-kRf2U` (publisher Clark Brinton) and `YEPJpGkD14U`, `sGpBwyDRxyI`, `fgPvxnh0nDY` (publisher Renu Dental Implant). These appear in a separate “More patient perspectives” group with verified publisher credits and neutral descriptive titles; they are not represented as identified Roots patients. Source: https://rootsdentalimplants.com/testimonials/ and each provider's oEmbed metadata, accessed 2026-09-08. Source snapshots and metadata are in `.scratch/client-website/legacy/testimonial-videos.json` and `testimonial-assets.json`.

No iframe loads until a visitor chooses a story. One native modal dialog contains the active player, accessible title, close control and direct provider fallback link. Closing or Escape removes the player and returns focus to its card. Existing text review excerpts and homepage content remain unchanged. Browser verified all nine source mappings/open-close flows, representative Vimeo/YouTube playback, keyboard opening/Escape/focus restoration, mobile390 and widescreen2560 without overflow. Types, lint, 18 existing tests, build and 31-route smoke checks passed; 42 local SSR assets returned200. Follow-up remains local; no push/deployment.

## Bilingual and content follow-up — 2026-09-08

User superseded the Spanish deferral: all31 current public pages now have matching Spanish routes under `/es/`; English stays at existing unprefixed URLs. The compact language icon immediately before the header CTA switches the same page. `/implantes-dentales/` permanently redirects to `/es/dental-implants/`. SSR language, titles, descriptions, UI/accessible labels, form-preview states and map controls are translated. Names, credentials, amounts, conditions, addresses, media and external destinations are preserved. Recorded videos remain their original recordings. Blog/system/articles/archives remain explicitly deferred; forms/quiz/smile remain UI-only.

Implemented authorized audit follow-ups: Richard’s story (Vimeo1108607676) brings the gallery to10distinct stories; the separate317-second practice introduction (Vimeo1101752183) appears on Why Choose Us while the40-second homepage clip1043809908 stays; Roots FAQ videos iRSN7rHyZZk and FHHAhgexIh8 added. Original posters saved locally; accessible click-to-load dialogs retain Close/Escape and focus restoration. Treatment pages reuse the existing qualified membership pricing source. Financing adds the exact legacy Cherry application and Proceed account labels/referrers, a lender-qualified FAQ and staff assistance. Cash/check and neutral source-supported provider capability details restored.

All five event pages now include their verified source invitation and event-specific terms/deadlines. Gresham uses dedicated RSVP503-855-6353 and0FeAI1BSSFw; Vancouver_O0m31JsxEw; Salemixfj8vE2TZw. Current legacy Troutdale and Halsey both embedx_hY-3fO7tE (publisher titleHalsey Full Arch Implant Dinner Invitation); preserve this source mapping rather than invent a different video. Past dates stay identified as past; Troutdale remainsTBD with its publishedJune4 RSVP line and a call-to-confirm note. Offers retain30-day booking limits, and Gresham retains$500perarch/$1,000maximum. Source/user confirmation covers the event details; no invented venues/dates/phone routing.

The later width correction caps content at1440CSSpixels across homepage/header/footer/inner pages, fixes the scale unit at1px and anchors conversation-band artwork relative to content. Mobile layout and hero media are preserved. Browser checks at320/390/1440/1920/2560/3840 found no overflow in the checked layouts. Bilingual SSR checks cover62pages,1496links/fragments,51local assets, matching external destinations and preview indexing. User explicitly authorized the final commit/push/deployment after Spanish and asked to stop feature work after release.

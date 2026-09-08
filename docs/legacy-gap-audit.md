# Legacy-to-preview gap audit

Checked 2026-09-08 against deployed commit **49827b77560e1ebfa140ddeba5f6d92cb477c529** at the [Roots preview](https://app-program-haptic-panel-qmft12-30a4aa-72-60-111-188.sslip.io/). The later 1440px width adjustment is local only and is not part of this deployed comparison.

**No unexpected missing page was found in the legacy sitemap inventory. The most useful next work is restoring financing application routing, confirming Gresham RSVP routing, and adding several omitted videos.** These are recommendations, not implemented changes.

## Coverage and preserved work

The [legacy sitemap index](https://rootsdentalimplants.com/sitemap_index.xml) exposes 38 URLs across page, post, map-view, category and author sitemaps. All 31 in-scope URLs return200 on the preview. The other seven return404 and belong to the agreed Spanish/blog deferrals below. Homepage navigation/footer links were also inspected. The comparison covered four treatment routes, all seven providers, both financing pages, FAQ, locations/contact, five dinner pages, gallery, testimonials and legal/preview layouts. Live HTML and deployed JavaScript chunks were checked so click-to-load media was not mistaken for absent content.

Retained: all seven provider identities, nine before/after pairs, five clinics with matching addresses/hours/phones and NexHealth IDs, numbered map, all nine videos from the dedicated legacy testimonials page, qualified homepage prices, concise anti-scam notice, short clinic introduction and TV interview. Live release checks passed for31pages,712internal links/fragments,42local assets and two unknown-route404s. No appointments, financing applications or forms were submitted during the audit.

## Recommended additions and corrections

### 1. Restore practice-specific financing applications — high priority

[Legacy financing options](https://rootsdentalimplants.com/financing-options/) supplies a [Roots Cherry application](https://pay.withcherry.com/roots-dental-) and location/referrer-specific Proceed applications. The [deployed page](https://app-program-haptic-panel-qmft12-30a4aa-72-60-111-188.sslip.io/financing-options/) instead links generic lender homepages and tells visitors to ask which application fits their location. This adds friction for people ready to apply; it is separate from the deferred custom form backend.

Confirm the current lender accounts, then restore the direct Cherry path and a five-clinic Proceed chooser. The legacy chooser includes other general-dentistry practices, so do not copy its full roster. One legacy implant-center destination is [Proceed referrer8190-1539-28F4](https://www.proceedfinance.com/application/create?referrer=8190-1539-28F4). Approval rates, interest/fees and terms need current lender verification before reuse.

### 2. Confirm Gresham's RSVP phone and restore its current invitation — high priority

The [legacy Gresham dinner](https://rootsdentalimplants.com/implant-dinner-gresham/) uses **503-855-6353** for RSVP; the [deployed event](https://app-program-haptic-panel-qmft12-30a4aa-72-60-111-188.sslip.io/implant-dinner-gresham/) uses the general implant line **503-512-6184**. Both might reach the right team, but that routing is unverified. Confirm which number should receive event responses.

The legacy [invitation video](https://www.youtube.com/watch?v=0FeAI1BSSFw) is also absent. Restore it if its spoken details still match October29,2026. The date,5:30PM time,Bumpers address,October23 deadline and qualified $1,000/$500-per-arch offer are retained. The legacy free-registration/meet-patients promises need event-owner confirmation. Other dinner dates are past or TBD; their old promotions should not automatically return.

### 3. Add the missing Roots media — medium priority

The nine-video testimonial migration was complete for its source page, but the [legacy homepage](https://rootsdentalimplants.com/) has additional media absent from the deployed route chunks:

| Missing item | Verified source | Suggested placement |
| --- | --- | --- |
| Richard's full patient story | [Vimeo1108607676](https://vimeo.com/1108607676), publisher11:10Productions, title `Roots Richard Full_1110Productions` | Add to [patient stories](https://app-program-haptic-panel-qmft12-30a4aa-72-60-111-188.sslip.io/testimonials/) |
| Five-minute practice introduction | [Vimeo1101752183](https://vimeo.com/1101752183), title `RootsAbout Us5m_1110Productions` | [Why Choose Us](https://app-program-haptic-panel-qmft12-30a4aa-72-60-111-188.sslip.io/why-choose-us/) |
| Pain/comfort explainer | [Roots YouTube video](https://www.youtube.com/watch?v=iRSN7rHyZZk) | Relevant [FAQ](https://app-program-haptic-panel-qmft12-30a4aa-72-60-111-188.sslip.io/faq/) answer |
| Cost explainer | [Roots YouTube video](https://www.youtube.com/watch?v=FHHAhgexIh8) | FAQ/financing |

Check spoken claims and current relevance before adding. The existing40-second intro and TV interview remain; the longer film is a different asset. A further [experience explainer](https://www.youtube.com/watch?v=z7WdOxs6twQ) is published by Renu Dental Implant and is a lower-priority editorial choice, not automatically a Roots-branded asset.

### 4. Give direct treatment visitors pricing context — medium priority

The [legacy full-arch](https://rootsdentalimplants.com/full-arch-dental-implants/) and [denture](https://rootsdentalimplants.com/implant-supported-dentures/) pages show the qualified $18,995/$35,995 tiers. Their [deployed full-arch](https://app-program-haptic-panel-qmft12-30a4aa-72-60-111-188.sslip.io/full-arch-dental-implants/) and [denture](https://app-program-haptic-panel-qmft12-30a4aa-72-60-111-188.sslip.io/implant-supported-dentures/) counterparts omit those tiers and a contextual pricing link. Prices are retained on the homepage, so this is a journey gap rather than site-wide missing information. Reuse a compact qualified module or link to it. Keep membership and written-quote conditions; confirm the legacy All-On-4/All-On-X product naming.

### 5. Restore selected practical details after business confirmation — medium/lower priority

- **Provider capabilities:** [Legacy Brinton](https://rootsdentalimplants.com/dr-clark-brinton/) describes zygomatic implants for complex upper-jaw cases; [deployed Brinton](https://app-program-haptic-panel-qmft12-30a4aa-72-60-111-188.sslip.io/dr-clark-brinton/) omits that capability. [Legacy Huish](https://rootsdentalimplants.com/dr-seth-huish/) describes sedation certification and regular nurse-anesthetist collaboration; [deployed Huish](https://app-program-haptic-panel-qmft12-30a4aa-72-60-111-188.sslip.io/dr-seth-huish/) retains training only. Confirm current scope and wording before adding concise explanations.
- **Payment help:** [Legacy finance/insurance](https://rootsdentalimplants.com/finance-insurance/) lists cash/check alongside cards; the [preview](https://app-program-haptic-panel-qmft12-30a4aa-72-60-111-188.sslip.io/finance-insurance/) omits cash/check. Legacy financing options also offers staff application assistance. Restore if still accurate.
- **Written reviews:** [Legacy testimonials](https://rootsdentalimplants.com/testimonials/) has six accounts; the [preview](https://app-program-haptic-panel-qmft12-30a4aa-72-60-111-188.sslip.io/testimonials/) uses three brief excerpts. Fuller selected accounts could add reassurance about anxiety and communication. This is optional editorial depth.
- **Office detail links:** [Legacy locations](https://rootsdentalimplants.com/locations/) links to each office on rootsdental.com; the [preview](https://app-program-haptic-panel-qmft12-30a4aa-72-60-111-188.sslip.io/locations/) has directions/booking instead. Add “About this office” only if the business wants that cross-site journey. Essential contact information is retained.
- **Material options:** legacy homepage copy distinguishes ceramic/zirconia and titanium but mixes crown and implant-body terminology. Clarify what Roots actually offers before adding an options explanation.

## Intentional later work, not accidental omissions

Spanish `/implantes-dentales/`; existing blog integration `/blog/`, its three articles (`/post-surgery-care-what-to-expect/`, `/how-to-prepare-for-a-dental-implant-procedure/`, `/benefits-of-dental-implants-over-traditional-dentures/`) and category/author archives (`/category/blog/`, `/author/rootsdentalimplants-admin/`) are deferred by user decision. Contact/guide/event forms, eligibility quiz and smile preview are intentionally UI-only; their backend flows remain later work. Existing external telephone/NexHealth actions are working destinations.

This remains a preview: [robots.txt](https://app-program-haptic-panel-qmft12-30a4aa-72-60-111-188.sslip.io/robots.txt) disallows crawling and pages emit noindex/nofollow. Before an explicitly approved public launch, settle the production domain, canonical/social metadata, sitemap, verified structured data, deferred-route handling and final policy/consent wording. Do not remove preview protection now or copy inaccurate legacy structured data wholesale.

## Evidence and limits

Fresh sitemap/route evidence: `.scratch/client-website/audit/legacy-routes.json`, `route-comparison.json` and paired page-text snapshots. Detailed checks: `care-content.md`, `media-actions.md`, `live-page-evidence.json` in that directory. Provider oEmbed metadata verified video identities/publishers. The audit establishes published-content differences, not current clinical capabilities, lender account ownership, phone routing or event promises; those need the business context identified above. No analytics or campaign inventory was supplied, so sitemap/nav coverage cannot prove every unpublished landing page is accounted for.


## Subsequent user-approved implementation

This report describes the deployed49827b7 baseline. The user subsequently approved and implemented the priority financing paths/help, event data/videos, Richard/long-introduction/FAQ media, treatment pricing context and neutral provider/payment details. Spanish deferral was superseded by an English-default `/es/` translation of all current pages. Blog and custom form backends remain deferred. Optional fuller reviews, cross-site office links and ambiguous material descriptions were not required for this release. See page-migration.md for exact source/video distinctions and final scope; no further feature work is planned after the authorized release.

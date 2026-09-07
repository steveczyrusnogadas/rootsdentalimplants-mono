---
name: baseplate-client-website
description: Build an independent client website with Baseplate, from business brief and research through site selection, local setup, branding, validation, and deployment preparation. Use for new agency client projects or continuing their delivery workflow.
---

# Baseplate client website

Turn the client's business needs into a working, independently branded project. Commands own deterministic setup; this skill guides requirements, tradeoffs, and delivery. Use the client's existing decisions and authorization throughout.

## Discover the starting point

Identify the Baseplate source checkout and the intended client directory. Read applicable `AGENTS.md`, `CONTEXT.md` (or its map), relevant `docs/adr/`, and the client’s existing brief before changing files. Resolve paths below from the repository root, except links to this skill's references.

Inspect root and app `package.json`, setup scripts, environment examples, frontend configuration, and current deployment docs. Prefer implemented code over stale descriptions. Record which capabilities are present in this checkout and which require work. A command exists only when its implementation and arguments are verified here: generator, preset, and add-feature commands are not supplied by this skill. Read [local-project.md](references/local-project.md) when creating, configuring, or running a client project.

## Shape the brief

Start with what the user has already said. Fill only gaps that change scope, content, design, cost, or deployment: business identity, audience/service area, primary visitor action, pages/content, who updates it, brand assets, integrations, and delivery constraints. Ask a small focused question when necessary; continue independent work while awaiting the answer. Use explicit provisional assumptions for reversible choices instead of imposing a questionnaire.

For a Davao City client, establish the actual branch/service area, contact channel, and audience language from evidence; do not infer Cebuano, Filipino, English, prices, hours, or an address solely from location. Research when public evidence would improve the brief. Start with client-provided material and the business's own site or official profiles; match the business and branch before using listings. Record source URLs and access dates, distinguishing user-provided facts, externally sourced facts, assumptions, and unresolved conflicts. Keep unverified claims out of production copy, testimonials, and structured data. Treat reference sites as evidence and inspiration, not permission to reuse their text or assets. If research is unavailable, carry on with labeled gaps and the supplied material.

Keep one concise `.scratch/client-website/spec.md` in the **client project**, with the brief, research notes, selected direction, deferred features, and acceptance criteria. Update an existing spec instead of duplicating it. Split research into a linked file only when it becomes substantial. Use `.scratch/client-website/issues/NN-slug.md` with the repo's `Status:` roles for real follow-up tickets; preserve existing numbering and comments. Record settled domain terminology or architectural decisions in `CONTEXT.md` / `docs/adr/` only when warranted by the repository's domain conventions. No empty document bundles.

## Recommend the smallest suitable site

Propose a direction and optional features with reasons tied to the visitor action and content owner. These are **planning categories**, not currently guaranteed executable presets:

| Direction | Fit | Capability check |
| --- | --- | --- |
| Public marketing site | Services, credibility, location, contact or booking link | Prefer a lean site without admin/database when supported. The current full-stack starter is not a verified standalone static preset. |
| Blog/content publishing site | Staff need draft/publish and media workflows | Inspect public Blog post rendering plus admin publishing, API, storage, and their operational dependencies. |
| Internal dashboard | Authenticated business operations | Establish actual roles, data, and workflows; starter admin screens alone do not implement a client's business. |

Suggest extras only where justified: Lead intake, booking integration, gallery, analytics, multilingual content, or publishing. Distinguish included functionality from a proposed integration and its ongoing cost/ownership. The **Assistant** is optional signed-in admin chat, off the recommendation by default; a public visitor chat feature is a separate requirement. Inspect how unused Assistant UI/routes and provider configuration behave rather than inventing a feature flag or requiring an AI key for every client.

For a marketing-only brief, explicitly describe any gap between the desired lean site and the available starter. Continue a scoped local prototype where authorized; ask only if choosing a full stack or implementing a new variant materially changes the agreed work. Do not claim a backend-free/static site merely because admin links are hidden, or implement a generator as incidental client work. A future verified static preset should remain eligible without imposing the starter's backend.

This step is complete when the spec says what will be built, why it fits, optional/deferred features, and any capability gaps affecting delivery.

## Build in the client project

Create or reuse the independent project using the local-project reference. Keep the source starter and other clients untouched. Record the source revision and actual setup commands in the client's spec. Prefer verified repository commands over duplicating their logic in ad hoc scripts.

Customize the public app's composition, typography, colors, imagery, navigation, page copy, metadata, and favicon for this business. Inspect current imports and ownership first. When app-owned presentation is present, use `apps/web/src/index.css`, `apps/web/src/components/ui`, and its app-local `components.json`; admin branding is a separate choice. Older revisions may still import shared `@repo/ui` styles: account for all consumers and relevant ADRs before changing them. Keep client branding in client/app-owned files, not in the source starter or unrelated admin screens.

Preserve the public app's server rendering and SEO behavior. Verify route heads, first-response HTML, canonical/public origins, social metadata, crawl controls, and real missing-page responses. Check sitemap/robots implementations rather than assuming routes mentioned in docs exist. A static alternative must produce crawlable content and equivalent metadata before replacing the working SSR path. Business structured data must reflect confirmed facts. Keep internal service URLs and secrets out of browser configuration.

Implement the agreed visitor action end to end. A contact form needs a working destination and success/error behavior; a button or mock response is not completed Lead intake. Clearly label any prototype-only integration or missing client assets.

## Validate and prepare delivery

Run the client checkout's available type checks, lint, build, and relevant tests. Use the actual scripts discovered earlier; explain skipped checks and failures. Inspect mobile and desktop layouts, navigation, keyboard/focus behavior, contrast, forms, and missing/error states. For public pages inspect returned HTML as well as the hydrated browser. For publishing, exercise draft/publish and public rendering; for internal operations, exercise the agreed roles and access boundaries.

Read the client's current deployment docs and configuration (including `DOKPLOY.md` when applicable). Prepare the concrete service topology, domain/env mapping, persistent-data ownership, migrations/bootstrap steps, and smoke tests for that project. Separate local values from production secrets. Verify whether the public build requires an SSR server before proposing static hosting. Preserve stable project identities and existing data; follow documented migration/backup procedures when changing them.

Finish with the client directory, working local URLs, chosen direction/features, completed checks, and remaining client inputs or deployment blockers. Keep reproducible commands and operational notes with the client spec. Deployment preparation is complete when those instructions match the build and identify unresolved inputs; it does not mean a live deployment was performed. Live publishing, contacting the business, and external account changes require authorization for those actions, not just this workflow's invocation.

# Roots project handoff — 2026-09-08

## Ownership and checkout

Continue Roots work in `/Users/steve/Code/roots-dental-implants-publish`, registered as its own Codex project. GitHub: https://github.com/steveczyrusnogadas/rootsdentalimplants-mono . Published main is `e40d116db807fec29d2c123d67281ee7eec172db`; CI passed. The earlier `/Users/steve/Code/roots-dental-implants` is an independent development copy, not the ongoing publication checkout. Neither client checkout depends on or should modify Baseplate source repositories. The initial replacement commit preserves destination history; never force-push to reconcile unrelated starter history.

## Approved homepage

One public homepage with the original forest/slate/mint/sage palette and logo, looping muted clinic footage with poster fallback, smooth single-open treatment accordions, three doctors, two real before/after pairs, Crystal's click-to-load testimonial, three sourced review excerpts, FAQs with visible online-offers notice, five booking locations, and footer. Real booking links use NexHealth. No legacy-site navigation or invented patient outcomes. No public inner pages or lead form yet. Original tree artwork retained. User rejected the experimental sage section backgrounds and curved accents: those were reverted; do not reintroduce them. Preserve existing scroll reveals and mobile design.

## Preview and deployment

Generated Dokploy preview (provided by coordinating task): https://app-program-haptic-panel-qmft12-30a4aa-72-60-111-188.sslip.io/ . Dashboard: https://d.suryzc.com . Do not assume the live business domain should be replaced.

One Dokploy Application, root `Dockerfile`, context `.`, target `web`, port `80`; Bun/Nitro SSR. No API/admin/Postgres/Redis/MinIO/worker services, application secrets, or volumes required for the homepage. Both arm64 and amd64 images previously built and passed homepage/404/assets runtime smoke checks. See `docs/roots-deployment.md`. Credentials do not belong in this document.

Preview remains noindex,nofollow in root metadata and disallowed in robots.txt. Canonical domain and production crawl policy require coordinated launch decisions. Confirm final business/asset permissions and legal/privacy requirements before public launch.

## Current widescreen change — uncommitted, not deployed

`apps/web/src/index.css` has a new >=1600px block replacing the narrow 1450px composition with consistent fluid gutters and a 3200px maximum content width. Typography, controls, section spacing, portraits, location rows, and footer scale together through a capped CSS unit. Paragraphs retain character-based reading measures. No new background treatments. Rules below 1600px remain unchanged.

Local preview is running at http://localhost:5375/ from this checkout. Earlier port5373 serves the previous development copy. Visual checks covered CSS widths 1920, 2560, 3840, and 390; no horizontal overflow detected. Local screenshots are ignored under `.scratch/widescreen/`. Type checks, lint, web tests, production build and diff whitespace check passed during the change. This fix has not been committed, pushed, or deployed; review on the user's actual display before deciding further refinements. The prior generated preview still shows the published version.

New owner task: `01a07fa0-9c48-7761-9a58-cd08ca9d1b7a` (Roots website refinement and inner-page planning). The old task has stopped client edits after this handoff. Continue review, any inner-page planning, and authorized publication/deployment here.

## Inner-page stage — 2026-09-08

The dedicated owner implemented 30 inner routes alongside the homepage; see [page migration](page-migration.md) for exact paths, provenance, explicit preview contracts and deferred work. Shared navigation now groups treatments/resources and links to real local pages. The full team, nine original gallery pairs, locations/hours, financing, FAQs, event pages and legal drafts are available. User authorized all forms/quiz/smile layouts as non-functional previews only. Legacy favicon PNG and floating back-to-top are integrated; footer duplicate was removed.

User subsequently requested the old source preview5373 be stopped; verified its PID/cwd and stopped only that process. Current publication preview5375 is running from this checkout. The blog must reuse existing API/admin/Tiptap infrastructure later (requires additional services); no static article replacement was made. Spanish is explicitly deferred. Homepage additions are isolated in experiment worktree59e2 and are not incorporated here. All stage work remains uncommitted/unpushed/undeployed.

### Final stage validation

- Web type checks, lint, 18 tests / 703 assertions, build and diff check passed.
- Dev5375 and temporary production5390 both passed HTTP checks:31 pages200,733 internal links/fragments,32 local assets200,2 unknown routes404, all5 NexHealth IDs preserved, no visitor-facing legacy links. All30 inner-page titles unique; PNG favicon bytes/MIME verified. Temporary production server stopped after checks.
- Browser: grouped desktop/mobile navigation, Escape returning focus, callback preview notice and three-step quiz to honest preview response verified. Responsive DOM checks at320/390/1920/2560/3840 covered homepage, location, team, gallery, dinner and quiz layouts with no horizontal overflow. Sample desktop/mobile screenshots reviewed. A 3840 capture limitation noted earlier remains; DOM dimensions were checked.
- Floating back-to-top appears after scrolling, responds to keyboard/click, disappears near the top; worker tested reduced-motion instant scrolling in its isolated harness. Browser reduced-motion emulation was unavailable. Footer duplicate removed.
- Homepage main/hero markup compared byte-for-byte with HEAD and unchanged; only shared shell and inherited widescreen styling affect baseline. No homepage experiment changes merged.

Ready for local review at http://localhost:5375/. No push/deploy or full-site launch performed.

## Approved homepage convergence onto main

The user approved the homepage experiment and explicitly requested local main integration and commit. Applied only the five-file delta `4514e4d` (parent `f538470`); did not merge snapshot `d4bd4bb` or stale shell-sync `f538470`. The earlier statement that the experiment was unmerged is superseded. Main now includes qualified single/double-arch membership pricing, the separate Vimeo `1043809908` Why Choose Us clip, YouTube `pN3CBJLzDLE` TV interview card, and all seven provider profiles in the homepage grid. Original hero JSX remains byte-identical to prior HEAD; video/effects/assets are untouched. Newer inner pages/navigation/favicon/back-to-top/widescreen work is retained. No push or deployment authorized or performed.

Combined validation passed: types, lint, 18 tests / 708 assertions, production build, and SSR checks covering 31 pages, 742 links/anchors, 33 assets and unknown-path 404s. Browser homepage checks at 320, 390, 1440, 2560 and 3840 pixels show no horizontal overflow, seven profiles and qualified prices. Introduction play/close and grouped navigation were verified after integration. The temporary production server on 5390 was stopped; the main preview on 5375 stays running.

Navigation alignment correction: dropdown buttons had 20px vertical padding versus 12px on plain links. Direct links and triggers now share centered inline-flex alignment, 12px padding, 1.5 line-height and a 44px minimum hit area; chevrons use 1em sizing. Browser measurements confirm equal centers and heights across all four navigation items at normal desktop and 2560px widths. The mobile menu and Escape behavior remain correct.

This combined stage is now committed locally on `main`; earlier uncommitted-stage notes above are historical. The working checkout is clean. Nothing has been pushed or deployed.

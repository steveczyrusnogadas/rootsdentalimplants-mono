# Approved homepage additions

Branch: `codex/homepage-content-experiment`. Worktree: `/Users/steve/.codex/worktrees/59e2/roots-dental-implants-publish`.

The user approved this experiment on 2026-09-08. The publication owner applied only the five-file delta from commit `4514e4d` (parent `f538470`) onto local `main`, preserving newer inner-page/navigation work. Snapshot `d4bd4bb` and shell-sync `f538470` were not merged. No push or deployment was performed.

## Compare locally

- Current integrated main: http://localhost:5375/ (publication checkout).
- Experiment: http://localhost:5376/ (this worktree).
- Start experiment when needed: `WEB_PORT=5376 bun run --cwd apps/web dev`.
- Screenshots: `.scratch/client-website/comparison/`. Use the viewport screenshots; full-page captures from the browser have stitching artifacts and are not delivery images.

## Changes

- Membership pricing under existing treatment content, with the exact as-low-as, membership and written-quote conditions. No single-tooth price inferred.
- Separate 40-second Why Choose Us Vimeo introduction after the conversation band, before the team. Loads only on click; Close video unmounts the player.
- Supporting Everyday Northwest TV interview link opens YouTube in a separate tab.
- All seven legacy providers in a consistent four-column desktop / three-column tablet / two-column mobile grid. Six DMD general dentists; Adam Kearns accurately identified as MS CRNA, nurse anesthetist. Profiles reuse existing content records and local assets.
- Synchronized the completed navigation shell and its inner-page CSS from the publication owner, plus the floating back-to-top component. Removed the footer duplicate as subsequently requested. A named route component fixes an inherited hooks lint warning.

Hero JSX, hero effects, hero video/poster assets and the existing global index.css remain unchanged from the starting snapshot. New CSS is isolated in homepage-experiment.css and targets only new classes.

## Verified sources (2026-09-08)

Official homepage: https://rootsdentalimplants.com/ . Fetched HTML retained in `/tmp/roots-legacy-home.html` during this task; independently corroborated by the publication task.

Pricing block heading: Implant Supported Dentures “Teeth in a Day”. Single Arch: “As low as $18,995 with implant membership plan”. Double arch: “As low as $35,995 with membership plan”. Both cards state “We will meet or beat any local competitor pricing with a written quote.” No further numerical membership fee, expiry or financing terms were present in this price block, so none were invented. Added consultation guidance asks for individual membership terms, inclusions, timeline and quote.

Why Choose Us: https://player.vimeo.com/video/1043809908 . Adjacent to that heading in legacy HTML (section 79d9381). Vimeo oEmbed title: Roots All on X Bob_1110Productions; duration 40 seconds. Poster was downloaded using the thumbnail_url returned by https://vimeo.com/api/oembed.json?url=https://vimeo.com/1043809908&width=960 and stored as public/images/why-roots-video.jpg. Metadata retained in `/tmp/roots-why-video.json`.

TV interview: https://www.youtube.com/watch?v=pN3CBJLzDLE . YouTube oEmbed title: Roots Dental Everyday Northwest Interview May 30th, 2025; channel Roots Dental Implant Center. This is distinct from Vimeo 1101752183 (five-minute About Us), YouTube z7WdOxs6twQ (Experience Matters), the Crystal story, and the hero.

Providers: official homepage plus existing verified provider biography records in apps/web/src/content/pages.ts. Images brinton.jpg, huish.jpg, gold.jpg, hale.webp, epperson.jpg, kaufman.jpg and kearns.jpg were already included in the supplied starting snapshot.

## Experiment validation before integration

- Web typecheck and ESLint pass.
- Existing web tests: 18 pass, 0 fail.
- Production Vite/Nitro build passes.
- Both comparison origins return HTTP 200. Baseline response has no membership price; experiment response includes it. Both include the same hero asset.
- All seven experiment profile routes and finance-insurance return 200.
- Browser checks at 390px mobile, 1440px desktop and 2560px widescreen: no horizontal overflow. All seven portraits loaded; two/four-column grids verified.
- No iframe before interaction. Clicking Why Choose Us creates the verified Vimeo iframe; Vimeo Pause/progress/volume/fullscreen controls appear and progress advances. Close video removes iframe. Hero remains unchanged and continues independently.
- Floating back-to-top inherited from the publication owner's separately tested implementation. Footer contains no duplicate back-to-top link.

The experiment worktree remains historical comparison context. Current delivery and validation are recorded in the publication checkout’s project handoff; future changes belong there.

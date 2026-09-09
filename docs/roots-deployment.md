# Roots web-only deployment

The public homepage and inner-page preview use TanStack Start and Nitro SSR with Bun. It does not call the inherited API or require admin, Postgres, Redis, MinIO, or a worker. The full docker-compose.prod.yml describes the inherited stack and is not needed for this homepage.

## Verify locally

```sh
bun install --frozen-lockfile
bun run --cwd apps/web check-types
bun run --cwd apps/web lint
bun run --cwd apps/web test
bun run --cwd apps/web build
HOST=127.0.0.1 PORT=5374 bun run --cwd apps/web start
```

No application secrets or environment variables are needed to render this homepage. Booking opens NexHealth; the patient video loads Vimeo after a click. Local assets include the approximately 21.7 MB hero video.

The public favicon is the original site's 32×32 PNG, stored locally at `apps/web/public/favicon.png` and linked by the root route. Source: https://rootsdentalimplants.com/wp-content/uploads/2024/12/cropped-cropped-roots-dental-favicon-1-32x32.png (verified against the original site's icon link on 2026-09-08).

## Dokploy Application settings

Use one Application with this GitHub repository and the approved branch/commit. Build type: Dockerfile. Context: `.`. Dockerfile: `Dockerfile`. Build target: `web`. Container port: `80`. No build arguments or volumes are required. The existing multi-stage web target builds the web workspace and copies its `.output` into a Bun image with HOST=0.0.0.0 and PORT=80.

```sh
docker build --target web -t roots-web:preview .
docker run --rm -p 127.0.0.1:5374:80 roots-web:preview
```

Do not enable automatic deployment or change domains until the Dokploy instance and intended preview domain are confirmed. Do not replace the existing live business domain implicitly. Configure the approved domain to container port 80 and enable HTTPS after DNS points to the verified VPS.

Smoke checks: homepage returns 200 with SSR text; unknown route returns 404; `/images/logo.png` and `/video/roots-clinic.mp4` load; navigation, treatment accordions, and booking destinations work.

## Launch decisions

`apps/web/public/robots.txt` disallows crawling and `apps/web/src/routes/__root.tsx` emits noindex,nofollow. Keep these preview protections until public launch is approved. Then update both policies together and add the verified canonical/social URL in `apps/web/src/lib/home-head.ts`. Rebuild and inspect rendered metadata. No canonical domain has been assumed. Confirm business copy, asset reuse permission, booking destinations, and privacy/legal requirements. Privacy/SMS policy drafts and form layouts are now present as previews; no lead collection is connected. See [page migration status](page-migration.md) for active routes, UI-only behavior and deferred blog integration.

Pushing source is separate from deploying. Record the instance, domain, deployed commit, and smoke-test result when deployment is performed.

## Verified release target — 2026-09-08

Existing Dokploy application: **Roots Dental Implants Preview**, ID `oDfSDDzsmyEawGAj-es5u`, app name `app-program-haptic-panel-qmft12`, dashboard https://d.suryzc.com. Repository `steveczyrusnogadas/rootsdentalimplants-mono`, branch `main`, Dockerfile `Dockerfile`, context `.`, build target `web`, HTTPS domain https://app-program-haptic-panel-qmft12-30a4aa-72-60-111-188.sslip.io/ routed to port80. These settings were read from Dokploy before release. Automatic deployment is already enabled; monitor the push-triggered deployment before requesting an additional build.

User explicitly authorized committing, pushing and deploying the accumulated site work to this existing preview on 2026-09-08. Keep the preview noindex/robots protections. Final map markers are numbers1–5; the rejected logo marker asset was removed. Original inner-page eyebrows/index labels are retained, while redundant Home breadcrumbs are removed. Testimonials includes nine distinct source-verified videos with local posters and click-to-load players. No backend/form activation or live-business-domain cutover is part of this release.


The final bilingual release expands smoke coverage to62English/Spanish pages. Check `/es/`, a translated inner page, current-page language switching, `/implantes-dentales/` redirect, numbered map,10patient stories, event-specific invitations/phones, qualified treatment prices and external financing applications. Preview noindex/robots restrictions stay enabled. User authorized this release after the initial49827b7 deployment, including local1440px/tree-placement corrections and audit follow-ups; stop feature work once deployed and verified.

## Homepage motion release — 2026-09-09

User authorized commit, push and deployment of the completed homepage motion work to the same existing Dokploy preview. Preserve preview crawl restrictions and the business domain.

The original foreground clinic hero film remains unchanged. Three decorative local films now support the pale cedar hero background, consultation woodland and dark locations directory. Their shared component starts playback on viewport entry, pauses offscreen and uses static first-frame posters for reduced motion or playback failure. The user requested no visible decorative playback buttons. Consultation copy aligns with the main content gutters; the old locations sprig is removed. One small noninteractive SVG bird briefly tilts its head during an 18-second cycle and stays still with reduced motion.

Final media: `roots-hero-cedar.mp4` (1780×800, about 353 KB), `roots-woodland.mp4` (1920×1080, about 1.1 MB), `roots-locations.mp4` (1920×1080, about 360 KB), each with its matching `roots-*-poster.jpg`. These user-supplied animations are silent H.264, 24 fps, approximately 5.17 seconds, with faststart. Source artwork and superseded static previews remain local and are not required by the release.

Release verification includes English/Spanish SSR, six new media URLs, original `/video/roots-clinic.mp4`, viewport playback and actual loop restarts, reduced-motion fallback, clinic booking destinations, single decorative bird, mobile layout and the centered 1440px composition on wide screens. To inspect the original clinic video specifically, target `.hero-photo video`; `.hero video` also matches the new decorative background.

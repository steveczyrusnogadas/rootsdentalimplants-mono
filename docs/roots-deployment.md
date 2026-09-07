# Roots web-only deployment

The homepage uses TanStack Start and Nitro SSR with Bun. It does not call the inherited API or require admin, Postgres, Redis, MinIO, or a worker. The full docker-compose.prod.yml describes the inherited stack and is not needed for this homepage.

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

## Dokploy Application settings

Use one Application with this GitHub repository and the approved branch/commit. Build type: Dockerfile. Context: `.`. Dockerfile: `Dockerfile`. Build target: `web`. Container port: `80`. No build arguments or volumes are required. The existing multi-stage web target builds the web workspace and copies its `.output` into a Bun image with HOST=0.0.0.0 and PORT=80.

```sh
docker build --target web -t roots-web:preview .
docker run --rm -p 127.0.0.1:5374:80 roots-web:preview
```

Do not enable automatic deployment or change domains until the Dokploy instance and intended preview domain are confirmed. Do not replace the existing live business domain implicitly. Configure the approved domain to container port 80 and enable HTTPS after DNS points to the verified VPS.

Smoke checks: homepage returns 200 with SSR text; unknown route returns 404; `/images/logo.png` and `/video/roots-clinic.mp4` load; navigation, treatment accordions, and booking destinations work.

## Launch decisions

`apps/web/public/robots.txt` disallows crawling and `apps/web/src/routes/__root.tsx` emits noindex,nofollow. Keep these preview protections until public launch is approved. Then update both policies together and add the verified canonical/social URL in `apps/web/src/lib/home-head.ts`. Rebuild and inspect rendered metadata. No canonical domain has been assumed. Confirm business copy, asset reuse permission, booking destinations, and privacy/legal requirements. No privacy/terms pages or lead collection form are implemented.

Pushing source is separate from deploying. Record the instance, domain, deployed commit, and smoke-test result when deployment is performed.

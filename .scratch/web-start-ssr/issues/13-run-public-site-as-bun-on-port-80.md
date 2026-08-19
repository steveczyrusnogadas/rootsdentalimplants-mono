# 13 — Run the public site as Bun on port 80

**What to build:** The `web` image is Nitro/Bun on port 80 with a `GET /` healthcheck and runtime `INTERNAL_API_URL=http://api:3000`. Dokploy still attaches the domain on 80. Admin stays a Vite/nginx SPA. Smoke matches the spec’s **Done when** bar.

**Blocked by:** 09 — SSR the home page with recent blog posts; 10 — SSR the blog list and stop prefetching it on slug routes; 11 — SSR a published blog post with Open Graph tags, and 404 missing ones; 12 — Request-time sitemap and static robots.txt

**Status:** resolved

- [x] The `web` image has no nginx; it runs Bun on Nitro’s standalone server (`HOST=0.0.0.0`, `PORT=80`) from `.output/`, not `dist`
- [x] Compose keeps `expose: ["80"]` and `VITE_API_URL` as a build arg; runtime env includes `INTERNAL_API_URL=http://api:3000`
- [x] Compose healthcheck probes `GET /` on port 80 (same shape as `api`, no Start `/health` route)
- [x] Dokploy notes describe `web` as the Start HTTP server on port 80, not nginx static; domain attachment stays port 80
- [x] `curl` of each public route (and a published `/blog/$slug`) returns HTML that already contains that route’s title, description, and (for blog) body/list content — not a loading shell
- [ ] `GET /sitemap.xml` and `GET /robots.txt` respond as specified; blog/contact API calls still use `VITE_API_URL`
- [x] `apps/admin` is unchanged as a Vite/nginx SPA

## Answer

The `web` image is now `oven/bun:1.3.11-alpine` running Nitro’s standalone server from `.output/` (`HOST=0.0.0.0`, `PORT=80`). Compose still exposes 80 and bakes `VITE_API_URL`; runtime env adds `INTERNAL_API_URL=http://api:3000` and a `GET /` healthcheck. Dokploy still attaches the public domain on 80. Admin stays nginx + `spa.conf`. Local Nitro smoke of every public route (and a published slug) returned first-HTML titles, descriptions, and blog body/list content; the client bundle still prefixes blog/contact with `VITE_API_URL`. `GET /sitemap.xml` and `GET /robots.txt` still 404 — that is [issue 12](12-request-time-sitemap-and-static-robots.md).

# Public site TanStack Start spec

## Destination

A spec an implementer can follow to convert `apps/web` in place into a TanStack Start app that SSR-renders every current public route so crawlers get real HTML, titles, descriptions, blog Open Graph tags, `sitemap.xml`, and `robots.txt`. `apps/admin` and `apps/app` stay Vite SPAs. This map does not run the migration.

## Notes

Domain: the public site (`apps/web`). Skills every session should consult: grilling, domain-modeling; research tickets use the research skill against TanStack first-party docs.

Standing preferences (locked in charting — do not re-open):

- TanStack Start is the framework. In-place conversion of the `web` workspace. Keep `src/routes`; add `src/router.tsx` `getRouter`; drop `index.html` and `src/main.tsx`. Align `@tanstack/react-router` to Start’s 1.170.x pin. Start’s Node floor is `>=22.12.0` (root engines are currently `>=18` — the spec must bump that for `web`).
- SSR every current public route (home, about, changelog, blog list/post, contact, thank-you).
- Hono stays the only data plane. No Start server functions, Start-owned APIs, or Drizzle access from `apps/web`. A Start server route that only emits a document (`sitemap.xml`) is allowed.
- Any data that must appear in the first HTML is prefetched in isomorphic route loaders via `queryClient.ensureQueryData`; components use `useSuspenseQuery` (not plain `useQuery`); wire `setupRouterSsrQueryIntegration`. SSR JSON uses a runtime internal origin (`INTERNAL_API_URL=http://api:3000`); `<img>` and `og:image` always use the public API origin, never Docker DNS.
- Production replaces the nginx static `web` image with a Start HTTP server. The spec must cover Dockerfile, `docker-compose.prod.yml`, and Dokploy notes. Nitro `preset: 'bun'`, `HOST=0.0.0.0`, `PORT=80` (keep today's Compose expose / Dokploy web port), healthcheck `GET /` — do not add a Start `/health` route.
- SEO bar: first-response HTML; per-route title and description (blog uses existing `seoTitle` / `seoDescription`); Open Graph on blog posts; request-time `sitemap.xml` from the public blog API so new posts appear without a rebuild; `robots.txt`. No JSON-LD. No GA.
- The last ticket writes `.scratch/web-start-ssr/spec.md`. Do not migrate application code on this map.

## Decisions so far

<!-- the index — one line per closed ticket: enough to judge relevance, then zoom the link for the detail the ticket holds -->

- [Current TanStack Start app shape](issues/01-current-start-app-shape.md) — keep `src/routes`; add `getRouter`; drop `index.html` / `main.tsx`; `tanstackStart()` then `viteReact()`; Vite 8 / React 19 OK
- [Start as a Docker HTTP server](issues/02-start-docker-http-server.md) — Nitro `preset: 'bun'`; run `apps/web/.output/server/index.mjs` with Bun; drop nginx/`dist`; healthcheck `GET /`
- [SSR loaders calling Hono](issues/03-ssr-loaders-calling-hono.md) — `ensureQueryData` + `useSuspenseQuery` + `setupRouterSsrQueryIntegration`; SSR JSON via `INTERNAL_API_URL`; media/OG on public origin
- [Start head tags and crawler files](issues/04-start-head-and-crawler-files.md) — route `head` + `HeadContent` for titles/descriptions/OG; request-time `sitemap.xml` via a document-only server route that HTTP-calls Hono; static `public/robots.txt`
- [Browser API origin](issues/05-browser-api-origin.md) — required `VITE_API_URL` (absolute, including local); throw if missing; delete `apps/web` Vite `/api` proxy; no Start splat-proxy; payload paths stay root-relative
- [Write the public-site Start spec](issues/06-write-the-public-site-start-spec.md) — [spec.md](spec.md) is the conversion recipe; fog left as conversion defaults (no CDN/HTML cache, Start default SSR + loader prefetch, light first HTML, no extra CI jobs)
- [Serve the public site as a Start HTML document](issues/07-serve-public-site-as-start-html-document.md) — Start on 5173; `/` is a full HTML document; static pages have spec titles/descriptions; Vite `/api` proxy kept; admin stays SPA
- [Split JSON origin from public media origin](issues/08-split-json-origin-from-public-media-origin.md) — required absolute `VITE_API_URL` for browser JSON/media/OG; SSR `apiJson` uses runtime `INTERNAL_API_URL` (localhost fallback); web Vite `/api` proxy gone
- [SSR the home page with recent blog posts](issues/09-ssr-home-page-with-recent-blog-posts.md) — `/` loader prefetches `blogKeys.recent(3)`; page uses `useSuspenseQuery`; head reads `loaderData`; first HTML has title, description, and recent posts
- [SSR the blog list and stop prefetching it on slug routes](issues/10-ssr-blog-list-and-stop-prefetch-on-slug.md) — `/blog` index loader prefetches `blogKeys.list(1, 9)`; page uses `useSuspenseQuery`; head reads `loaderData`; slug layout does not prefetch the list
- [SSR a published blog post with Open Graph tags, and 404 missing ones](issues/11-ssr-blog-post-og-and-404.md) — `/blog/$slug` loader prefetches `blogKeys.detail(slug)`; page uses `useSuspenseQuery`; head reads `loaderData` for title/description/OG; missing/unpublished slugs are HTTP 404
- [Run the public site as Bun on port 80](issues/13-run-public-site-as-bun-on-port-80.md) — Nitro/Bun `web` image on port 80 from `.output/`; Compose runtime `INTERNAL_API_URL=http://api:3000` and `GET /` healthcheck; Dokploy domain still 80; admin stays nginx

## Not yet specified

<!-- empty — destination is the spec; remaining fog was locked as conversion defaults or ruled out of scope -->

## Out of scope

- `apps/admin` and `apps/app` — SEO does not apply; they stay Vite SPAs.
- Start as a backend (server functions or API routes that own data, or web talking to Postgres).
- JSON-LD and Google Analytics — later marketing pass, not required to land Start.
- Executing the migration — this effort ends at the spec.
- Keeping nginx in front of Start — nginx is replaced.
- CDN or HTML cache in front of the Start server — the Start process serves SSR and static files.
- Custom streaming policy — Start default SSR plus loader prefetch.
- Inline blocking theme script — first HTML is light; `ThemeProvider` stays a client effect.
- CI image-build or e2e jobs beyond turbo `.output` and the Node 22.12 engines bump.

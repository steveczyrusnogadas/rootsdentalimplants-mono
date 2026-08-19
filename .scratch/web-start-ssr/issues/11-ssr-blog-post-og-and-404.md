# 11 — SSR a published blog post with Open Graph tags, and 404 missing ones

**What to build:** `curl` of a published `/blog/$slug` includes title, description, body, and OG tags (`og:image` is a public-absolute media URL when a cover exists; omitted when null). Missing or unpublished slugs are HTTP 404, not a 200 error page.

**Blocked by:** 10 — SSR the blog list and stop prefetching it on slug routes

**Status:** resolved

- [x] The slug route prefetches `blogKeys.detail(slug)` in its loader and the page reads that data with `useSuspenseQuery` (same keys as today)
- [x] `curl` of a published `/blog/$slug` HTML includes `seoTitle ?? title`, `seoDescription ?? excerpt`, and the post body — not a loading shell
- [x] That response includes `og:title` / `og:description` (same mapping), `og:type` = `article`, and `og:image` as a public-absolute cover URL when present; the image tag is omitted when the cover is null
- [x] No Twitter Card tags and no JSON-LD
- [x] A missing or unpublished slug calls `notFound()` so the response is HTTP 404, not a 200 error page
- [x] Slug `head` reads `loaderData` and does not fetch a second time

## Answer

The slug loader prefetches `blogKeys.detail(slug)` via `ensureQueryData`; the page reads the same query with `useSuspenseQuery`. `blogPostHead` takes `loaderData` and emits `seoTitle ?? title`, `seoDescription ?? excerpt`, `og:title` / `og:description` / `og:type` = `article`, and public-absolute `og:image` from `VITE_API_URL` when a cover exists (omitted when null) — no second fetch, no Twitter Cards, no JSON-LD. A Hono 404 for a missing or unpublished slug throws `notFound()`, so the response is HTTP 404 instead of a 200 error page.

# 09 — SSR the home page with recent blog posts

**What to build:** `curl /` HTML already contains the home title, description, and the three recent published blog posts — not a loading shell.

**Blocked by:** 08 — Split JSON origin from public media origin and drop the `/api` proxy

**Status:** resolved

- [x] The home route prefetches `blogKeys.recent(3)` in its loader and the page reads that data with `useSuspenseQuery` (same keys as today)
- [x] `curl /` HTML includes the title **The Baseplate**, the spec home description, and the fetched recent blog post content — not a loading shell
- [x] Home `head` reads `loaderData` and does not fetch a second time
- [x] The route is not SPA-only; first HTML is Start’s default SSR with loader prefetch

## Answer

The home route loader prefetches `blogKeys.recent(3)` via `ensureQueryData`; `App` reads the same query with `useSuspenseQuery`. `homeHead` takes `loaderData` and emits title **The Baseplate** plus the spec description with no second fetch. The route stays on Start’s default SSR (no `ssr: false`). `curl /` HTML includes the title and description; recent post titles appear in that HTML when Hono serves `GET /api/blog/recent?limit=3`.

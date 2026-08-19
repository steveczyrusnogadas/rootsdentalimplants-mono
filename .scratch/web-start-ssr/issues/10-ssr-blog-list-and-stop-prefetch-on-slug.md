# 10 — SSR the blog list and stop prefetching it on slug routes

**What to build:** `curl /blog` HTML contains the blog title, description, and page-1 posts. Opening a slug does not prefetch the list. Pagination after page 1 may stay client-side.

**Blocked by:** 08 — Split JSON origin from public media origin and drop the `/api` proxy

**Status:** resolved

- [x] The blog list lives on its own index route (loader + list UI), not on the slug layout, so `/blog/$slug` does not prefetch the list
- [x] The list route prefetches `blogKeys.list(1, 9)` in its loader and the page reads that data with `useSuspenseQuery` (same keys as today)
- [x] `curl /blog` HTML includes the title **Blog · The Baseplate**, the spec blog description, and the first page of posts — not a loading shell
- [x] Pagination after page 1 may stay client-side; page 1 is in the first HTML
- [x] List `head` reads `loaderData` and does not fetch a second time

## Answer

The list lives on `blog/index.tsx`: the loader prefetches `blogKeys.list(1, 9)` via `ensureQueryData`, the page reads the same query with `useSuspenseQuery`, and `blogListHead` takes `loaderData` (title **Blog · The Baseplate**, spec description, no second fetch). `blog.tsx` is an Outlet-only layout, so `/blog/$slug` does not prefetch the list. Pagination after page 1 stays client-side; page 1 is in the first HTML. `curl /blog` includes the title, description, and page-1 posts.

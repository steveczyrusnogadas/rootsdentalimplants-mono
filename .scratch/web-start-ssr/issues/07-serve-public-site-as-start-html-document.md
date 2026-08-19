# 07 — Serve the public site as a TanStack Start HTML document

**What to build:** A request to a public route returns a full HTML document (site chrome, head content, scripts), not a Vite SPA shell. About, changelog, contact, and thank-you already carry their spec titles and descriptions. Start listens on 5173. The Vite `/api` proxy may stay for this ticket so browser data still works.

**Blocked by:** None — can start immediately

**Status:** resolved

- [x] `bun install` succeeds; `web` scripts are `dev` / `build` / `start` as in the spec; root `engines.node` is `>=22.12.0`; turbo `build` outputs include `.output/**`
- [x] `bun run --filter=web dev` starts TanStack Start on port 5173
- [x] A request to `/` returns a full HTML document (`<html lang="en">` with no `dark` class on first paint, charset, viewport, favicon, fallback title **The Baseplate**, head content, and scripts)
- [x] There is no Vite `index.html` entry; the root route is the HTML document
- [x] View-source of `/about`, `/changelog`, `/contact`, and `/contact/thank-you` shows the spec titles and descriptions
- [x] `apps/admin` remains a Vite SPA

## Answer

`apps/web` now serves TanStack Start HTML on port 5173. `getRouter` plus the root `shellComponent` replaced `index.html` / `main.tsx`. `/` is a full document (`<html lang="en">`, charset, viewport, `/favicon.svg`, title **The Baseplate**, chrome, scripts). About, changelog, contact, and thank-you emit the spec titles and descriptions. The Vite `/api` proxy is still in place; `apps/admin` is still a Vite SPA.

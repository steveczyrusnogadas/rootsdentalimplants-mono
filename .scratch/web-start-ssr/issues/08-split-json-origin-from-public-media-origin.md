# 08 — Split JSON origin from public media origin and drop the `/api` proxy

**What to build:** Browser JSON, contact POST (a Lead), `<img>`, and `og:image` use a required absolute `VITE_API_URL` and throw if it is missing. SSR JSON is ready to use `INTERNAL_API_URL` (localhost fallback). A forgotten relative `/api/…` 404s in `vite dev`. Contact still submits cross-origin to Hono.

**Blocked by:** 07 — Serve the public site as a TanStack Start HTML document

**Status:** resolved

- [x] `VITE_API_URL` is required and absolute (including local `http://localhost:3000`); the public-origin helper throws if it is missing; `vite build` still succeeds when it is unset
- [x] Browser JSON, contact POST, `<img>`, and `og:image` always use `VITE_API_URL` — never `INTERNAL_API_URL`
- [x] Loader / `apiJson` queryFns on the server use `INTERNAL_API_URL` (Docker: `http://api:3000`; local SSR fallback: `http://localhost:3000`), chosen when the queryFn runs, not from dehydrated Docker DNS
- [x] Payload paths stay root-relative from Hono; the origin is prefixed at fetch/render time
- [x] The Vite `/api` proxy on `web` is gone; a forgotten relative `/api/…` 404s in `vite dev`
- [x] Contact POST still creates a Lead against Hono from `http://localhost:5173` (cross-origin; CORS / `APP_ORIGINS` unchanged)

## Answer

`resolveApiUrl` now requires an absolute `VITE_API_URL` and throws if it is missing (media/`og:image` never see `INTERNAL_API_URL`). `apiJson` picks origin at call time via `createIsomorphicFn`: server `INTERNAL_API_URL` with `http://localhost:3000` fallback, browser `VITE_API_URL`. Hono paths stay root-relative. The Vite `/api` proxy is gone from `apps/web`; CORS / `APP_ORIGINS` (including `http://localhost:5173`) is unchanged so contact still POSTs a Lead cross-origin. `vite build` still succeeds when `VITE_API_URL` is unset.

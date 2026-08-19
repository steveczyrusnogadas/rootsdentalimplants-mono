# 19 — Locations page

**What to build:** `/locations/` is the public directory of published Locations: address, phone, grouped hours, and a map. There are no per-city Location pages and no NexHealth book buttons.

**Blocked by:** 13 — Published Locations drive Call and footer; 15 — Kai-clean chrome, privacy, and terms

**Status:** ready-for-agent

- [ ] `/locations/` shows a card per published Location (display name, structured address, phone, hours grouped from `weeklyHours`) and a map of `lat`/`lng`. Sort order matches Location `sortOrder`.
- [ ] Unpublished Locations are omitted. Unpublishing a Location removes it from this page without a leftover city URL.
- [ ] No NexHealth, no sister-site “About” links, no per-Location public pages. Portland is 4224 NE Halsey #330, not Hollywood/Powell.
- [ ] Corpus `<title>` and meta description for `/locations/` are the starting tags.

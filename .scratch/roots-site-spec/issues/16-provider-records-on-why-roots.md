# 16 — Provider records on Why Roots and Provider pages

**What to build:** Staff edit the seven Providers in admin. `/why-choose-us/` and the header nav list only published Providers. Each live slug is a first-party page. An unpublished Provider disappears from nav and Why Roots, and the old URL 404s.

**Blocked by:** 15 — Kai-clean chrome, privacy, and terms

**Status:** ready-for-agent

- [ ] The seven Providers are seeded (slugs as live, bios and headshots from the corpus). Headshots are Media assets. Brinton intro is Vimeo `1041278519`. Huish intro is Vimeo `1041321604`. Others have no intro embed.
- [ ] Staff (Admin and Manager) can create, edit, and unpublish Providers. Slug stays the live path. `adam-kearns` has no `dr-` slug, empty honorific prefix, and `MS CRNA`. Kaufman’s Gresham sentence lives in his bio.
- [ ] `/why-choose-us/` shows published Providers (display name, honorific, credentials, headshot, bio). Brinton’s Dental Implant Hero badge stays in code, not in admin. Corpus title and meta description are the starting tags.
- [ ] Each published slug (`/dr-clark-brinton/` through `/dr-jacob-kaufman/`, `/adam-kearns/`) is a Provider page. Unpublished Provider URLs 404 with no index and no redirect.
- [ ] Why Roots and Our team nav children list published Providers only. There is no Provider↔Location join. Consultation requests still do not pick a Provider.

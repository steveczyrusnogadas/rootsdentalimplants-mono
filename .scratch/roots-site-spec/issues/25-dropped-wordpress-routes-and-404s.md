# 25 — Dropped WordPress routes and leftover 404s

**What to build:** Dropped WordPress URLs 301 to the spec targets. City Location URLs 404 with no index. The current public blog and other non-keep marketing routes are gone. Popups and public NexHealth never appear.

**Blocked by:** 17 — Homepage Rooted motion; 21 — Financing; 23 — Eligibility quiz Lead

**Status:** ready-for-agent

- [ ] 301: `/blog/`, `/post-surgery-care-what-to-expect/`, `/how-to-prepare-for-a-dental-implant-procedure/`, `/benefits-of-dental-implants-over-traditional-dentures/`, `/category/blog/`, `/author/rootsdentalimplants-admin/`, `/smile-preview/`, and `/implantes-dentales/` to `/`. `/finance-insurance/` and `/portland/` are already owned by 21 and 23.
- [ ] 404, no index, no redirect: `/locations/{city}/` for each city slug, and city-root `/gresham/`, `/salem/`, `/troutdale/`, `/vancouver/`. Unpublished Provider 404s stay owned by 16.
- [ ] Public blog list and slug routes, `/about`, `/changelog`, and any other non-keep Start marketing route are gone from the public site. Admin Blog post remains. There is no public blog.
- [ ] Elementor popups 1043 and 882, public NexHealth buttons, HighLevel on dinner and quiz, and the homepage click-arbitrage notice are not present.

# Location and Provider public data

Type: grilling
Status: resolved
Blocked by: 01, 03

## Question

What fields does the public site need for each Location and each Provider, and which of those staff edit in admin?

Page copy stays in code. Hours, address, phone, and clinician bios/photos are operations data. This ticket lists the fields and the public routes they appear on. Census fact: there are **no public per-Location pages** — `/locations/{city}/` 301s to `/locations/`; five clinics live on that archive plus homepage cards; seven Provider pages exist (`/dr-…/`, `/adam-kearns/`).

## Answer

Staff (Admin and Manager) edit Location and Provider in admin. Marketing copy stays in code. JetEngine `/locations/{city}/` permalinks are not rebuilt. Dinner routes stay in code, keyed by Location.slug. Quiz widget IDs are gone: the eligibility quiz is owned.

**Location** (create/hide allowed; a sixth Location does not invent a dinner route)

| Field | Notes |
|---|---|
| slug | Set at create, then immutable. `portland`, `gresham`, … Matches quiz `?location=` and dinner URLs in code |
| displayName | `Portland`, `Gresham` |
| street, suite, city, region, postalCode | Structured. Portland is 4224 NE Halsey #330, not the Hollywood/Powell JSON-LD addresses |
| phone | Number on the card, not CallRail |
| weeklyHours | Mon–Sun: `closed` plus `open`/`close` as local wall-clock. Public line grouped from this. No holiday calendar. Morning/Afternoon chips stay as locked on the Lead |
| lat, lng | Custom map on `/locations/` (and homepage if that map stays). Not JetEngine |
| sortOrder | Cards and pickers |
| published | Unpublished omitted from every public use |
| isDefaultCall | Exactly one Location. Footer `tel:` |

No NexHealth id, no sister-site URL, no per-Location email, no timezone, no building photo.

Public uses: `/locations/` cards and map, homepage cards, Book Location picker, eligibility-quiz step 1, `/implant-dinner-{city}/` keyed by slug, header Call picker (name + phone), footer default Call.

**404, no index, no redirect:** `/locations/{city}/`, `/gresham/`, `/salem/`, `/troutdale/`, `/vancouver/`. `/portland/` stays the locked 301 to `/implant-eligibility-quiz/`.

**Provider**

| Field | Notes |
|---|---|
| slug | Keep live paths: `dr-clark-brinton`, `adam-kearns`, … |
| displayName | `Clark Brinton`, `Adam Kearns` |
| honorificPrefix | `Dr.` or empty (CRNA) |
| credentials | `DMD`, `MS CRNA` |
| headshot | Media asset |
| bio | Plain text, paragraphs. Not a page builder |
| sortOrder | Nav and `/why-choose-us/` |
| published | Unpublished omitted from nav and `/why-choose-us/`; old URL 404s |
| introEmbedUrl | Optional Vimeo/YouTube. Brinton and Huish have one; others null |

No Provider↔Location join. Kaufman’s Gresham sentence lives in his bio. Dental Implant Hero stays code on Brinton’s page. Consultation requests do not pick a Provider.

Public uses: header About Us children, `/why-choose-us/`, `/dr-…/` and `/adam-kearns/`.

## Comments

- Five Locations (Gresham, Troutdale, Salem, Portland, Vancouver) with address, phone, NexHealth `lid`, Leaflet lat/lng, and sister-site `rootsdental.com` “About” links: [research/wordpress-route-and-embed-census.md](../research/wordpress-route-and-embed-census.md).

- [Consultation-request Lead shape](05-consultation-request-lead-shape.md): preferred-window day chips are the **open days of the chosen Location**. Hours must be operations data staff edit; the public request form depends on them.

- Round 1 (2026-08-19): no public per-Location pages (WP map-plugin permalinks, not rebuilt). `/locations/` stays. Location fields as recommended (structured address/phone/weeklyHours/lat-lng/slug/displayName/sortOrder/published; no NexHealth, no sister-site About, no per-Location email). Hours structured Mon–Sun, display grouped from that, no holiday calendar. Header Call is a Location picker; footer uses `isDefaultCall`. Provider fields as recommended (slug/displayName/honorificPrefix/credentials/headshot/bio/sortOrder/published/optional introEmbedUrl). No Provider↔Location join.

- Round 2: `/locations/{city}/` and city-root `/gresham/` `/salem/` `/troutdale/` `/vancouver/` are 404, no index, no redirect. Location.slug immutable after create. HighLevel quiz IDs stay in code keyed by slug.

- Shared understanding confirmed 2026-08-19. Unpublished Provider URLs 404. Grilled and closed.

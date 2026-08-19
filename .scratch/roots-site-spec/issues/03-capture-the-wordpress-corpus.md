# Capture the WordPress corpus

Type: task
Status: resolved

## Question

Capture a one-shot, re-runnable dump of the live WordPress site — HTML pages, images, and a URL list — into `.scratch/roots-site-spec/corpus/` so later tickets can see the assets and copy without hitting production.

Not a product. Not an admin tool. Do not download every patient video; save posters and record the embed URL. A script that can be re-run until cutover is enough; delete the lot after launch.

## Answer

Dump is at [corpus/](../corpus/) (re-run `python3 capture.py` until cutover; `--force` re-downloads). Layout: [corpus/README.md](../corpus/README.md). Counts in [corpus/manifest.json](../corpus/manifest.json).

- 48 HTML pages (32 sitemap pages + 3 posts + category/author + five quiz `?location=` variants + five `/locations/{city}/` permalinks)
- 78 image originals saved under `corpus/media/` (80 assets found; 2 live 404s: `Roots-Dental-Logo.png`, `roots-dental-implants-hero.jpg`)
- 40 video posters (18 YouTube, 22 Vimeo) under `corpus/posters/`; videos not downloaded
- One WP background mp4 recorded and skipped: `/wp-content/uploads/2025/02/Untitled-video.mp4`
- REST: pages, posts, map-view, types saved; `/wp/v2/media` is **403** unauthenticated — images came from sitemaps + HTML
- 10 redirects in [corpus/redirects.json](../corpus/redirects.json): `/locations/{city}/` → `/locations/`; `/portland/` → quiz; other city-root paths → `/locations/{city}/` (then the archive)
- URL list: [corpus/urls.txt](../corpus/urls.txt) (1513 URLs)

## Comments

- Claimed and captured 2026-08-18. Script is `corpus/capture.py`.

- URL tree, embed hosts, and “save posters not videos” list: [research/wordpress-route-and-embed-census.md](../research/wordpress-route-and-embed-census.md). Five Location permalinks 301 to `/locations/` — dump the archive, not city URLs.

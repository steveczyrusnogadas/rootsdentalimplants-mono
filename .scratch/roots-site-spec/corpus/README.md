# WordPress corpus

One-shot dump of [rootsdentalimplants.com](https://rootsdentalimplants.com/) so later tickets can read copy and assets without hitting production. Not a product. Delete after launch.

Re-run until cutover:

```bash
python3 capture.py
python3 capture.py --force   # re-download files that already exist
```

| Path | What |
| --- | --- |
| `pages/` | HTML keyed by URL path (48 files, including quiz `?location=` variants) |
| `media/` | First-party images under `wp-content/uploads/` (originals preferred; leftover srcset sizes may remain from the first pass) |
| `posters/` | YouTube and Vimeo posters. Patient/site videos are not downloaded |
| `rest/` | Public WP REST JSON (`pages`, `posts`, `map-view`, `types`). `media` is 403 unauthenticated |
| `meta/` | Sitemaps and `robots.txt` |
| `urls.txt` | Every discovered URL |
| `embeds.json` | YouTube / Vimeo ids + poster paths; skipped WP mp4s |
| `redirects.json` | Probed 301s (`/locations/{city}/`, city-root paths) |
| `manifest.json` | Counts, missing images, skipped videos |

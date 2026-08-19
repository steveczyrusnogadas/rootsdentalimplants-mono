#!/usr/bin/env python3
"""One-shot dump of https://rootsdentalimplants.com/ for the replacement spec.

Captures HTML pages, first-party images, video posters (not the videos), REST
JSON that is publicly readable, and a URL list. Re-run until cutover:

    python3 capture.py
    python3 capture.py --force   # re-download files that already exist

Delete this directory after launch. Not a product.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import threading
import time
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse, urlunparse

import requests

ORIGIN = "https://rootsdentalimplants.com"
UA = (
    "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0 "
    "RootsSiteSpecCorpus/1.0"
)
TIMEOUT = 60
SLEEP = 0.15
RETRIES = 4
IMAGE_WORKERS = 6

VIDEO_EXT = {".mp4", ".webm", ".mov", ".m4v", ".avi"}
IMAGE_EXT = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".avif", ".ico"}

YOUTUBE_RE = re.compile(
    r"(?:youtube\.com/embed/|youtube\.com/watch\?v=|youtu\.be/|"
    r"youtube\.com/shorts/|i\.ytimg\.com/vi(?:_webp)?/)([A-Za-z0-9_-]{11})"
)
VIMEO_RE = re.compile(r"(?:player\.vimeo\.com/video/|vimeo\.com/)(\d+)")
UPLOADS_RE = re.compile(
    r"https?://(?:www\.)?rootsdentalimplants\.com(/wp-content/uploads/[^\s\"'<>)\\&]+)",
    re.I,
)
SIZE_SUFFIX_RE = re.compile(r"-\d+x\d+(?=\.[A-Za-z0-9]+$)")
NS = {
    "sm": "http://www.sitemaps.org/schemas/sitemap/0.9",
    "image": "http://www.google.com/schemas/sitemap-image/1.1",
}

# Sitemap misses query variants and REST-only Location permalinks.
EXTRA_PAGE_URLS = [
    f"{ORIGIN}/implant-eligibility-quiz/?location=portland",
    f"{ORIGIN}/implant-eligibility-quiz/?location=gresham",
    f"{ORIGIN}/implant-eligibility-quiz/?location=troutdale",
    f"{ORIGIN}/implant-eligibility-quiz/?location=vancouver",
    f"{ORIGIN}/implant-eligibility-quiz/?location=salem",
    f"{ORIGIN}/locations/gresham/",
    f"{ORIGIN}/locations/troutdale/",
    f"{ORIGIN}/locations/salem/",
    f"{ORIGIN}/locations/portland/",
    f"{ORIGIN}/locations/vancouver/",
]

# City-root paths that are not Location pages on this host (census).
REDIRECT_PROBES = EXTRA_PAGE_URLS + [
    f"{ORIGIN}/portland/",
    f"{ORIGIN}/salem/",
    f"{ORIGIN}/gresham/",
    f"{ORIGIN}/troutdale/",
    f"{ORIGIN}/vancouver/",
]

REST_ENDPOINTS = [
    "/wp-json/wp/v2/types",
    "/wp-json/wp/v2/pages?per_page=100",
    "/wp-json/wp/v2/posts?per_page=100",
    "/wp-json/wp/v2/map-view?per_page=100",
    "/wp-json/wp/v2/media?per_page=100",
]


class SrcCollector(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.urls: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        ad = {k: v for k, v in attrs if v}
        for key in (
            "src",
            "href",
            "poster",
            "data-src",
            "data-lazy-src",
            "data-bg",
            "data-background",
            "data-large_image",
            "data-full-url",
            "content",
        ):
            if key in ad:
                self.urls.append(ad[key])
        if "srcset" in ad:
            self.urls.extend(_split_srcset(ad["srcset"]))
        if "data-srcset" in ad:
            self.urls.extend(_split_srcset(ad["data-srcset"]))


def _split_srcset(value: str) -> list[str]:
    out = []
    for part in value.split(","):
        url = part.strip().split()[0] if part.strip() else ""
        if url:
            out.append(url)
    return out


def root() -> Path:
    return Path(__file__).resolve().parent


def session() -> requests.Session:
    s = requests.Session()
    s.headers.update({"User-Agent": UA, "Accept": "*/*"})
    return s


_thread_local = threading.local()


def thread_session() -> requests.Session:
    s = getattr(_thread_local, "session", None)
    if s is None:
        s = session()
        _thread_local.session = s
    return s


def fetch(
    s: requests.Session,
    url: str,
    *,
    force: bool,
    dest: Path | None = None,
    allow_skip: bool = True,
) -> tuple[int, bytes, dict[str, str], str]:
    """GET with retries. Returns status, body, headers, final_url.

    If dest exists and allow_skip, reads the file instead of hitting the network
    (status 200, empty header map, original url) unless force.
    """
    if dest is not None and dest.exists() and not force and allow_skip:
        return 200, dest.read_bytes(), {}, url

    last_err: Exception | None = None
    for attempt in range(1, RETRIES + 1):
        try:
            r = s.get(url, timeout=TIMEOUT, allow_redirects=True)
            time.sleep(SLEEP)
            headers = {k.lower(): v for k, v in r.headers.items()}
            return r.status_code, r.content, headers, r.url
        except (requests.RequestException, TimeoutError) as exc:
            last_err = exc
            time.sleep(min(2**attempt, 16))
    raise RuntimeError(f"failed {url}: {last_err}")


def head_no_follow(s: requests.Session, url: str) -> tuple[int, str | None]:
    last_err: Exception | None = None
    for attempt in range(1, RETRIES + 1):
        try:
            r = s.head(url, timeout=TIMEOUT, allow_redirects=False)
            time.sleep(SLEEP)
            return r.status_code, r.headers.get("Location") or r.headers.get("location")
        except (requests.RequestException, TimeoutError) as exc:
            last_err = exc
            time.sleep(min(2**attempt, 16))
    raise RuntimeError(f"HEAD failed {url}: {last_err}")


def origin_path(url: str) -> str:
    p = urlparse(url)
    path = p.path or "/"
    if p.query:
        return f"{path}?{p.query}"
    return path


def page_dest(base: Path, url: str) -> Path:
    p = urlparse(url)
    path = p.path or "/"
    if path.endswith("/"):
        path = path + "index.html"
    elif not Path(path).suffix:
        path = path + "/index.html"
    if p.query:
        # Keep quiz ?location= as a sibling file, not a query in the path.
        qs = p.query.replace("=", "-").replace("&", "_")
        path = str(Path(path).with_name(Path(path).stem + f"__{qs}" + Path(path).suffix))
    return base / path.lstrip("/")


def media_dest(base: Path, url: str) -> Path:
    p = urlparse(url)
    return base / p.path.lstrip("/")


def canonicalize(url: str, page_url: str) -> str:
    abs_url = urljoin(page_url, url.strip())
    p = urlparse(abs_url)
    if p.scheme not in ("http", "https"):
        return ""
    # Drop fragments; keep query (quiz, scaled images sometimes use ?).
    return urlunparse((p.scheme, p.netloc, p.path, p.params, p.query, ""))


def is_first_party(url: str) -> bool:
    host = urlparse(url).hostname or ""
    return host.endswith("rootsdentalimplants.com")


def ext_of(url: str) -> str:
    path = urlparse(url).path.lower()
    if "." not in Path(path).name:
        return ""
    return "." + Path(path).name.rsplit(".", 1)[-1]


def pixel_area(url: str) -> int:
    m = re.search(r"-(\d+)x(\d+)\.[A-Za-z0-9]+$", urlparse(url).path)
    if not m:
        return 10**12
    return int(m.group(1)) * int(m.group(2))


def original_url(url: str) -> str:
    p = urlparse(url)
    return urlunparse(
        (p.scheme, p.netloc, SIZE_SUFFIX_RE.sub("", p.path), p.params, "", "")
    )


def image_fallback_chains(urls: set[str]) -> list[list[str]]:
    """One chain per asset: original first, then largest srcset leftover."""
    groups: dict[str, set[str]] = defaultdict(set)
    for u in urls:
        groups[urlparse(original_url(u)).path].add(u)
    chains: list[list[str]] = []
    for variants in groups.values():
        sample = next(iter(variants))
        orig = original_url(sample)
        sized = sorted(
            (v for v in variants if v != orig),
            key=pixel_area,
            reverse=True,
        )
        chain: list[str] = []
        for candidate in [orig, *sized]:
            if candidate not in chain:
                chain.append(candidate)
        chains.append(chain)
    return chains


def parse_sitemap_locs(xml: bytes) -> tuple[list[str], list[str]]:
    import xml.etree.ElementTree as ET

    root_el = ET.fromstring(xml)
    pages: list[str] = []
    images: list[str] = []
    tag = root_el.tag
    if tag.endswith("sitemapindex"):
        for loc in root_el.findall("sm:sitemap/sm:loc", NS):
            if loc.text:
                pages.append(loc.text.strip())
        return pages, images
    for url_el in root_el.findall("sm:url", NS):
        loc = url_el.find("sm:loc", NS)
        if loc is not None and loc.text:
            pages.append(loc.text.strip())
        for img in url_el.findall("image:image/image:loc", NS):
            if img.text:
                images.append(img.text.strip())
        # Some generators omit the image prefix.
        for img in url_el.findall("{http://www.google.com/schemas/sitemap-image/1.1}image"):
            loc_el = img.find("{http://www.google.com/schemas/sitemap-image/1.1}loc")
            if loc_el is not None and loc_el.text:
                images.append(loc_el.text.strip())
    return pages, images


def extract_from_html(html: bytes, page_url: str) -> tuple[set[str], set[str], set[str]]:
    text = html.decode("utf-8", errors="replace").replace("\\/", "/")
    assets: set[str] = set()
    youtube: set[str] = set()
    vimeo: set[str] = set()

    parser = SrcCollector()
    try:
        parser.feed(text)
    except Exception:
        pass
    for raw in parser.urls:
        u = canonicalize(raw, page_url)
        if u:
            assets.add(u)

    for m in UPLOADS_RE.finditer(text):
        assets.add(canonicalize(ORIGIN + m.group(1), page_url))
    for m in re.finditer(r"(?<![A-Za-z0-9])(/wp-content/uploads/[^\s\"'<>)\\&]+)", text):
        assets.add(canonicalize(m.group(1), page_url))
    for m in YOUTUBE_RE.finditer(text):
        youtube.add(m.group(1))
    for m in VIMEO_RE.finditer(text):
        vimeo.add(m.group(1))
    return assets, youtube, vimeo


def write_bytes(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)


def rest_filename(path_and_query: str) -> str:
    slug = path_and_query.lstrip("/").replace("wp-json/", "").replace("/", "-")
    slug = slug.replace("?", "_").replace("&", "_").replace("=", "-")
    if not slug.endswith(".json"):
        slug += ".json"
    return slug


def download_image_chain(
    chain: list[str], media_dir: Path, force: bool
) -> dict:
    """Try original, then larger srcset leftovers. Skip if any dest already exists."""
    sess = thread_session()
    if not force:
        for url in chain:
            dest = media_dest(media_dir, url)
            if dest.exists() and dest.stat().st_size > 0:
                return {"ok": True, "url": url, "skipped": True, "path": str(dest)}
    last_err = "empty chain"
    for url in chain:
        dest = media_dest(media_dir, url)
        print(f"img  {origin_path(url)}", flush=True)
        try:
            status, body, headers, _ = fetch(
                sess, url, force=True, dest=dest, allow_skip=False
            )
            ctype = headers.get("content-type", "")
            if status == 200 and ctype.startswith("image/"):
                write_bytes(dest, body)
                return {"ok": True, "url": url, "skipped": False, "path": str(dest)}
            last_err = f"HTTP {status} {ctype}"
        except Exception as exc:
            last_err = str(exc)
    return {"ok": False, "url": chain[0] if chain else "", "error": last_err}


def download_youtube_poster(vid: str, posters_dir: Path, force: bool) -> dict:
    sess = thread_session()
    embed_url = f"https://www.youtube.com/embed/{vid}"
    dest = posters_dir / "youtube" / f"{vid}.jpg"
    print(f"yt   {vid}", flush=True)
    poster_url = f"https://i.ytimg.com/vi/{vid}/maxresdefault.jpg"
    try:
        status, body, headers, _ = fetch(sess, poster_url, force=force, dest=dest)
        if status != 200 or len(body) < 2000:
            poster_url = f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg"
            status, body, headers, _ = fetch(
                sess, poster_url, force=True, dest=dest, allow_skip=False
            )
        if status == 200:
            write_bytes(dest, body)
            return {
                "kind": "youtube",
                "id": vid,
                "embed_url": embed_url,
                "poster_url": poster_url,
                "poster": str(dest),
                "ok": True,
            }
        return {
            "kind": "youtube",
            "id": vid,
            "embed_url": embed_url,
            "poster": None,
            "ok": False,
            "error": f"HTTP {status}",
        }
    except Exception as exc:
        return {
            "kind": "youtube",
            "id": vid,
            "embed_url": embed_url,
            "ok": False,
            "error": str(exc),
        }


def download_vimeo_poster(vid: str, posters_dir: Path, force: bool) -> dict:
    sess = thread_session()
    embed_url = f"https://player.vimeo.com/video/{vid}"
    oembed = f"https://vimeo.com/api/oembed.json?url=https://vimeo.com/{vid}"
    dest = posters_dir / "vimeo" / f"{vid}.jpg"
    print(f"vim  {vid}", flush=True)
    try:
        status, body, headers, _ = fetch(
            sess, oembed, force=True, dest=None, allow_skip=False
        )
        if status != 200:
            return {
                "kind": "vimeo",
                "id": vid,
                "embed_url": embed_url,
                "ok": False,
                "error": f"oembed HTTP {status}",
            }
        data = json.loads(body.decode("utf-8"))
        poster_url = data.get("thumbnail_url")
        if not poster_url:
            return {
                "kind": "vimeo",
                "id": vid,
                "embed_url": embed_url,
                "ok": False,
                "error": "no vimeo thumbnail",
            }
        status, body, headers, _ = fetch(sess, poster_url, force=force, dest=dest)
        if status != 200:
            return {
                "kind": "vimeo",
                "id": vid,
                "embed_url": embed_url,
                "poster_url": poster_url,
                "poster": None,
                "ok": False,
                "error": f"HTTP {status}",
            }
        write_bytes(dest, body)
        return {
            "kind": "vimeo",
            "id": vid,
            "embed_url": embed_url,
            "poster_url": poster_url,
            "poster": str(dest),
            "ok": True,
        }
    except Exception as exc:
        return {
            "kind": "vimeo",
            "id": vid,
            "embed_url": embed_url,
            "ok": False,
            "error": str(exc),
        }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()
    force: bool = args.force
    sys.stdout.reconfigure(line_buffering=True)
    sys.stderr.reconfigure(line_buffering=True)

    base = root()
    pages_dir = base / "pages"
    media_dir = base / "media"
    posters_dir = base / "posters"
    rest_dir = base / "rest"
    meta_dir = base / "meta"
    for d in (pages_dir, media_dir, posters_dir, rest_dir, meta_dir):
        d.mkdir(parents=True, exist_ok=True)

    s = session()
    started = datetime.now(timezone.utc).isoformat()
    urls: set[str] = set()
    errors: list[dict] = []
    skipped_videos: list[str] = []
    redirects: dict[str, str] = {}
    embeds: list[dict] = []
    youtube_ids: set[str] = set()
    vimeo_ids: set[str] = set()
    image_urls: set[str] = set()
    page_urls: list[str] = []
    saved_pages = 0
    saved_images = 0
    saved_posters = 0

    def note_error(url: str, msg: str) -> None:
        errors.append({"url": url, "error": msg})
        print(f"ERR {url}: {msg}", file=sys.stderr)

    # --- sitemaps ---
    index_url = f"{ORIGIN}/sitemap_index.xml"
    urls.add(index_url)
    try:
        status, body, _, final = fetch(s, index_url, force=force, dest=meta_dir / "sitemap_index.xml")
        write_bytes(meta_dir / "sitemap_index.xml", body)
        child_sitemaps, _ = parse_sitemap_locs(body)
    except Exception as exc:
        note_error(index_url, str(exc))
        child_sitemaps = [
            f"{ORIGIN}/page-sitemap.xml",
            f"{ORIGIN}/post-sitemap.xml",
            f"{ORIGIN}/map-view-sitemap.xml",
            f"{ORIGIN}/category-sitemap.xml",
            f"{ORIGIN}/author-sitemap.xml",
        ]

    sitemap_images: list[str] = []
    for sm_url in child_sitemaps:
        urls.add(sm_url)
        name = urlparse(sm_url).path.rsplit("/", 1)[-1]
        try:
            status, body, _, _ = fetch(s, sm_url, force=force, dest=meta_dir / name)
            if status != 200:
                note_error(sm_url, f"HTTP {status}")
                continue
            write_bytes(meta_dir / name, body)
            locs, imgs = parse_sitemap_locs(body)
            page_urls.extend(locs)
            sitemap_images.extend(imgs)
        except Exception as exc:
            note_error(sm_url, str(exc))

    for extra in EXTRA_PAGE_URLS:
        if extra not in page_urls:
            page_urls.append(extra)

    # robots
    robots_url = f"{ORIGIN}/robots.txt"
    urls.add(robots_url)
    try:
        status, body, _, _ = fetch(s, robots_url, force=force, dest=meta_dir / "robots.txt")
        write_bytes(meta_dir / "robots.txt", body)
    except Exception as exc:
        note_error(robots_url, str(exc))

    # --- REST ---
    for path in REST_ENDPOINTS:
        url = ORIGIN + path
        urls.add(url)
        dest = rest_dir / rest_filename(path)
        try:
            status, body, headers, final = fetch(s, url, force=force, dest=None, allow_skip=False)
            rec = {
                "requested": url,
                "final": final,
                "status": status,
                "content_type": headers.get("content-type", ""),
            }
            if status == 200 and "json" in rec["content_type"]:
                dest.write_bytes(body)
                rec["saved"] = str(dest.relative_to(base))
                # Pull upload URLs out of REST JSON too.
                text = body.decode("utf-8", errors="replace")
                for m in UPLOADS_RE.finditer(text):
                    image_urls.add(canonicalize(ORIGIN + m.group(1), url))
                yids = YOUTUBE_RE.findall(text)
                vids = VIMEO_RE.findall(text)
                youtube_ids.update(yids)
                vimeo_ids.update(vids)
            else:
                dest.with_suffix(dest.suffix + ".hdr.txt").write_text(
                    json.dumps(rec, indent=2) + "\n" + body[:2000].decode("utf-8", errors="replace"),
                    encoding="utf-8",
                )
                rec["saved"] = None
                rec["note"] = "not JSON 200 — body prefix stored as .hdr.txt"
            (rest_dir / (rest_filename(path) + ".meta.json")).write_text(
                json.dumps(rec, indent=2) + "\n", encoding="utf-8"
            )
            if status != 200:
                if "/wp/v2/media" in path and status == 403:
                    rec["note"] = "unauthenticated media REST is 403; images come from sitemaps + HTML"
                else:
                    note_error(url, f"HTTP {status}")
        except Exception as exc:
            note_error(url, str(exc))

    # --- HTML pages ---
    seen_pages: set[str] = set()
    for url in page_urls:
        if url in seen_pages:
            continue
        seen_pages.add(url)
        urls.add(url)
        dest = page_dest(pages_dir, url)
        print(f"page {origin_path(url)}", flush=True)
        try:
            status, body, headers, final = fetch(s, url, force=force, dest=dest)
            if final.rstrip("/") != url.rstrip("/") and urlparse(final).path != urlparse(url).path:
                redirects[url] = final
            if dest.exists() and not force and dest.stat().st_size and status == 200:
                # skipped network; still parse
                body = dest.read_bytes()
                final = final or url
            elif status >= 400:
                note_error(url, f"HTTP {status}")
                write_bytes(dest.with_suffix(dest.suffix + f".{status}"), body)
                continue
            else:
                write_bytes(dest, body)
                saved_pages += 1
            assets, yt, vm = extract_from_html(body, final or url)
            youtube_ids.update(yt)
            vimeo_ids.update(vm)
            for a in assets:
                urls.add(a)
                if not is_first_party(a):
                    continue
                ext = ext_of(a)
                if ext in VIDEO_EXT:
                    skipped_videos.append(a)
                elif "/wp-content/uploads/" in a and ext in IMAGE_EXT:
                    image_urls.add(a)
        except Exception as exc:
            note_error(url, str(exc))

    # Redirects: HEAD without following so cache-skipped pages still record 301s.
    for url in REDIRECT_PROBES:
        urls.add(url)
        try:
            status, location = head_no_follow(s, url)
            if status in {301, 302, 303, 307, 308} and location:
                redirects[url] = canonicalize(location, url) or location
                print(f"redir {status} {origin_path(url)} -> {redirects[url]}", flush=True)
        except Exception as exc:
            note_error(url, f"HEAD {exc}")

    for img in sitemap_images:
        u = canonicalize(img, ORIGIN + "/")
        if not u:
            continue
        urls.add(u)
        if ext_of(u) in VIDEO_EXT:
            skipped_videos.append(u)
            continue
        if is_first_party(u) and ext_of(u) in IMAGE_EXT:
            image_urls.add(u)

    # --- images (original first; skip extra srcset sizes when original exists) ---
    missing_images: list[dict] = []
    chains = image_fallback_chains(image_urls)
    for chain in chains:
        for u in chain:
            urls.add(u)
    print(f"images {len(chains)} assets ({len(image_urls)} URLs found)", flush=True)
    with ThreadPoolExecutor(max_workers=IMAGE_WORKERS) as pool:
        futs = {
            pool.submit(download_image_chain, chain, media_dir, force): chain
            for chain in chains
        }
        for fut in as_completed(futs):
            rec = fut.result()
            if rec.get("ok"):
                saved_images += 1
            else:
                missing_images.append(rec)

    # --- posters (not the videos) ---
    for vid in youtube_ids:
        urls.add(f"https://www.youtube.com/embed/{vid}")
        urls.add(f"https://i.ytimg.com/vi/{vid}/maxresdefault.jpg")
        urls.add(f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg")
    for vid in vimeo_ids:
        urls.add(f"https://player.vimeo.com/video/{vid}")
        urls.add(f"https://vimeo.com/api/oembed.json?url=https://vimeo.com/{vid}")

    with ThreadPoolExecutor(max_workers=IMAGE_WORKERS) as pool:
        futs = [
            pool.submit(download_youtube_poster, vid, posters_dir, force)
            for vid in sorted(youtube_ids)
        ]
        futs += [
            pool.submit(download_vimeo_poster, vid, posters_dir, force)
            for vid in sorted(vimeo_ids)
        ]
        for fut in as_completed(futs):
            rec = fut.result()
            poster = rec.get("poster")
            if poster:
                rec = dict(rec)
                rec["poster"] = str(Path(poster).resolve().relative_to(base))
            ok = rec.pop("ok", None)
            if ok and rec.get("poster"):
                saved_posters += 1
            elif rec.get("error"):
                note_error(rec.get("embed_url", ""), rec["error"])
            extra = rec.get("poster_url")
            if extra:
                urls.add(extra)
            embeds.append({k: v for k, v in rec.items() if k != "error" or v})

    for vurl in sorted(set(skipped_videos)):
        embeds.append(
            {
                "kind": "wp-video",
                "url": vurl,
                "skipped": True,
                "reason": "do not download videos; poster/embed recorded separately when present",
            }
        )

    finished = datetime.now(timezone.utc).isoformat()
    url_list = sorted(urls)
    (base / "urls.txt").write_text("\n".join(url_list) + "\n", encoding="utf-8")
    (base / "embeds.json").write_text(json.dumps(embeds, indent=2) + "\n", encoding="utf-8")
    (base / "redirects.json").write_text(json.dumps(redirects, indent=2) + "\n", encoding="utf-8")

    by_kind = defaultdict(int)
    for e in embeds:
        by_kind[e["kind"]] += 1

    pages_on_disk = len(list(pages_dir.rglob("*.html")))
    manifest = {
        "origin": ORIGIN,
        "started": started,
        "finished": finished,
        "force": force,
        "page_urls": len(seen_pages),
        "pages_on_disk": pages_on_disk,
        "pages_written_this_run": saved_pages,
        "image_assets": len(chains),
        "images_saved": saved_images,
        "image_urls_found": len(image_urls),
        "missing_images": missing_images,
        "posters_saved": saved_posters,
        "youtube_ids": sorted(youtube_ids),
        "vimeo_ids": sorted(vimeo_ids),
        "skipped_videos": sorted(set(skipped_videos)),
        "embed_counts": dict(by_kind),
        "url_count": len(url_list),
        "redirect_count": len(redirects),
        "error_count": len(errors),
        "errors": errors,
        "notes": [
            "WP REST /wp/v2/media is expected to 403 unauthenticated; images come from sitemaps + HTML.",
            "Patient/site videos are not downloaded. YouTube/Vimeo posters are. WP mp4s are listed in embeds.json.",
            "Quiz ?location= variants and /locations/{city}/ permalinks are extra URLs beyond the Yoast sitemaps.",
            "Image download prefers the unsized original; leftover srcset sizes stay if already captured.",
        ],
    }
    (base / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(
        f"done pages={pages_on_disk}/{len(seen_pages)} images={saved_images} "
        f"missing={len(missing_images)} posters={saved_posters} "
        f"urls={len(url_list)} errors={len(errors)}",
        flush=True,
    )
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())

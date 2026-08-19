# 13 — Published Locations drive Call and footer

**What to build:** Admin and Manager can create, edit, and unpublish the five implant Locations. The public Call picker and footer phone use only published Location records. Unpublished Locations appear nowhere a visitor can see.

**Blocked by:** None — can start immediately.

**Status:** claimed

- [ ] The five Locations are seeded from the spec (slug, display name, structured address, phone, weekly hours, lat/lng, sort order, `isDefaultCall` on Portland only).
- [ ] Slug is set at create and cannot be changed afterward.
- [ ] Staff can create and unpublish Locations. Unpublished Locations are omitted from the Call picker, footer `tel:`, and every other public use that exists at the time.
- [ ] Header Call opens a picker of published Locations (display name + `tel:`). Footer `tel:` is the Location with `isDefaultCall`. Exactly one Location has that flag.
- [ ] Hours are stored Mon–Sun as closed or open/close wall-clock. There is no holiday calendar, NexHealth id, sister-site URL, per-Location email, timezone, or building photo.

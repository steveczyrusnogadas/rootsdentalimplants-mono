# 24 — Implant dinner RSVP Leads

**What to build:** The five implant-dinner landings collect the same RSVP. Submit creates a Lead of kind `implant_dinner_rsvp`. Dated Gresham and TBA waitlists share one layout. Confirmation is `/implant-dinner-thank-you/`.

**Blocked by:** 14 — Consultation-request Lead from header Book and contact-us; 15 — Kai-clean chrome, privacy, and terms

**Status:** ready-for-agent

- [ ] `/implant-dinner-gresham/`, `/implant-dinner-halsey/` (Portland), `/implant-dinner-vancouver/`, `/implant-dinner-salem/`, and `/implant-dinner-troutdale/` exist. Chrome matches the quiz: paper header, still under a forest scrim, intro card, owned form in a bordered well, no extra proof bands. Dinner is not in the header.
- [ ] Location comes from the route, not a picker. Event date and venue copy live in code, keyed by Location slug. A sixth Location does not invent a dinner route. Dated vs TBA is copy plus the Lead snapshot, not a second layout.
- [ ] Required: who needs implants, implant history, what to learn, can answer the phone, plus shared identity and both SMS consents. Gresham snapshots the advertised 29 Oct 2026 date (`eventStartsAt` not null). TBA pages store `eventStartsAt` null (waitlist). No preferred window, reason, message, financing, TV ads, party size, or quiz mouth/pain/notes.
- [ ] `kind` is `implant_dinner_rsvp`. `source` is the dinner path. Confirmation is `/implant-dinner-thank-you/`. Admin can view this kind.
- [ ] Corpus `<title>` and meta description are the starting tags on each dinner path.

# 14 — Consultation-request Lead from header Book and contact-us

**What to build:** Header Book and `/contact-us/` both create a Lead of kind `consultation_request`. The visitor picks a Location, then a preferred window, then the rest of the shared fields, and lands on `/thank-you/`. Staff see that Lead in admin and can convert it to a Contact without destroying it.

**Blocked by:** 13 — Published Locations drive Call and footer

**Status:** ready-for-agent

- [ ] Every Book mount uses the same field list. Location is chosen before preferred-window chips. There is no new-vs-existing patient type and no Provider picker.
- [ ] Preferred window is ASAP, or one or more open days of that Location plus at least one of Morning / Afternoon. ASAP skips days. Morning/Afternoon are not derived from hours. The submitted asap flag, weekdays, and day-parts persist as columns.
- [ ] Required: name (single field), email, phone, Location, preferred window, financing, marketing SMS consent, transactional SMS consent. Both consents must be true to submit. Optional: reason chip, message, seen TV ads (default No), can answer the phone (default Yes).
- [ ] `message` is nullable. Phone is required. `source` is the mount (`header` or `/contact-us/`), not a stand-in for kind. The flow does not POST a partial Lead.
- [ ] SMS boxes use the live Gravity wording and link to `/privacy/` and `/terms/` (those pages may still 404 until 15). Confirmation is `/thank-you/`.
- [ ] Admin status, priority, and internal notes stay admin-only. Converting to a Contact copies name, email, and phone and leaves this Lead intact. Existing Lead rows survive the `message` / phone change.

# Implant dinner RSVP Lead shape

Type: grilling
Status: resolved
Blocked by: 05

## Question

Which fields does an implant-dinner RSVP collect, and how do they sit on Lead next to a consultation request?

[V1 marketing surface cut](04-v1-marketing-surface-cut.md) locked five dinner URLs plus `/implant-dinner-thank-you/` in, HighLevel off those pages, an owned RSVP creating a Lead, dates/copy in code, and TBA pages still taking waitlist Leads. Live HighLevel fields (Troutdale sample): who needs implants, history, what to learn, phone-answer, name, phone, email, two SMS consents. This ticket lists the v1 fields. Event date is not an admin field.

## Answer

Same Lead table, `kind: implant_dinner_rsvp`, for dated RSVP and TBA waitlist. First-class columns, not a JSON bag and not a second kind. `source` is the dinner path (`/implant-dinner-gresham/`, …). Location is inferred from the route (`/implant-dinner-halsey/` → Portland); no picker. Same field list on dated and TBA pages. Confirmation is `/implant-dinner-thank-you/`. Event date stays in code, not admin. SMS sending still later.

**Public fields**

| Field | Required | Notes |
|---|---|---|
| name | yes | Single field, not first/last |
| email | yes | |
| phone | yes | |
| Location | yes | From the route, not a city string |
| who needs implants | yes | Me / Friend / Family Member |
| implant history | yes | Live textarea: past dentures, implants, related treatment |
| what to learn | yes | Live textarea |
| can answer the phone | yes | Yes / No |
| event start | no | Snapshot of advertised local date+time; **null = waitlist** |
| marketing SMS consent | yes | Gravity Form wording (not HighLevel dinner copy); must be true to submit |
| transactional SMS consent | yes | Gravity Form wording; must be true to submit |

Not on this form: preferred window, reason, message, financing, TV ads, party size, quiz mouth/pain/notes. Venue stays page copy.

## Comments

- [Consultation-request Lead shape](05-consultation-request-lead-shape.md): one Lead table, `kind` discriminator (`consultation_request` vs this RSVP). Shared identity already locked: single name, required email+phone, required Location, two required SMS booleans with live wording. Consultation-only: preferred window, reason chip, financing, TV, answer-the-phone, optional message. This ticket is the remainder.

- Round 1 (2026-08-19): one `kind: implant_dinner_rsvp` for dated RSVP and TBA waitlist; snapshot nullable `eventStartsAt` from page copy (null = waitlist); Location from the route (Halsey → Portland), no picker; keep live dinner questions required (who / history / learn), no party size; keep answer-the-phone required; omit financing and TV.

- Shared understanding confirmed 2026-08-19. Grilled and closed.

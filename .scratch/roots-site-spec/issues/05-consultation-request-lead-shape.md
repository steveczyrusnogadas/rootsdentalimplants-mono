# Consultation-request Lead shape

Type: grilling
Status: resolved
Blocked by: 01, 02

## Question

Which fields does a consultation request collect, and how do they sit on today’s Lead?

Booking v1 is already locked: a structured consultation request creates a Lead; staff book the real slot. This ticket decides the fields (location, reason, preferred window, SMS consent, and whatever the current WordPress form already asks) and whether that is still one Lead record or a typed variant.

## Answer

One Lead row with a `kind` discriminator (`consultation_request` here; implant-dinner RSVP and eligibility quiz are later kinds). First-class columns, not a JSON bag and not a second table. `source` is the mount (`header`, `/contact-us/`, in-page Book) — do not overload it for kind. Same field list on every Book mount. Admin `status` / `priority` / `internalNotes` stay admin-only. Quiz submissions create a Lead (`kind: eligibility_quiz`): [Eligibility quiz chrome around HighLevel](11-eligibility-quiz-chrome-around-highlevel.md).

**Public fields**

| Field | Required | Notes |
|---|---|---|
| name | yes | Single field, not first/last |
| email | yes | |
| phone | yes | |
| Location | yes | Stored as the Location, not a city string. Chosen **before** preferred-window chips |
| preferred window | yes | **ASAP**, or one-or-more **open days of that Location** plus at least one of **Morning / Afternoon**. No calendar. Persist what they submitted |
| reason | no | Chip: Dental implants, Full-arch dental implants, Single-tooth implants, Implant-supported dentures, Not sure |
| message | no | Free text (nullable; today’s NOT NULL `message` is wrong for v1) |
| financing | yes | Financing (default) / Personal funds / Combination of both / Unsure / Need guidance |
| seen TV ads | no | Yes / No, default No |
| can answer the phone | no | Yes / No, default Yes |
| marketing SMS consent | yes | Live Gravity Form wording; must be true to submit |
| transactional SMS consent | yes | Live Gravity Form wording; must be true to submit |

SMS boxes keep `/privacy/` and `/terms/` links. Skip Kai’s new-vs-existing patient type.

Converting to a Contact leaves this Lead intact; name / email / phone copy over as they do today.

Location open days for the window chips come from operations hours — see [Location and Provider public data](06-location-and-provider-public-data.md). Dinner fields: [Implant dinner RSVP Lead shape](12-implant-dinner-rsvp-lead-shape.md).

## Comments

- Live WordPress has **no preferred-time field**. Primary consultation request is Gravity Form 1 on `/contact-us/` (name, email, optional phone/location/message, TV-ad radio, financing radio, “will you answer the phone”, two required SMS/TCPA checkboxes). Homepage GF 2 splits first/last name and requires phone. Header Book Now is NexHealth, not a Lead. Verbatim fields: [research/wordpress-route-and-embed-census.md](../research/wordpress-route-and-embed-census.md).

- [V1 marketing surface cut](04-v1-marketing-surface-cut.md): public Book is this consultation request, not NexHealth. Implant-dinner RSVPs also create Leads — field list is [Implant dinner RSVP Lead shape](12-implant-dinner-rsvp-lead-shape.md). Quiz submissions create a Lead: [Eligibility quiz chrome around HighLevel](11-eligibility-quiz-chrome-around-highlevel.md).

- Round 1 (2026-08-19): one Lead + `kind` + columns (`source` = mount); single name; email+phone required; Location required; preferred window required (ASAP or days+Morning/Afternoon); optional reason chip + optional message; keep financing required and TV/answer-phone optional; skip patient type; same field list on every Book mount.

- Round 2: SMS/TCPA stays live — both checkboxes required, verbatim wording, two booleans on the Lead, `/privacy/` and `/terms/` links.

- Round 3: preferred-day chips are the open days of the chosen Location; ASAP skips days.

- Grilled 2026-08-19. Shared understanding confirmed.

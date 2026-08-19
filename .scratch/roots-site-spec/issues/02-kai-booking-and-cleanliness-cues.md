# Kai Dental booking and cleanliness cues

Type: research
Status: resolved

## Question

What concrete UX moves make [Kai Dental](https://kaidentalmaui.com/) feel clean and booking-first — nav, CTA placement, booking steps, typography and spacing cues — that we can name in the spec without copying the site?

Primary source is the live site. Name the moves (persistent Book CTA, short path, low chrome, photography-led sections). Do not produce a visual clone spec.

## Answer

Kai feels booking-first because Book lives in a **fixed header** (always one click), opens a **five-step same-origin request modal** (not a calendar), and almost nothing else competes for attention. Name these moves in the spec; do not copy type, palette, or section order.

- Persistent Book in a fixed header; Call is the only peer CTA
- Short nav (five items + Book); blog, portal, shop, specials omitted
- Request sold as “Book Online 24/7” with preference chips (days / AM–PM / ASAP), not a date picker
- Low chrome: no chat, quiz, coupon popup, cookie banner, or exit-intent overlay
- Photography/video-led sections, few CTAs per band, generous vertical rhythm, one type family
- In-page reviews, not a reviews landing

Booking fields (modal, then `POST /api/booking/` → `/confirmation/`): patient type, appointment type, timing (ASAP or days+AM/PM), name/email/phone, optional message. Detail: [research/kai-booking-and-cleanliness-cues.md](../research/kai-booking-and-cleanliness-cues.md).

## Comments

- First research pass aborted before an answer. No findings file was written.
- Resolved from a live fetch of [kaidentalmaui.com](https://kaidentalmaui.com/) (2026-08-18). Findings: [research/kai-booking-and-cleanliness-cues.md](../research/kai-booking-and-cleanliness-cues.md).

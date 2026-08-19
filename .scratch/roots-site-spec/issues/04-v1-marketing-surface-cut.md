# V1 marketing surface cut

Type: grilling
Status: resolved
Blocked by: 01

## Question

Which current WordPress surfaces are in the v1 spec, and which are out of scope for this replacement?

Census inventory to keep / drop / later (see [WordPress route and embed census](01-wordpress-route-and-embed-census.md)): eligibility quiz, pricing-guide popup `1043`, Call Us popup `882`, `/finance-insurance/` + `/financing-options/`, before & after, testimonials, homepage click-arbitrage notice, homepage “meet or beat” / membership prices ($18,995 / $35,995), five implant-dinner RSVPs, `/smile-preview/`, Spanish `/implantes-dentales/`, and header Book Now → NexHealth. The spec needs that list so implementers do not rebuild every popup.

## Answer

Core marketing stays at WordPress paths: `/`, four treatments, `/why-choose-us/`, seven Provider pages, `/locations/`, `/contact-us/`, `/thank-you/`, `/faq/`, `/privacy/`, `/terms/`. Header **Book** is the consultation request. **Call** is the only peer CTA.

**Also in v1**

- `/before-after/`, `/testimonials/`
- `/financing-options/` — Cherry + Proceed outbound apply only; no lender iframes; no CareCredit/Sunbit
- `/implant-eligibility-quiz/` — owned three-step quiz that creates a Lead. HighLevel is gone. Detail: [Eligibility quiz chrome around HighLevel](11-eligibility-quiz-chrome-around-highlevel.md)
- Five `/implant-dinner-{city}/` pages plus `/implant-dinner-thank-you/` — **out of the header** (ad landings). Owned RSVP creates a Lead (no HighLevel). Event date/copy in code, not admin. **Gresham 29 Oct 2026** stays. Halsey (4 Jun), Vancouver (21 May), Salem (17 Jun), Troutdale (RSVP-by 4 Jun, no later date) → “more dinners coming soon” / TBA; form still a waitlist Lead for that Location
- Homepage: keep meet-or-beat and membership prices ($18,995 / $35,995) as copy; drop the click-arbitrage notice

**Drop, documented redirects**

- `/blog/`, `/post-surgery-care-what-to-expect/`, `/how-to-prepare-for-a-dental-implant-procedure/`, `/benefits-of-dental-implants-over-traditional-dentures/`, `/category/blog/`, `/author/rootsdentalimplants-admin/` → `/` (admin Blog post stays; no public blog route)
- `/finance-insurance/` → `/financing-options/`
- `/smile-preview/` → `/`
- `/implantes-dentales/` → `/`

**Gone, no public remnant**

- Elementor popups `1043` (pricing guide) and `882` (Call Us)
- Public NexHealth buttons (header, location cards, contact)
- HighLevel on dinner pages and on the eligibility quiz

`/portland/` may keep its live 301 to the quiz. `/locations/{city}/` 301s stay a later ticket ([Location and Provider public data](06-location-and-provider-public-data.md)).

Follow-ons: [Eligibility quiz chrome around HighLevel](11-eligibility-quiz-chrome-around-highlevel.md), [Implant dinner RSVP Lead shape](12-implant-dinner-rsvp-lead-shape.md). Testimonials treatment: [Blog and testimonial treatment](09-blog-and-testimonial-treatment.md).

## Comments

- Census recorded the keep/drop candidates (including dinners, smile-preview, Spanish, two finance URLs, NexHealth Book Now) in [research/wordpress-route-and-embed-census.md](../research/wordpress-route-and-embed-census.md).

- Grilled 2026-08-19. Public blog dropped; dinners stay as owned RSVP ad landings. Quiz HighLevel embed later reversed: [Eligibility quiz chrome around HighLevel](11-eligibility-quiz-chrome-around-highlevel.md).

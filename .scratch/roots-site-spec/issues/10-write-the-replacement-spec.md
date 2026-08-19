# Write the replacement spec

Type: task
Status: resolved
Blocked by: 04, 05, 06, 07, 08, 09, 11, 12

## Question

Write `.scratch/roots-site-spec/spec.md` so an implementer can replace the WordPress marketing site and ship the consultation-request flow without reopening these decisions.

The spec is the destination. It should cover routes (WordPress paths by default), operations data (Location, Provider, Lead, Blog post, Media asset), the consultation-request shape, implant-dinner RSVP, look principles plus the homepage stub and quiz chrome, and the keep/drop list from the surface cut. It should not migrate application code.

## Answer

Spec is [spec.md](../spec.md). Implementers replace the WordPress marketing site on current `apps/web` / `apps/admin` / Hono without reopening these tickets.

Covers keep/drop routes and redirects, Location/Provider seed and fields, Lead `kind` plus consultation-request / eligibility-quiz / implant-dinner RSVP columns, look tokens plus homepage D and quiz C, dinner inner-page chrome (dated vs TBA is copy), corpus as copy/asset source with hand-entered operations data, and light-only SEO titles copied from corpus pages.

## Comments

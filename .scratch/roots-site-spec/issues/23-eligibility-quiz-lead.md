# 23 — Eligibility quiz Lead

**What to build:** `/implant-eligibility-quiz/` is an owned three-step quiz. Submit creates a Lead of kind `eligibility_quiz` and confirms in the page. HighLevel is gone. `/portland/` 301s here with no Location pre-fill.

**Blocked by:** 14 — Consultation-request Lead from header Book and contact-us; 15 — Kai-clean chrome, privacy, and terms

**Status:** ready-for-agent

- [ ] Inner-page paper header, clinic still under a forest scrim, intro card (“Three short steps” and a jump to the well), form always below in a bordered well. No location chips on the card. No review or film bands.
- [ ] Step 1 is Location (five published cities). `?location=` pre-fills it. Step 2 is mouth part, pain, considering duration, optional notes. Step 3 is TV ads, financing (same four options as Book), name, phone, email, both SMS checkboxes with Book wording and Privacy/Terms links.
- [ ] Submit creates `kind: eligibility_quiz` with `source` `/implant-eligibility-quiz/`. Shared identity matches Book. No preferred window, reason chip, or answer-the-phone. Confirmation is on-page in the well.
- [ ] `/portland/` 301s to `/implant-eligibility-quiz/` with no Location pre-fill. Admin can view this kind. SMS sending is not wired.
- [ ] Corpus `<title>` and meta description are the starting tags.

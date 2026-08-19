# Roots Dental Implants

The public marketing site, admin operations, and shared backend for Roots Dental Implant Center — a multi-location implant practice replacing its WordPress site.

## Language

**Admin**:
An authenticated internal operator with role `admin` who manages users and full admin settings in `apps/admin`.
_Avoid_: User (when you mean an internal operator), owner

**Manager**:
An authenticated internal operator with role `manager` who can use most admin CMS surfaces but cannot manage users.
_Avoid_: Admin (when you mean the manager role), editor (as a stored role name)

**Location**:
A Roots Dental practice site with its own address, phone, and hours, shown on the public site and stored on every Lead.
_Avoid_: Office, clinic (as the stored name), branch

**Provider**:
A clinician shown on the public site (dentist or CRNA), editable in admin.
_Avoid_: Doctor (as the stored name — not every Provider is a dentist), user

**Lead**:
A public intake submission captured for follow-up in the admin CRM, including consultation requests, eligibility quizzes, and implant-dinner RSVPs.
_Avoid_: Contact (when you mean an unconverted intake record), prospect, appointment (no slot is reserved)

**Consultation request**:
The public booking act: a patient asks for a consult at a Location with a preferred window. It creates a Lead.
_Avoid_: Appointment, booking (when you mean the stored Lead)

**Implant dinner**:
A per-Location patient-education dinner campaign; an RSVP creates a Lead, including a waitlist when the page has no date.
_Avoid_: Seminar, event (as the stored name)

**Eligibility quiz**:
A public intake of implant-related questions, including Location, that creates a Lead.
_Avoid_: HighLevel (as the name of the surface), funnel

**Contact**:
A CRM record managed in admin, often converted from a Lead.
_Avoid_: Lead (after conversion), customer (unless in marketing copy)

**Blog post**:
An editorial content record with draft/publish workflow.
_Avoid_: Article (as the stored entity name), page

**Media asset**:
A reusable file in the admin media library stored in object storage.
_Avoid_: Document (unless referring to a PDF asset type), attachment

**Assistant**:
The optional natural-language chat interface for signed-in admin users. Starter scope is a generic LLM without product data retrieval.
_Avoid_: Chatbot, copilot (unless referring to UI patterns)

**Chat session**:
A persisted admin conversation thread owned by a user.
_Avoid_: Thread (in user-facing copy), conversation (when you mean the stored record)

**Chat message**:
One turn in a chat session, either from the user or the assistant.
_Avoid_: Prompt (for assistant turns), reply (as a stored entity name)

**Notification**:
A persisted in-app admin alert. Unread until dismissed or opened from the bell.
_Avoid_: Alert (when you mean the live toast), message (when you mean a chat turn)

**In-app alert**:
A live toast shown when a Notification arrives via SSE while the admin app is open.
_Avoid_: Notification (when you mean the persisted bell item), push notification (browser/OS level)

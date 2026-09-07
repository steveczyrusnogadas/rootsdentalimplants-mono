# Baseplate

Baseplate is a generic TypeScript monorepo starter for future products. This glossary covers terms used across the public site, internal admin operations, and shared backend capabilities.

## Language

**Admin**:
An authenticated internal operator with role `admin` who manages users and full admin settings in `apps/admin`.
_Avoid_: User (when you mean an internal operator), owner

**Manager**:
An authenticated internal operator with role `manager` who can use most admin CMS surfaces but cannot manage users.
_Avoid_: Admin (when you mean the manager role), editor (as a stored role name)

**Lead**:
A contact-form submission captured for follow-up in the admin CRM.
_Avoid_: Contact (when you mean an unconverted intake record), prospect

**Contact**:
A CRM record managed in admin, often converted from a Lead.
_Avoid_: Lead (after conversion), customer (unless in marketing copy)

**Blog post**:
An editorial content record with draft/publish workflow, shown on the public site when published.
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

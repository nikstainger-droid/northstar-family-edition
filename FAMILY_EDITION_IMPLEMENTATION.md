# Northstar Family Edition — implementation status

## Implemented in this browser-only prototype
- [x] Module enable/disable toggles
- [x] Household display name and local display name
- [x] Meal planner
- [x] Editable recipe collection with gluten-free-intent labels and allergy reminders
- [x] Add recipe ingredients to shopping list
- [x] Shopping item check-off, deletion and text export
- [x] Chores with assignee and due date
- [x] Calendar/events
- [x] Noticeboard
- [x] Browser local storage
- [x] JSON backup and restore
- [x] PWA manifest and service worker cache entries

## Not implemented yet
- [ ] Household accounts and identity verification
- [ ] Invitation link/code and safe join/leave workflow
- [ ] Real multi-device cloud synchronisation
- [ ] Private and shared record permissions enforced server-side
- [ ] Offline change outbox, idempotent sync, conflict handling and tombstones
- [ ] Tested Supabase Edge Functions and production Row Level Security policies
- [ ] Automatic quantity-aware consolidation of duplicate ingredients
- [ ] Push notifications / reliable scheduled reminders
- [ ] Large, curated recipe library (current set is starter examples only)

## Architecture and privacy guardrails
The browser prototype saves to localStorage on one device. This is not a secure boundary for household privacy. Do not claim records are private from other users of the same browser profile. A future backend must use authenticated sessions, membership checks and server-enforced RLS; clients must not be allowed to grant themselves household membership or mint invitations. Invitations should be created and redeemed through trusted server-side functions, with expiry, single-use tokens, and rate limits.

Shared records should be explicitly shared; personal records should default to private. Sync must handle offline edits, duplicate retries, conflicting versions and deletions. Treat any cloud implementation as incomplete until security policies and cross-account tests pass.

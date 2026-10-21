# Northstar Family Edition — release status

## Included in this package

- Household dashboard and tool selector.
- Household setup and per-device module toggles.
- Weekly meal planner and 35 complete starter recipes with quantities, servings, prep/cook times, steps and dietary reminders.
- Shopping list with check-off/removal and recipe ingredient transfer.
- Chores, calendar/events and noticeboard.
- Local persistence and JSON backup/restore.
- PWA manifest, icons and service-worker support.
- Supabase email magic-link authentication, household creation, invitation creation/redemption and cloud snapshot sync integration.
- RLS database schema and two trusted Edge Functions for invitation workflows.

## What still prevents an unconditional production-ready claim

1. The owner must configure a real Supabase project, allowed redirect URLs, the public browser key and deployed Edge Functions.
2. This package cannot be tested against your private Supabase project from here. Two-account acceptance/security tests must pass before household use.
3. Cloud sync stores the shared planner as one snapshot. Concurrent edits can overwrite one another; robust per-record merge/version conflict handling is still needed.
4. There is no in-app invitation revocation, member removal, or admin role-management UI.
5. There is no end-to-end encryption. Supabase project operators can access server-side data; do not store secrets or highly sensitive information.
6. Offline changes are not queued and guaranteed to retry after reconnection. PWA caching is not the same as reliable offline cloud sync.
7. Recipe methods are complete and quantities are provided, but recipes have not been kitchen-tested or independently nutrition/allergen-certified. Verify labels and cross-contact controls for gluten-free household members.

## Required acceptance tests

- Two separate email accounts on two devices; sign-in and redirect both work.
- Owner creates a household; member joins using a valid invitation code.
- Invalid, expired and already-used codes are rejected.
- Non-members cannot read household records; private records remain owner-only.
- Changes made by one member reach the other after cloud refresh/realtime events.
- Network interruption, refresh, backup export/import and mobile Safari are tested.
- Concurrent edits are tested and the snapshot overwrite limitation is understood.

Do not describe the app as production-ready until configuration and these checks are complete.

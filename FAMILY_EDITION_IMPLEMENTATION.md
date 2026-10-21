# Family Edition implementation notes

## Local modules

Home dashboard, meal planner, 35 complete recipes, shopping list, chores, calendar/events, noticeboard, per-device module toggles, local persistence, JSON backup/restore, and installable PWA shell.

## Cloud sharing

`cloud-sync.js` connects to Supabase Auth and the `shared_records` table. The Settings screen supports email magic-link sign-in, household creation, invite creation and redemption, and copyable invitation details. `supabase/functions/create-invitation` validates owner/admin membership and stores only a SHA-256 token hash. `redeem-invitation` validates the signed-in user and calls an atomic SQL function that checks expiry, revocation and use limit before adding membership. Row Level Security is enabled on household and record tables.

## Deployment-dependent work

Configure `supabase-config.js`, deploy `supabase/schema.sql` and both Edge Functions, configure Auth redirect URLs, and run the two-account acceptance tests. Snapshot sync is not conflict-free under simultaneous edits; invitation revocation and member removal UI are not included. Do not call this independently audited or production-ready until the required checks pass.

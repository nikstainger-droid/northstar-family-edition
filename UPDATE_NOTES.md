# Update notes

This release replaces placeholder meal ideas with 35 complete recipe cards including ingredient quantities, servings, preparation and cooking times, step-by-step instructions, and dietary cautions. It also replaces the insecure experimental P2P room flow in the Settings UI with an authenticated Supabase family-sharing flow using email sign-in, household creation, invitation codes, and cloud snapshot sync.

Cloud sharing requires the project owner's Supabase setup and acceptance tests; see `SUPABASE_SETUP.md` and `RELEASE_STATUS.md`. The package is not independently security audited and concurrent snapshot edits can overwrite one another.

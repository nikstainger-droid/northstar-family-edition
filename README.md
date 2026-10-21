# Northstar Family Edition

A family household-planning web app with meal planning, a searchable collection of **35 complete recipes**, a shopping list, chores, calendar/events, noticeboard, module preferences, local persistence, JSON backup/restore, PWA install support, and an optional authenticated Supabase cloud-sharing backend.

## What works locally

- Household dashboard and tool selector.
- Weekly meal planner.
- 35 recipes with ingredient quantities, servings, prep/cook times, step-by-step methods and allergy/diet reminders. The starter recipes are designed around mild flavours and gluten-free-labelled ingredients, but users must verify labels and prevent cross-contact.
- Add a recipe's listed ingredients to the shopping list.
- Shopping list, chores, calendar/events and noticeboard.
- Local storage, JSON export/import and reset.
- PWA manifest and service-worker cache.

## Family sharing setup

The app now includes a Supabase integration for email magic-link authentication, household creation, expiring invitation codes, invitation redemption through trusted Edge Functions, household state storage and realtime refresh. It is **not connected to a live backend by default**. You must create a Supabase project and configure the public URL/key before it can work across devices.

Follow [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md) in order. The `service_role` key must remain inside Supabase Edge Function secrets and must never be added to GitHub or browser code.

## Publish on GitHub Pages

1. Extract the ZIP.
2. Upload the contents of the extracted folder to the repository root, keeping `index.html` at the root.
3. Commit and wait for GitHub Pages deployment.
4. Configure Supabase as described above; a ZIP cannot create or activate a cloud project on your behalf.

## Read this before using real family data

This is a release candidate requiring deployment-specific acceptance tests, not an independently security-audited product. Cloud sharing currently syncs the shared household planner as one JSON snapshot. If two people edit at the same time, one update can overwrite another; do not rely on simultaneous editing until conflict resolution is added. There is no member-removal or invitation-revocation interface, no end-to-end encryption, and no guarantee of background offline sync. Supabase operators can access server-side data. Keep sensitive private information out of shared household data.

Test with two separate accounts and disposable data first. See `RELEASE_STATUS.md` and `SUPABASE_SETUP.md` for known limitations and required tests.

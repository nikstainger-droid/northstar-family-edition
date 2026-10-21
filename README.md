# Northstar Family Edition — GitHub starter

This is a starter fork of the existing Northstar PWA, prepared as a separate GitHub repository. It retains the current single-file frontend, manifest, service worker, icons and local backup approach so the existing UI can be extended without starting from scratch.

## Important status

**This ZIP is a starter scaffold, not a completed cloud-synchronised Family Edition.** The current frontend is still the original local-workspace implementation with family branding. Cloud accounts, invitation redemption, module-selection onboarding, granular sharing permissions, and robust offline synchronisation must be implemented and tested before sharing real family data. Do not treat the branding changes as proof those features are live.

## Files

- `index.html` — existing Northstar frontend, rebranded as Family Edition.
- `worker.js` — service worker / offline shell.
- `manifest.webmanifest` — installable PWA metadata.
- `mark.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` — app artwork.
- `supabase/schema.sql` — initial backend schema and RLS policy starter.
- `FAMILY_EDITION_IMPLEMENTATION.md` — implementation order and privacy model.

## Deploy to GitHub Pages

1. Create a new repository for Northstar Family Edition.
2. Extract the ZIP and upload the **contents** to the repository root (not the ZIP itself and not an extra nested folder).
3. Commit to the `main` branch.
4. Open **Settings → Pages** and select **Deploy from a branch**, `main`, `/(root)`.
5. Open the generated Pages URL in Safari while online, then use **Share → Add to Home Screen**.

GitHub Pages hosts the frontend only. It does not provide authentication or a private database.

## Backend setup (later phase)

1. Create a Supabase project.
2. Review `supabase/schema.sql` and run it in a development project first.
3. Test RLS using two separate user accounts before storing real household data.
4. Add only the Supabase project URL and public anon key to frontend configuration. Never put a service-role key in frontend code.
5. Implement auth, invitation creation/redemption, local persistence, an outbox, conflict handling, and sync status.

## Data safety

Use test data until the backend and permissions have been audited. Keep backups outside the repository. Never commit personal exports, `.env` files, passwords, tokens or private family records.

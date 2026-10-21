# Northstar Family Edition

An installable, offline-first household planner prototype. Upload the contents of this folder to the **root** of your GitHub repository.

## Included in this prototype
- Household name and module toggles
- Weekly meal planner and editable recipe collection
- Recipe ingredient add-to-shopping-list flow
- Shopping list with check-off, removal and text export
- Chores with person and due date
- Household calendar/events
- Noticeboard
- Browser-local storage and JSON backup/restore
- PWA manifest and service worker for offline caching

## Publish with GitHub Pages
1. Commit these files to the repository root (replace `index.html`, `worker.js`, and `manifest.webmanifest`; add `family.css`, `family.js`, and `personal-workspace-legacy.html`).
2. In GitHub, open **Settings → Pages**.
3. Select **Deploy from a branch**, choose `main` and `/(root)`, then save.
4. Wait for the Pages deployment to finish, then open the published URL. On mobile, use your browser's **Add to Home Screen** option if desired.

## Current limitations — read before using
This is a local prototype, not yet a multi-user household service. Data is saved only in the current browser on the current device. There is no sign-in, invite/join flow, cloud sync, shared-record permissions, or trusted server-side access control. The included `supabase/schema.sql` is an initial development scaffold and has not been deployed or security-tested. Do not put sensitive personal information in this prototype.

Food labels are reminders only. For gluten allergies or coeliac disease, check each ingredient and manufacturer cross-contact information; this app cannot certify food safety.

## Backup
Open **Settings → Export backup JSON** regularly. Store the backup somewhere private. Import is available from the same screen.

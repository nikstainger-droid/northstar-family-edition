# Requirements matrix

| Requirement | Status in this package | Notes |
|---|---|---|
| Single ZIP, root-ready for GitHub Pages | Included | `index.html` at archive root |
| Tool selector and household dashboard | Included | Local-first app |
| Full recipe instructions | Included | 35 recipes with quantities, timings, servings and steps; not professionally tested |
| Shopping list and recipe ingredients | Included | Ingredients can be transferred to the list |
| Chores, calendar, noticeboard | Included | Browser-local until cloud configured |
| Backup/restore | Included | JSON export/import |
| Email sign-in | Implemented, requires setup/test | Supabase Auth magic link |
| Household creation | Implemented, requires setup/test | SQL RPC adds owner membership atomically |
| Invitation code | Implemented, requires setup/test | Random 256-bit token; SHA-256 hash stored server-side; 72-hour default expiry; single use by default |
| Invitation redemption | Implemented, requires setup/test | Edge Function + atomic SQL redemption function |
| Cross-device household sync | Implemented as release candidate, requires setup/test | Single JSON snapshot; concurrent edits can overwrite |
| Private records | Schema/RLS groundwork | Not a complete private-record UI; do not put private data into shared planner |
| Member removal / invitation revocation UI | Not included | Future work |
| Conflict-free concurrent editing | Not included | Per-record sync/versioning needed |
| Guaranteed offline sync queue | Not included | Offline cache does not guarantee cloud sync |
| Independent security audit | Not done | Test RLS and function abuse cases before real use |

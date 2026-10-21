# Northstar Family Edition — implementation plan

## Locked product decisions

- Installable PWA; offline-first.
- First-launch onboarding lets each person enable/disable modules; preferences are per-person and can be changed later.
- Household joining via invitation link/code.
- Shared household records are editable by all household members equally.
- Personal records are private by default and are never exposed merely because a person joined a household.
- Cloud sync is for explicitly shared household records; offline edits are queued and reconciled on reconnect.
- No AI requirement.
- Excluded: home inventory/maintenance, household finance/budgeting, pet management and utility-provider management.
- Optional for selected people: personal tasks/goals/notes, documents, vehicle/technology management and other agreed personal tools.
- Emergency feature is limited to an emergency contact card.
- Core: meals/recipes, weekly meal planner, pantry, merged shopping list, chores/cleaning, calendar/reminders, noticeboard and shared checklists.

## Suggested data boundaries

1. `profiles`: one row per authenticated user, visible only to its owner.
2. `households`: household identity and non-sensitive display settings.
3. `household_members`: membership rows; membership grants access only to household-scoped data.
4. `shared_records`: shared household content, with household ID and record type.
5. `private_records`: owner-scoped personal content.
6. `invitations`: hashed, expiring, revocable invitation tokens; never expose household data via an invitation URL.
7. `sync_operations`: idempotency keys and version metadata for conflict-aware sync.

For production, prefer typed tables for important domains (recipes, meal plans, shopping items, chores, events) over an unrestricted generic JSON table. Apply RLS to every exposed table and storage bucket. Test policies as an unauthorised user, a member of another household, a normal member, and the record owner.

## Offline sync requirements

- Save local edits immediately.
- Add pending shared edits to a durable outbox.
- Use stable UUIDs and idempotency keys.
- Track server version / updated-at metadata and deletion tombstones.
- Merge independent shopping-item changes; don't blindly last-write-wins an entire list.
- Detect same-record conflicts and surface a resolution UI where needed.
- Re-check server membership and permissions on every server operation.
- Show `Offline`, `Pending sync`, `Synced` or `Conflict` status.
- Never sync private records into shared tables.
- When a member is removed, revoke server access and clear/restrict cached shared data at next connection; explain that offline revocation cannot be instantaneous.

## Implementation phases

1. Baseline: archive the existing version; inventory data keys, service worker cache and backup format; add smoke tests.
2. Module onboarding: module registry, per-user preferences, welcome/setup flow, skip option, settings editor. Module visibility must not be used as access control.
3. Local family domains: structured recipe library (at least 75% gluten-free-labelled recipes, with label/cross-contact warnings), serving scaling, meal planner, ingredient aggregation, pantry deductions and custom recipes.
4. Shared backend: auth, household creation, invitations, membership and RLS.
5. Sync engine: local outbox, retries, version checks, conflicts, tombstones and status display.
6. Shared workflows: meal plan, shopping list, chores, calendar and noticeboard.
7. Privacy and recovery: export/restore scope selection, migration, access-revocation tests and two-device test matrix.
8. Release: test iOS Safari/PWA, desktop browsers, airplane mode, storage failure, interrupted sync, duplicate invitation redemption and account removal.

## Recipe safety

A recipe labelled gluten-free is not a guarantee that every packaged brand is gluten-free. Flag ingredients that commonly need label verification (stocks, sauces, spice blends, marinades) and include a cross-contact reminder. Dietary filters should be explicit and user-configurable.

## Release gate

Do not announce cloud sharing as functional until two separate accounts can join through invitations, access policies pass negative tests, changes sync between devices, offline changes reconcile safely, and private data is demonstrably inaccessible to other members.

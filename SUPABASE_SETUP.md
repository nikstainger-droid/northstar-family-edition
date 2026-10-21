# Northstar Family Edition — Cloud sharing setup

This release includes a Supabase-backed authentication and household sharing implementation. GitHub Pages is static hosting, so cloud identity, membership and invitation redemption run in Supabase. **The cloud feature is not active until you create your own Supabase project and complete the steps below.** Never publish a `service_role` key.

## 1. Create the Supabase project

1. Create a project at https://supabase.com/ and choose a region appropriate for your household.
2. In **SQL Editor**, run the complete `supabase/schema.sql` file.
3. In **Project Settings → API**, copy the Project URL and the publishable key (or legacy anon key).
4. Edit `supabase-config.js` and replace `https://YOUR-PROJECT-REF.supabase.co` and `YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY`. These are public browser values; never use a service-role key here.

## 2. Configure email sign-in

1. In **Authentication → URL Configuration**, set Site URL to your exact GitHub Pages URL, e.g. `https://USERNAME.github.io/REPOSITORY/`.
2. Add the exact GitHub Pages URL to allowed Redirect URLs.
3. Enable email OTP/magic-link sign-in. Configure a trusted SMTP provider before wider use if default delivery limits are too low.
4. Test the link on the same device/browser that requested it. Keep the app on HTTPS.

## 3. Deploy the trusted invitation functions

Install the Supabase CLI and sign in, then from this project directory run:

```sh
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy create-invitation
supabase functions deploy redeem-invitation
```

Supabase supplies `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions. If your environment does not supply them automatically, configure them as Edge Function secrets in the Supabase dashboard. **The service-role key belongs only in Supabase secrets.** Do not commit it, put it in `supabase-config.js`, or send it to anyone.

## 4. Publish to GitHub Pages

Upload the contents of this ZIP to the repository root with `index.html` at the root. Commit and wait for GitHub Pages to finish deploying. Then reload the site and open Settings → Family sharing.

## 5. Household setup

1. Each family member opens the same HTTPS site and signs in with their own email.
2. One person creates the household. That account becomes the owner.
3. The owner creates an invitation code and shares it privately with the intended member.
4. The recipient signs in, pastes the code into **Invitation code**, and joins.
5. The app subscribes to household changes and stores shared planning state in Supabase. Export a JSON backup before testing.

Invitation codes are random 256-bit values; only a SHA-256 hash is stored in the database. Default invitation expiry is 72 hours and the default use limit is one. Redemption is performed by an Edge Function and an atomic SQL function. Do not use real sensitive information until the checks below pass.

## 6. Required acceptance/security tests before real use

- Use two separate test email accounts and two devices/browsers.
- Confirm a second member can see changes after they sync and that refresh/reopen restores cloud data.
- Confirm a non-member cannot read the household or its shared records.
- Confirm a private-record row is only readable by its owner.
- Test an invalid, expired and already-used invitation; all must fail.
- Confirm a user who is not an owner/admin cannot create invitations.
- Test simultaneous edits from two devices. This initial cloud sync writes a household-state snapshot, so concurrent edits can overwrite one another; avoid editing the same household simultaneously until per-record conflict resolution is added.
- Test account sign-out, magic-link redirect, network loss/recovery, backup export/import and mobile layouts.
- Review Supabase Auth rate limits, database backups, privacy obligations and data retention before inviting real users.

## Known limits

This is a production-oriented release candidate, not a claim of independent security certification. The app uses one household snapshot record for the current shared planner, which makes basic cross-device sync possible but does not provide full per-record conflict resolution, invitation revocation UI, member removal UI, role management UI or end-to-end encryption. Supabase operators can access server-side data. Do not store secrets or highly sensitive personal records in the shared household. Cloud sharing requires your project setup and two-account testing; it cannot be pre-activated from a ZIP alone.

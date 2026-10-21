# One-upload deployment

1. Download and extract `northstar_family_edition_release.zip`.
2. Open your existing GitHub repository `northstar-family-edition`.
3. Choose **Add file → Upload files**.
4. Select the contents of the extracted folder, including folders such as `supabase`, with `index.html` directly at the repository root. Do not upload only the ZIP itself.
5. Commit the upload.
6. Follow `SUPABASE_SETUP.md` to create/configure the backend and deploy the invitation functions. The app's local features work without this setup, but family sharing does not.

If GitHub reports that files with the same names will be replaced, that is expected. Do not add secrets or a service-role key to the repository.

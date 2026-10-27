# Artfolio

A portfolio site for an artist: public gallery with likes, a contact form, and a private admin page for uploading art.

**Stack:** Vite + React + Tailwind v4, Supabase (database, image storage, admin login), Netlify (hosting + contact form). All free tiers.

## 1. Run it locally

```bash
npm install
cp .env.example .env     # fill in the values after step 2
npm run dev
```

Without Supabase keys the site shows demo art so you can see the layout immediately.

## 2. Set up Supabase (about 5 minutes)

1. Create a free project at https://supabase.com.
2. Open **SQL Editor -> New query**, paste the contents of `supabase/schema.sql`, and run it. This creates the `artworks` table, the like functions, the `art` storage bucket, and all security policies.
3. **Authentication -> Users -> Add user**: create your brother's account (email + password).
4. **Authentication -> Sign In / Providers**: turn **off** "Allow new users to sign up". This is important. Otherwise anyone could register and get upload access.
5. **Project Settings -> API**: copy the Project URL and the `anon` public key into `.env`:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_ARTIST_NAME=Your Brother's Name
```

The anon key is safe to expose in the frontend. Row Level Security is what protects the data.

## 3. Upload art

Go to `/admin`, log in, and upload. Images are compressed in the browser first (max about 1.2 MB, 2200 px) so the 1 GB free storage lasts a long time.

## 4. Deploy to Netlify

1. Push this folder to a GitHub repo (`.env` is git-ignored).
2. Netlify -> **Add new site -> Import from Git**, pick the repo. Build settings come from `netlify.toml`.
3. **Site configuration -> Environment variables**: add the same three `VITE_*` variables.
4. Deploy. Then check **Forms** in the Netlify dashboard. You should see a form named `contact`. Turn on email notifications there (Forms -> Form notifications) so messages go to your brother's inbox.

## How likes work

Visitors tap the heart. The browser remembers what it liked in localStorage, and calls the `like_artwork` / `unlike_artwork` database functions. Visitors never write to the table directly. This is a soft guard, not bulletproof: someone determined could clear storage and like again. For a portfolio that is usually fine.

## Next ideas

- Per-artwork share pages with proper link previews (a Netlify function that serves OG tags)
- Drag-to-reorder, categories, an "About the artist" page
- Edit artwork details from the admin page
- Custom domain (Netlify -> Domain management)

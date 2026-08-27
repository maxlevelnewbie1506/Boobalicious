# Boobalicious

A fan-run archive cataloguing chest / waist / hip measurements for female
characters across gacha games, starting with Wuthering Waves. Built to scale
to more games and characters over time.

- **Public site**: browse games → browse characters → see measurements,
  description, and a picture gallery for each.
- **Admin ("Edit" tab)**: sign-in gated. From there an admin can:
  - **Create Post** — pick a game, then fill in a new character's measurements,
    description, cover image, and gallery.
  - **Edit Post** — pick an existing character to update its details or
    delete it entirely.
  - **New Game** — add a new game to catalogue.

Stack: **Next.js (App Router) + Supabase** (Postgres, Auth, Storage), deployed
on **Vercel**.

---

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](./supabase/schema.sql), and run it. This creates:
   - `games`, `characters`, `character_gallery` tables
   - an `admins` allowlist table
   - Row Level Security policies (public read, admin-only write)
   - a public `character-images` Storage bucket with matching policies
3. Go to **Authentication → Users → Add user** and create your admin
   account(s) (email + password is simplest).
4. Copy the new user's **UID** from that table.
5. Go to **Table Editor → admins** and insert a row with that `user_id`.
   Only accounts listed in this table can create, edit, or delete posts —
   everyone else can only view the site.

## 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your project's URL and
anon key (Supabase dashboard → **Project Settings → API**):

```bash
cp .env.local.example .env.local
```

## 3. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. Sign in at `/edit/login` with the admin
account you created above.

## 4. Deploy

**Push to GitHub:**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

**Deploy on Vercel:**

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
2. Add the same two environment variables from `.env.local` in the Vercel
   project settings (Environment Variables section).
3. Deploy. Vercel will auto-redeploy on every push to `main`.

---

## Project structure

```
src/
  app/
    page.tsx                        Homepage — list of games
    games/[gameSlug]/               Game page — character roster
    games/[gameSlug]/[charSlug]/    Character page — stats, description, gallery
    edit/                           Admin dashboard (auth-gated)
    edit/login/                     Sign-in
    edit/new-game/                  New Game form
    edit/new-post/                  Create Post flow (select game → fill details)
    edit/posts/                     Edit Post — list of characters
    edit/posts/[id]/                Edit Post — edit/delete a character
  components/                       Shared UI (cards, stat rows, uploader, nav)
  lib/supabase/                     Supabase client (browser + server)
  middleware.ts                     Protects /edit routes, refreshes session
supabase/schema.sql                 Full DB schema + RLS policies
```

## Notes

- All measurements are fan-sourced estimates, not official data from the game
  studios — the site footer says so, and there's an optional `source_note`
  field per character if you want to credit where a figure came from.
- Chest is stored as three fields (band/top, underbust, cup size) rather than
  one, per the site's spec.
- Security lives in the database: Row Level Security policies reject writes
  from anyone not in the `admins` table, regardless of what the UI shows —
  so hiding the Edit button isn't the only thing protecting the data.

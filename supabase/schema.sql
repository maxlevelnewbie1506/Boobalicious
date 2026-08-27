-- ============================================================
-- Gacha Character Measurement Archive — Database Schema
-- Run this in the Supabase SQL Editor (Project > SQL Editor > New query)
-- ============================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Tables
-- ------------------------------------------------------------

create table if not exists games (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  icon_url    text,
  created_at  timestamptz not null default now()
);

create table if not exists characters (
  id                uuid primary key default gen_random_uuid(),
  game_id           uuid not null references games(id) on delete cascade,
  name              text not null,
  slug              text not null,
  cover_image_url   text,
  description       text,
  chest_top         text,   -- band size, e.g. "32"
  chest_underbust   text,   -- underbust measurement
  chest_cup         text,   -- cup size, e.g. "C"
  waist             text,
  hip               text,
  source_note       text,   -- optional credit / where the estimate came from
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (game_id, slug)
);

create table if not exists character_gallery (
  id            uuid primary key default gen_random_uuid(),
  character_id  uuid not null references characters(id) on delete cascade,
  image_url     text not null,
  caption       text,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

-- Admin allowlist: which authenticated users are allowed to write.
-- Add rows here (by auth.users id) for each admin account.
create table if not exists admins (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Helper: is the current request from an admin?
-- ------------------------------------------------------------

create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from admins where user_id = auth.uid()
  );
$$;

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------

alter table games enable row level security;
alter table characters enable row level security;
alter table character_gallery enable row level security;
alter table admins enable row level security;

-- Public read access for everyone (including anonymous visitors)
create policy "games are viewable by everyone"
  on games for select
  using (true);

create policy "characters are viewable by everyone"
  on characters for select
  using (true);

create policy "gallery is viewable by everyone"
  on character_gallery for select
  using (true);

-- Writes restricted to admins only
create policy "admins can insert games"
  on games for insert
  with check (is_admin());

create policy "admins can update games"
  on games for update
  using (is_admin());

create policy "admins can delete games"
  on games for delete
  using (is_admin());

create policy "admins can insert characters"
  on characters for insert
  with check (is_admin());

create policy "admins can update characters"
  on characters for update
  using (is_admin());

create policy "admins can delete characters"
  on characters for delete
  using (is_admin());

create policy "admins can insert gallery images"
  on character_gallery for insert
  with check (is_admin());

create policy "admins can update gallery images"
  on character_gallery for update
  using (is_admin());

create policy "admins can delete gallery images"
  on character_gallery for delete
  using (is_admin());

-- Nobody can read/write the admins table directly except via is_admin();
-- keep it locked down — manage rows from the Supabase dashboard's Table Editor.
create policy "no public access to admins table"
  on admins for select
  using (false);

-- ------------------------------------------------------------
-- Storage buckets (run once — safe to re-run)
-- Create two public buckets for images: covers and gallery photos.
-- ------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('character-images', 'character-images', true)
on conflict (id) do nothing;

create policy "character images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'character-images');

create policy "admins can upload character images"
  on storage.objects for insert
  with check (bucket_id = 'character-images' and is_admin());

create policy "admins can update character images"
  on storage.objects for update
  using (bucket_id = 'character-images' and is_admin());

create policy "admins can delete character images"
  on storage.objects for delete
  using (bucket_id = 'character-images' and is_admin());

-- ------------------------------------------------------------
-- Keep updated_at fresh on characters
-- ------------------------------------------------------------

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists characters_set_updated_at on characters;
create trigger characters_set_updated_at
  before update on characters
  for each row
  execute function set_updated_at();

-- ------------------------------------------------------------
-- After running this file:
-- 1. Go to Authentication > Users, create your admin account(s)
--    (email + password is simplest).
-- 2. Copy each admin's user id (uuid) from that table.
-- 3. Go to Table Editor > admins, and insert a row per admin
--    with that user_id. Only rows listed here can write to the site.
-- ------------------------------------------------------------

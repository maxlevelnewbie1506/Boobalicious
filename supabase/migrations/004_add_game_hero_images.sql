-- Migration: per-game hero banner images (separate from a game's card icon).
-- Run this once in Supabase SQL Editor.

create table if not exists game_hero_images (
  id          uuid primary key default gen_random_uuid(),
  game_id     uuid not null references games(id) on delete cascade,
  image_url   text not null,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

alter table game_hero_images enable row level security;

create policy "hero images are viewable by everyone"
  on game_hero_images for select
  using (true);

create policy "admins can insert hero images"
  on game_hero_images for insert
  with check (is_admin());

create policy "admins can update hero images"
  on game_hero_images for update
  using (is_admin());

create policy "admins can delete hero images"
  on game_hero_images for delete
  using (is_admin());

-- Hero images reuse the same "character-images" storage bucket and its
-- existing policies (public read, admin write) — no new bucket needed.

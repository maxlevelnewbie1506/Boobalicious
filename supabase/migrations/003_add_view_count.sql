-- Migration: add a view counter to characters, with a safe increment path.
-- Run this once in Supabase SQL Editor.

alter table characters
  add column if not exists view_count integer not null default 0;

-- Anonymous visitors can read view_count fine (covered by the existing
-- public SELECT policy), but they can't UPDATE characters directly — only
-- admins can, per the write policies. This function lets anyone increment
-- just the counter, safely, without opening up the rest of the row to writes.
create or replace function increment_view_count(character_id uuid)
returns void
language sql
security definer
as $$
  update characters set view_count = view_count + 1 where id = character_id;
$$;

grant execute on function increment_view_count(uuid) to anon, authenticated;

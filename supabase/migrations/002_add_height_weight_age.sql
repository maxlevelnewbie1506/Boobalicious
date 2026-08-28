-- Migration: add height, weight, and age to characters
-- Run this once in Supabase SQL Editor (Project > SQL Editor > New query).
-- Safe to run even though the table already has data — it only adds columns.

alter table characters
  add column if not exists height text,
  add column if not exists weight text,
  add column if not exists age text;

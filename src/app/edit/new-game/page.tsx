"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ImageUploader } from "@/components/ImageUploader";
import type { Game } from "@/lib/types";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type GameWithCount = Game & { characters: { count: number }[] };

export default function NewGamePage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [games, setGames] = useState<GameWithCount[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function loadGames() {
    setLoadingGames(true);
    const { data } = await supabase
      .from("games")
      .select("*, characters(count)")
      .order("name");
    setGames((data as GameWithCount[]) ?? []);
    setLoadingGames(false);
  }

  useEffect(() => {
    async function load() {
      setLoadingGames(true);
      const { data } = await supabase
        .from("games")
        .select("*, characters(count)")
        .order("name");
      setGames((data as GameWithCount[]) ?? []);
      setLoadingGames(false);
    }
    load();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { error } = await supabase.from("games").insert({
      name: name.trim(),
      slug: slugify(name),
      icon_url: iconUrl,
    });

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    setName("");
    setIconUrl(null);
    await loadGames();
    router.refresh();
  }

  async function handleDelete(game: GameWithCount) {
    const characterCount = game.characters?.[0]?.count ?? 0;
    const warning =
      characterCount > 0
        ? `Delete "${game.name}"? This will also permanently delete its ${characterCount} character${
            characterCount === 1 ? "" : "s"
          } and all of their gallery images. This cannot be undone.`
        : `Delete "${game.name}"? This cannot be undone.`;

    const confirmed = window.confirm(warning);
    if (!confirmed) return;

    setDeletingId(game.id);
    setDeleteError(null);

    const { error: deleteError } = await supabase.from("games").delete().eq("id", game.id);

    setDeletingId(null);

    if (deleteError) {
      setDeleteError(deleteError.message);
      return;
    }

    await loadGames();
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--tape)]">
        New game
      </p>
      <h1 className="mt-2 font-display text-3xl text-[var(--paper)]">Add a game</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--paper-dim)]">
            Game name
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Wuthering Waves"
            className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
          />
          {name && (
            <p className="mt-1 font-mono text-[10px] text-[var(--paper-dim)]">
              URL: /games/{slugify(name)}
            </p>
          )}
        </div>

        <ImageUploader
          label="Cover / icon image"
          onUploaded={(urls) => setIconUrl(urls[0] ?? null)}
        />

        {error && <p className="font-mono text-xs text-[var(--tape)]">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-sm bg-[var(--tape)] px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--ink)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Create game"}
        </button>
      </form>

      <div className="tape-rule mt-12" />

      <h2 className="mt-8 font-display text-xl text-[var(--paper)]">Existing games</h2>

      {loadingGames ? (
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.15em] text-[var(--paper-dim)]">
          Loading…
        </p>
      ) : games.length === 0 ? (
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.15em] text-[var(--paper-dim)]">
          No games catalogued yet.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-[var(--hairline)]">
          {games.map((game) => {
            const count = game.characters?.[0]?.count ?? 0;
            return (
              <li key={game.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-display text-base text-[var(--paper)]">{game.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
                    {count} character{count === 1 ? "" : "s"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(game)}
                  disabled={deletingId === game.id}
                  className="rounded-sm border border-[var(--tape)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--tape)] transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {deletingId === game.id ? "Deleting…" : "Delete"}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {deleteError && (
        <p className="mt-3 font-mono text-xs text-[var(--tape)]">{deleteError}</p>
      )}
    </div>
  );
}

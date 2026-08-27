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

export default function NewPostPage() {
  const router = useRouter();
  const supabase = createClient();

  const [games, setGames] = useState<Game[]>([]);
  const [gameId, setGameId] = useState<string>("");
  const [loadingGames, setLoadingGames] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [chestTop, setChestTop] = useState("");
  const [chestUnderbust, setChestUnderbust] = useState("");
  const [chestCup, setChestCup] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [sourceNote, setSourceNote] = useState("");
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadGames() {
      const { data } = await supabase.from("games").select("*").order("name");
      setGames((data as Game[]) ?? []);
      setLoadingGames(false);
    }
    loadGames();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { data: character, error: insertError } = await supabase
      .from("characters")
      .insert({
        game_id: gameId,
        name: name.trim(),
        slug: slugify(name),
        description: description.trim() || null,
        chest_top: chestTop.trim() || null,
        chest_underbust: chestUnderbust.trim() || null,
        chest_cup: chestCup.trim() || null,
        waist: waist.trim() || null,
        hip: hip.trim() || null,
        height: height.trim() || null,
        weight: weight.trim() || null,
        age: age.trim() || null,
        source_note: sourceNote.trim() || null,
        cover_image_url: coverUrl,
      })
      .select()
      .single();

    if (insertError || !character) {
      setSaving(false);
      setError(insertError?.message ?? "Something went wrong creating the character.");
      return;
    }

    if (galleryUrls.length > 0) {
      const rows = galleryUrls.map((url, i) => ({
        character_id: character.id,
        image_url: url,
        sort_order: i,
      }));
      const { error: galleryError } = await supabase.from("character_gallery").insert(rows);
      if (galleryError) {
        setSaving(false);
        setError(`Character saved, but gallery upload failed: ${galleryError.message}`);
        return;
      }
    }

    setSaving(false);
    router.push("/edit");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--tape)]">
        Create post
      </p>
      <h1 className="mt-2 font-display text-3xl text-[var(--paper)]">Add a character</h1>

      {loadingGames ? (
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.15em] text-[var(--paper-dim)]">
          Loading games…
        </p>
      ) : games.length === 0 ? (
        <div className="mt-8 rounded-sm border border-dashed border-[var(--hairline)] px-6 py-10 text-center">
          <p className="font-display text-lg text-[var(--paper)]">No games yet.</p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-[var(--paper-dim)]">
            Create a game first before adding characters.
          </p>
        </div>
      ) : !gameId ? (
        <div className="mt-8">
          <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--paper-dim)]">
            Step 1 — Which game is this character under?
          </label>
          <select
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="mt-2 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
          >
            <option value="">Select a game…</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--tape)]">
              {games.find((g) => g.id === gameId)?.name}
            </p>
            <button
              type="button"
              onClick={() => setGameId("")}
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)] hover:text-[var(--paper)]"
            >
              Change game
            </button>
          </div>

          <div>
            <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--paper-dim)]">
              Character name
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
            />
          </div>

          <div>
            <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--paper-dim)]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
            />
          </div>

          <div className="tape-rule" />

          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--paper-dim)]">
            Vitals
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
                Age
              </label>
              <input
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 19"
                className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
                Height
              </label>
              <input
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 165cm"
                className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
                Weight
              </label>
              <input
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 50kg"
                className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
              />
            </div>
          </div>

          <div className="tape-rule" />

          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--paper-dim)]">
            Measurements
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
                Chest — top / band
              </label>
              <input
                value={chestTop}
                onChange={(e) => setChestTop(e.target.value)}
                placeholder="e.g. 32"
                className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
                Underbust
              </label>
              <input
                value={chestUnderbust}
                onChange={(e) => setChestUnderbust(e.target.value)}
                placeholder="e.g. 68cm"
                className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
                Cup size
              </label>
              <input
                value={chestCup}
                onChange={(e) => setChestCup(e.target.value)}
                placeholder="e.g. C"
                className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
                Waist
              </label>
              <input
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
                Hip
              </label>
              <input
                value={hip}
                onChange={(e) => setHip(e.target.value)}
                className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--paper-dim)]">
              Source note (optional)
            </label>
            <input
              value={sourceNote}
              onChange={(e) => setSourceNote(e.target.value)}
              placeholder="e.g. community estimate, artist reference"
              className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
            />
          </div>

          <div className="tape-rule" />

          <ImageUploader label="Cover image" onUploaded={(urls) => setCoverUrl(urls[0] ?? null)} />
          <ImageUploader
            label="Gallery images"
            multiple
            onUploaded={(urls) => setGalleryUrls((prev) => [...prev, ...urls])}
          />

          {error && <p className="font-mono text-xs text-[var(--tape)]">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-sm bg-[var(--tape)] px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--ink)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Publish character"}
          </button>
        </form>
      )}
    </div>
  );
}

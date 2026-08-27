"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ImageUploader } from "@/components/ImageUploader";
import type { Character, GalleryImage } from "@/lib/types";

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [character, setCharacter] = useState<Character | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: char } = await supabase
        .from("characters")
        .select("*")
        .eq("id", params.id)
        .single();
      const { data: imgs } = await supabase
        .from("character_gallery")
        .select("*")
        .eq("character_id", params.id)
        .order("sort_order");

      setCharacter(char as Character);
      setGallery((imgs as GalleryImage[]) ?? []);
      setLoading(false);
    }
    load();
  }, [params.id, supabase]);

  function update<K extends keyof Character>(key: K, value: Character[K]) {
    setCharacter((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!character) return;
    setSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("characters")
      .update({
        name: character.name,
        description: character.description,
        chest_top: character.chest_top,
        chest_underbust: character.chest_underbust,
        chest_cup: character.chest_cup,
        waist: character.waist,
        hip: character.hip,
        height: character.height,
        weight: character.weight,
        age: character.age,
        source_note: character.source_note,
        cover_image_url: character.cover_image_url,
      })
      .eq("id", character.id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push("/edit");
    router.refresh();
  }

  async function handleDelete() {
    if (!character) return;
    const confirmed = window.confirm(
      `Delete "${character.name}" permanently? This also removes its gallery images. This cannot be undone.`
    );
    if (!confirmed) return;

    setDeleting(true);
    const { error: deleteError } = await supabase
      .from("characters")
      .delete()
      .eq("id", character.id);
    setDeleting(false);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    router.push("/edit");
    router.refresh();
  }

  async function addGalleryImages(urls: string[]) {
    if (!character || urls.length === 0) return;
    const rows = urls.map((url, i) => ({
      character_id: character.id,
      image_url: url,
      sort_order: gallery.length + i,
    }));
    const { data, error: galleryError } = await supabase
      .from("character_gallery")
      .insert(rows)
      .select();
    if (!galleryError && data) {
      setGallery((prev) => [...prev, ...(data as GalleryImage[])]);
    }
  }

  async function removeGalleryImage(id: string) {
    const confirmed = window.confirm("Remove this gallery image?");
    if (!confirmed) return;
    const { error: removeError } = await supabase
      .from("character_gallery")
      .delete()
      .eq("id", id);
    if (!removeError) {
      setGallery((prev) => prev.filter((img) => img.id !== id));
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--paper-dim)]">
          Loading…
        </p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="font-display text-xl text-[var(--paper)]">Character not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--tape)]">
        Edit post
      </p>
      <h1 className="mt-2 font-display text-3xl text-[var(--paper)]">{character.name}</h1>

      <form onSubmit={handleSave} className="mt-8 space-y-5">
        <div>
          <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--paper-dim)]">
            Character name
          </label>
          <input
            required
            value={character.name}
            onChange={(e) => update("name", e.target.value)}
            className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
          />
        </div>

        <div>
          <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--paper-dim)]">
            Description
          </label>
          <textarea
            value={character.description ?? ""}
            onChange={(e) => update("description", e.target.value)}
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
              value={character.age ?? ""}
              onChange={(e) => update("age", e.target.value)}
              className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
              Height
            </label>
            <input
              value={character.height ?? ""}
              onChange={(e) => update("height", e.target.value)}
              className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
              Weight
            </label>
            <input
              value={character.weight ?? ""}
              onChange={(e) => update("weight", e.target.value)}
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
              value={character.chest_top ?? ""}
              onChange={(e) => update("chest_top", e.target.value)}
              className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
              Underbust
            </label>
            <input
              value={character.chest_underbust ?? ""}
              onChange={(e) => update("chest_underbust", e.target.value)}
              className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
              Cup size
            </label>
            <input
              value={character.chest_cup ?? ""}
              onChange={(e) => update("chest_cup", e.target.value)}
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
              value={character.waist ?? ""}
              onChange={(e) => update("waist", e.target.value)}
              className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
              Hip
            </label>
            <input
              value={character.hip ?? ""}
              onChange={(e) => update("hip", e.target.value)}
              className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
            />
          </div>
        </div>

        <div>
          <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--paper-dim)]">
            Source note
          </label>
          <input
            value={character.source_note ?? ""}
            onChange={(e) => update("source_note", e.target.value)}
            className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
          />
        </div>

        <div className="tape-rule" />

        <ImageUploader
          label="Replace cover image"
          onUploaded={(urls) => update("cover_image_url", urls[0] ?? character.cover_image_url)}
        />

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--paper-dim)]">
            Gallery
          </p>
          {gallery.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {gallery.map((img) => (
                <div key={img.id} className="relative aspect-square w-full">
                  <Image
                    src={img.image_url}
                    alt=""
                    fill
                    className="rounded-sm border border-[var(--hairline)] object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(img.id)}
                    className="absolute right-1 top-1 rounded-sm bg-black/70 px-1.5 py-0.5 font-mono text-[9px] uppercase text-[var(--tape)]"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3">
            <ImageUploader label="Add gallery images" multiple onUploaded={addGalleryImages} />
          </div>
        </div>

        {error && <p className="font-mono text-xs text-[var(--tape)]">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-sm bg-[var(--tape)] px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--ink)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-sm border border-[var(--tape)] px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--tape)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete post"}
          </button>
        </div>
      </form>
    </div>
  );
}

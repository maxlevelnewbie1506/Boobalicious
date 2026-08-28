"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ImageUploader } from "@/components/ImageUploader";
import type { Game, HeroImage } from "@/lib/types";

export default function ManageHeroImagesPage() {
  const params = useParams<{ id: string }>();
  const supabase = createClient();

  const [game, setGame] = useState<Game | null>(null);
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: g } = await supabase.from("games").select("*").eq("id", params.id).single();
      const { data: imgs } = await supabase
        .from("game_hero_images")
        .select("*")
        .eq("game_id", params.id)
        .order("sort_order");
      setGame(g as Game);
      setImages((imgs as HeroImage[]) ?? []);
      setLoading(false);
    }
    load();
  }, [params.id, supabase]);

  async function addImages(urls: string[]) {
    if (urls.length === 0) return;
    const rows = urls.map((url, i) => ({
      game_id: params.id,
      image_url: url,
      sort_order: images.length + i,
    }));
    const { data, error: insertError } = await supabase
      .from("game_hero_images")
      .insert(rows)
      .select();
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setImages((prev) => [...prev, ...((data as HeroImage[]) ?? [])]);
  }

  async function removeImage(id: string) {
    const confirmed = window.confirm("Remove this hero image?");
    if (!confirmed) return;
    const { error: deleteError } = await supabase.from("game_hero_images").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setImages((prev) => prev.filter((img) => img.id !== id));
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

  if (!game) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="font-display text-xl text-[var(--paper)]">Game not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--tape)]">
        Hero banner images
      </p>
      <h1 className="mt-2 font-display text-3xl text-[var(--paper)]">{game.name}</h1>
      <p className="mt-2 max-w-lg text-sm text-[var(--paper-dim)]">
        These images rotate in the homepage hero banner whenever this game is
        featured. Separate from the cover image shown on the game&apos;s card.
      </p>

      <div className="tape-rule mt-8" />

      {images.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-video w-full">
              <Image
                src={img.image_url}
                alt=""
                fill
                className="rounded-sm border border-[var(--hairline)] object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute right-1 top-1 rounded-sm bg-black/70 px-1.5 py-0.5 font-mono text-[9px] uppercase text-[var(--tape)]"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <ImageUploader label="Add hero images" multiple onUploaded={addImages} />
      </div>

      {error && <p className="mt-3 font-mono text-xs text-[var(--tape)]">{error}</p>}
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { StatRow } from "@/components/StatRow";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import type { GalleryImage } from "@/lib/types";

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ gameSlug: string; charSlug: string }>;
}) {
  const { gameSlug, charSlug } = await params;
  const supabase = await createClient();

  const { data: game } = await supabase
    .from("games")
    .select("*")
    .eq("slug", gameSlug)
    .single();

  if (!game) notFound();

  const { data: character } = await supabase
    .from("characters")
    .select("*")
    .eq("game_id", game.id)
    .eq("slug", charSlug)
    .single();

  if (!character) notFound();

  const { data: gallery } = await supabase
    .from("character_gallery")
    .select("*")
    .eq("character_id", character.id)
    .order("sort_order", { ascending: true });

  const chest = [character.chest_top, character.chest_underbust, character.chest_cup]
    .filter(Boolean)
    .join(" / ");

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <Link
        href={`/games/${game.slug}`}
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--paper-dim)] hover:text-[var(--tape)]"
      >
        ← {game.name}
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,320px)_1fr]">
        {/* Portrait */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm border border-[var(--hairline)] bg-[var(--surface)]">
          {character.cover_image_url ? (
            <Image
              src={character.cover_image_url}
              alt={character.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-[0.2em] text-[var(--paper-dim)]">
              No image
            </div>
          )}
        </div>

        {/* Spec sheet */}
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--tape)]">
            {game.name}
          </p>
          <h1 className="mt-2 font-display text-4xl text-[var(--paper)]">{character.name}</h1>

          {character.description && (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--paper-dim)]">
              {character.description}
            </p>
          )}

          <div className="tape-rule mt-8" />

          <div className="mt-2">
            <StatRow label="Age" value={character.age} />
            <StatRow label="Height" value={character.height} />
            <StatRow label="Weight" value={character.weight} />
            <StatRow label="Chest (band / under / cup)" value={chest || null} />
            <StatRow label="Waist" value={character.waist} />
            <StatRow label="Hip" value={character.hip} />
          </div>

          {character.source_note && (
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
              Source: {character.source_note}
            </p>
          )}
        </div>
      </div>

      {/* Gallery */}
      {gallery && gallery.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl text-[var(--paper)]">Gallery</h2>
          <div className="tape-rule mt-4" />
          <div className="mt-8">
            <GalleryLightbox images={gallery as GalleryImage[]} altBase={character.name} />
          </div>
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import type { Character } from "@/lib/types";

export function CharacterCard({
  character,
  gameSlug,
}: {
  character: Character;
  gameSlug: string;
}) {
  return (
    <Link
      href={`/games/${gameSlug}/${character.slug}`}
      className="group fade-up relative overflow-hidden rounded-sm border border-[var(--hairline)] bg-[var(--surface)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--tape-dim)] hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.5)]"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--surface-raised)]">
        {character.cover_image_url ? (
          <Image
            src={character.cover_image_url}
            alt={character.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-[0.2em] text-[var(--paper-dim)]">
            No image
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <h3 className="font-display text-base text-[var(--paper)]">{character.name}</h3>
        </div>
      </div>
    </Link>
  );
}

import Link from "next/link";
import Image from "next/image";
import type { Character } from "@/lib/types";

export function MoreFromGame({
  characters,
  gameSlug,
}: {
  characters: Character[];
  gameSlug: string;
}) {
  if (characters.length === 0) return null;

  return (
    <div className="mt-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--tape)]">
        More from this game
      </p>
      <div className="tape-rule mt-3" />
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {characters.map((c) => (
          <Link
            key={c.id}
            href={`/games/${gameSlug}/${c.slug}`}
            className="group relative aspect-[3/4] overflow-hidden rounded-sm border border-[var(--hairline)] bg-[var(--surface)] transition-colors hover:border-[var(--tape-dim)]"
          >
            {c.cover_image_url ? (
              <Image
                src={c.cover_image_url}
                alt={c.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
                No image
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2">
              <p className="font-display text-sm text-[var(--paper)]">{c.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

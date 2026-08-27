import Link from "next/link";
import Image from "next/image";
import type { Game } from "@/lib/types";

export function GameCard({ game }: { game: Game }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="group fade-up relative overflow-hidden rounded-sm border border-[var(--hairline)] bg-[var(--surface)] transition-colors hover:border-[var(--tape-dim)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--surface-raised)]">
        {game.icon_url ? (
          <Image
            src={game.icon_url}
            alt={game.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-[0.2em] text-[var(--paper-dim)]">
            No cover
          </div>
        )}
      </div>
      <div className="tape-rule" />
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="font-display text-lg text-[var(--paper)]">{game.name}</h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--tape)]">
          Open →
        </span>
      </div>
    </Link>
  );
}

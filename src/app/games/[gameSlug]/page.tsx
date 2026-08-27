import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CharacterCard } from "@/components/CharacterCard";
import type { Character } from "@/lib/types";

export default async function GamePage({
  params,
}: {
  params: Promise<{ gameSlug: string }>;
}) {
  const { gameSlug } = await params;
  const supabase = await createClient();

  const { data: game } = await supabase
    .from("games")
    .select("*")
    .eq("slug", gameSlug)
    .single();

  if (!game) notFound();

  const { data: characters } = await supabase
    .from("characters")
    .select("*")
    .eq("game_id", game.id)
    .order("name", { ascending: true });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link
        href="/"
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--paper-dim)] hover:text-[var(--tape)]"
      >
        ← All games
      </Link>
      <h1 className="mt-3 font-display text-4xl text-[var(--paper)]">{game.name}</h1>
      <p className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-[var(--paper-dim)]">
        {characters?.length ?? 0} characters catalogued
      </p>

      <div className="tape-rule mt-8" />

      {characters && characters.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {(characters as Character[]).map((c) => (
            <CharacterCard key={c.id} character={c} gameSlug={game.slug} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-sm border border-dashed border-[var(--hairline)] px-6 py-16 text-center">
          <p className="font-display text-xl text-[var(--paper)]">
            No characters yet for {game.name}.
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-[var(--paper-dim)]">
            Sign in under Edit to add one.
          </p>
        </div>
      )}
    </div>
  );
}

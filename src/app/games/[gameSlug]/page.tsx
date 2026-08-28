import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CharacterBrowser } from "@/components/CharacterBrowser";
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
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: game.name }]}
      />
      <h1 className="mt-3 font-display text-4xl text-[var(--paper)]">{game.name}</h1>
      <p className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-[var(--paper-dim)]">
        {characters?.length ?? 0} characters catalogued
      </p>

      <div className="tape-rule mt-8" />

      {characters && characters.length > 0 ? (
        <div className="mt-10">
          <CharacterBrowser characters={characters as Character[]} gameSlug={game.slug} />
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

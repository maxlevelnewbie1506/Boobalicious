import { createClient } from "@/lib/supabase/server";
import { GameCard } from "@/components/GameCard";
import type { Game } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: games } = await supabase
    .from("games")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--tape)]">
        Fan-compiled character archive
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-[var(--paper)] sm:text-5xl">
        Every measurement, catalogued by title.
      </h1>
      <p className="mt-4 max-w-xl text-sm text-[var(--paper-dim)]">
        Pick a game below to browse its character roster. All figures are
        community estimates rather than official studio data.
      </p>

      <div className="tape-rule mt-10" />

      {games && games.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(games as Game[]).map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-sm border border-dashed border-[var(--hairline)] px-6 py-16 text-center">
          <p className="font-display text-xl text-[var(--paper)]">
            No games catalogued yet.
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-[var(--paper-dim)]">
            Sign in under Edit to add the first one.
          </p>
        </div>
      )}
    </div>
  );
}

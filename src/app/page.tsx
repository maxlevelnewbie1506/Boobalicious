import { createClient } from "@/lib/supabase/server";
import { GameCard } from "@/components/GameCard";
import { HeroBanner } from "@/components/HeroBanner";
import { MostViewed } from "@/components/MostViewed";
import type { Game } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: games }, { data: mostViewed }] = await Promise.all([
    supabase.from("games").select("*").order("created_at", { ascending: true }),
    supabase
      .from("characters")
      .select("*, games(name, slug)")
      .gt("view_count", 0)
      .order("view_count", { ascending: false })
      .limit(5),
  ]);

  return (
    <div>
      {games && games.length > 0 && (
        <div className="mx-auto max-w-6xl px-6 pt-8">
          <HeroBanner games={games as Game[]} />
        </div>
      )}

      <div className="mx-auto max-w-6xl px-6 pb-16">
        {(!games || games.length === 0) && (
          <>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--tape)]">
              Fan-compiled character archive
            </p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-[var(--paper)] sm:text-5xl">
              Every measurement, catalogued by title.
            </h1>
          </>
        )}
        <p className="max-w-xl text-sm text-[var(--paper-dim)]">
          Pick a game below to browse its character roster. All figures are{" "}
          <a href="/about" className="underline decoration-[var(--hairline)] hover:text-[var(--tape)]">
            community estimates
          </a>{" "}
          rather than official studio data.
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

        {mostViewed && <MostViewed characters={mostViewed} />}
      </div>
    </div>
  );
}

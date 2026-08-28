import { createClient } from "@/lib/supabase/server";
import { GameCard } from "@/components/GameCard";
import { HeroBanner, type HeroSlide } from "@/components/HeroBanner";
import { MostViewed } from "@/components/MostViewed";
import type { Game, HeroImage } from "@/lib/types";

type GameWithHero = Game & { game_hero_images: HeroImage[] };

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: games }, { data: mostViewed }] = await Promise.all([
    supabase
      .from("games")
      .select("*, game_hero_images(*)")
      .order("created_at", { ascending: true }),
    supabase
      .from("characters")
      .select("*, games(name, slug)")
      .gt("view_count", 0)
      .order("view_count", { ascending: false })
      .limit(5),
  ]);

  const gamesTyped = (games as GameWithHero[]) ?? [];

  // Build the hero rotation: each game's own uploaded hero images, in order.
  // A game with no hero images yet falls back to its card cover image, so
  // the banner still shows something for it until dedicated shots are added.
  const slides: HeroSlide[] = gamesTyped.flatMap((game) => {
    const heroImages = [...(game.game_hero_images ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order
    );

    if (heroImages.length > 0) {
      return heroImages.map((img) => ({
        key: img.id,
        image_url: img.image_url,
        game_name: game.name,
        game_slug: game.slug,
      }));
    }

    if (game.icon_url) {
      return [
        {
          key: game.id,
          image_url: game.icon_url,
          game_name: game.name,
          game_slug: game.slug,
        },
      ];
    }

    return [];
  });

  return (
    <div>
      {slides.length > 0 && (
        <div className="mx-auto max-w-6xl px-6 pt-8">
          <HeroBanner slides={slides} />
        </div>
      )}

      <div className="mx-auto max-w-6xl px-6 pb-16">
        {gamesTyped.length === 0 && (
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

        {gamesTyped.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gamesTyped.map((game) => (
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

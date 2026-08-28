"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export type HeroSlide = {
  key: string;
  image_url: string;
  game_name: string;
  game_slug: string;
};

export function HeroBanner({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const featured = slides[index];

  return (
    <div className="relative -mx-6 mb-16 h-[46vh] min-h-[320px] overflow-hidden sm:mx-0 sm:rounded-sm sm:border sm:border-[var(--hairline)]">
      {slides.map((slide, i) => (
        <div
          key={slide.key}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <Image
            src={slide.image_url}
            alt={slide.game_name}
            fill
            priority={i === 0}
            className="object-cover"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/40 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--tape)]">
          Fan-compiled character archive
        </p>
        <h1 className="mt-2 max-w-xl font-display text-3xl leading-tight text-[var(--paper)] sm:text-5xl">
          Every measurement, catalogued by title.
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Link
            href={`/games/${featured.game_slug}`}
            className="rounded-sm bg-[var(--tape)] px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--ink)] transition-opacity hover:opacity-90"
          >
            Explore {featured.game_name} →
          </Link>
          {slides.length > 1 && (
            <div className="flex gap-1.5">
              {slides.map((slide, i) => (
                <button
                  key={slide.key}
                  type="button"
                  aria-label={`Show ${slide.game_name}`}
                  onClick={() => setIndex(i)}
                  className="h-1.5 w-6 rounded-full transition-colors"
                  style={{
                    backgroundColor: i === index ? "var(--tape)" : "var(--hairline)",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

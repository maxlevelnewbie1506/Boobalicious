"use client";

import { useMemo, useState } from "react";
import { CharacterCard } from "@/components/CharacterCard";
import type { Character } from "@/lib/types";

type SortKey = "name" | "newest";

export function CharacterBrowser({
  characters,
  gameSlug,
}: {
  characters: Character[];
  gameSlug: string;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("name");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? characters.filter((c) => c.name.toLowerCase().includes(q)) : characters;

    return [...list].sort((a, b) => {
      if (sort === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return a.name.localeCompare(b.name);
    });
  }, [characters, query, sort]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search characters…"
          className="w-full max-w-xs rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
        />
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
          <span>Sort:</span>
          <button
            type="button"
            onClick={() => setSort("name")}
            className={sort === "name" ? "text-[var(--tape)]" : "hover:text-[var(--paper)]"}
          >
            A–Z
          </button>
          <span className="text-[var(--hairline)]">/</span>
          <button
            type="button"
            onClick={() => setSort("newest")}
            className={sort === "newest" ? "text-[var(--tape)]" : "hover:text-[var(--paper)]"}
          >
            Newest
          </button>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((c) => (
            <CharacterCard key={c.id} character={c} gameSlug={gameSlug} />
          ))}
        </div>
      ) : (
        <p className="mt-10 font-mono text-xs uppercase tracking-[0.15em] text-[var(--paper-dim)]">
          No characters match &quot;{query}&quot;.
        </p>
      )}
    </div>
  );
}

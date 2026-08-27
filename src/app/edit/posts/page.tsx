import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function EditPostsListPage() {
  const supabase = await createClient();

  const { data: characters } = await supabase
    .from("characters")
    .select("id, name, slug, games(name, slug)")
    .order("name");

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--tape)]">
        Edit post
      </p>
      <h1 className="mt-2 font-display text-3xl text-[var(--paper)]">Select a character</h1>

      <div className="tape-rule mt-6" />

      {characters && characters.length > 0 ? (
        <ul className="mt-6 divide-y divide-[var(--hairline)]">
          {characters.map((c) => (
            <li key={c.id}>
              <Link
                href={`/edit/posts/${c.id}`}
                className="flex items-center justify-between py-4 transition-colors hover:text-[var(--tape)]"
              >
                <span className="font-display text-lg text-[var(--paper)]">{c.name}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
                  {(c.games as unknown as { name: string })?.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.15em] text-[var(--paper-dim)]">
          No characters yet.
        </p>
      )}
    </div>
  );
}

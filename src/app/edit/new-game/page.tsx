"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ImageUploader } from "@/components/ImageUploader";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewGamePage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { error } = await supabase.from("games").insert({
      name: name.trim(),
      slug: slugify(name),
      icon_url: iconUrl,
    });

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/edit");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--tape)]">
        New game
      </p>
      <h1 className="mt-2 font-display text-3xl text-[var(--paper)]">Add a game</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--paper-dim)]">
            Game name
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Wuthering Waves"
            className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
          />
          {name && (
            <p className="mt-1 font-mono text-[10px] text-[var(--paper-dim)]">
              URL: /games/{slugify(name)}
            </p>
          )}
        </div>

        <ImageUploader
          label="Cover / icon image"
          onUploaded={(urls) => setIconUrl(urls[0] ?? null)}
        />

        {error && <p className="font-mono text-xs text-[var(--tape)]">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-sm bg-[var(--tape)] px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--ink)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Create game"}
        </button>
      </form>
    </div>
  );
}

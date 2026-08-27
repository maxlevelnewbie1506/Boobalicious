"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError("Sign-in failed. Check your email and password.");
      return;
    }

    router.push("/edit");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--tape)]">
        Admin access
      </p>
      <h1 className="mt-2 font-display text-3xl text-[var(--paper)]">Sign in</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--paper-dim)]">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
          />
        </div>
        <div>
          <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--paper-dim)]">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--tape)]"
          />
        </div>

        {error && <p className="font-mono text-xs text-[var(--tape)]">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-[var(--tape)] px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--ink)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

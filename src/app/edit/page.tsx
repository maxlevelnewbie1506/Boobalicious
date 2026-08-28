import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/SignOutButton";

export default async function EditDashboard() {
  const supabase = await createClient();

  const { data: isAdminResult } = await supabase.rpc("is_admin");

  const isAdmin = Boolean(isAdminResult);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--tape)]">
            Admin panel
          </p>
          <h1 className="mt-2 font-display text-3xl text-[var(--paper)]">Edit</h1>
        </div>
        <SignOutButton />
      </div>

      <div className="tape-rule mt-8" />

      {!isAdmin ? (
        <div className="mt-10 rounded-sm border border-dashed border-[var(--hairline)] px-6 py-12 text-center">
          <p className="font-display text-xl text-[var(--paper)]">
            Your account isn&apos;t on the admin list.
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-[var(--paper-dim)]">
            Add your user id to the &quot;admins&quot; table in Supabase to unlock editing.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/edit/new-post"
            className="rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-5 py-6 transition-colors hover:border-[var(--tape-dim)]"
          >
            <p className="font-display text-lg text-[var(--paper)]">Create Post</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
              Add a new character
            </p>
          </Link>
          <Link
            href="/edit/posts"
            className="rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-5 py-6 transition-colors hover:border-[var(--tape-dim)]"
          >
            <p className="font-display text-lg text-[var(--paper)]">Edit Post</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
              Update or remove an existing character
            </p>
          </Link>
          <Link
            href="/edit/new-game"
            className="rounded-sm border border-[var(--hairline)] bg-[var(--surface)] px-5 py-6 transition-colors hover:border-[var(--tape-dim)]"
          >
            <p className="font-display text-lg text-[var(--paper)]">New Game</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
              Add a game to catalogue
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/edit/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--paper-dim)] hover:text-[var(--tape)]"
    >
      Sign out
    </button>
  );
}

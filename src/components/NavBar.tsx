import Link from "next/link";

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--hairline)] bg-[var(--ink)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg tracking-tight text-[var(--paper)]">
          Vital<span className="text-[var(--tape)]">Stats</span>
          <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--paper-dim)]">
            archive
          </span>
        </Link>
        <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-[0.15em] text-[var(--paper-dim)]">
          <Link href="/" className="transition-colors hover:text-[var(--paper)]">
            Games
          </Link>
          <Link href="/edit" className="transition-colors hover:text-[var(--tape)]">
            Edit
          </Link>
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]"
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-[var(--hairline)]">/</span>}
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-[var(--tape)]">
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--paper)]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

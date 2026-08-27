export function StatRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-baseline justify-between border-b border-[var(--hairline)] py-3">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--paper-dim)]">
        {label}
      </span>
      <span className="font-mono text-lg text-[var(--paper)]">
        {value && value.trim() !== "" ? value : "—"}
      </span>
    </div>
  );
}

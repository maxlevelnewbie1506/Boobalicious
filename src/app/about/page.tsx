import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

      <h1 className="mt-4 font-display text-4xl text-[var(--paper)]">About this archive</h1>

      <div className="tape-rule mt-8" />

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-[var(--paper-dim)]">
        <p>
          This site catalogues body measurements — chest, waist, hip, height, and
          weight — for female characters across gacha games, starting with
          Wuthering Waves.
        </p>
        <p>
          <span className="font-display text-[var(--paper)]">
            None of these figures are official.
          </span>{" "}
          Game studios essentially never publish body measurements for their
          characters. Every number here comes from fan estimates —
          community members who study official art, in-game models, and
          promotional material to work out plausible figures. Where a
          character has an optional{" "}
          <span className="font-mono text-xs text-[var(--paper)]">source note</span>{" "}
          attached, it credits where that estimate originated.
        </p>
        <p>
          Treat these numbers as community consensus, not canon. They can
          change as better references surface, and different fan sources
          sometimes disagree — when they do, this archive tries to reflect
          the most widely cited estimate.
        </p>
        <p>
          Have a correction or a better-sourced figure? The site is actively
          maintained — estimates get updated as the community&apos;s research
          improves.
        </p>
      </div>
    </div>
  );
}

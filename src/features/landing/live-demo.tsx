"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

import { cn } from "@/utils/cn";

import { useReducedMotion } from "@/components/fx/use-reduced-motion";

const personas = [
  {
    name: "Maya Chen",
    role: "Product Designer",
    bullet: "Redesigned onboarding, +18% activation",
  },
  {
    name: "Jordan Okafor",
    role: "Data Analyst",
    bullet: "Built a churn model saving $1.2M a year",
  },
  {
    name: "Sam Rivera",
    role: "Software Engineer",
    bullet: "Cut page load time by 40%",
  },
];

const fields = [
  { key: "name", label: "Full name" },
  { key: "role", label: "Job title" },
  { key: "bullet", label: "Experience" },
] as const;

/** Cumulative char count at the end of each field. */
const fieldEnds = (p: number) =>
  fields.reduce<number[]>(
    (acc, f) => [...acc, (acc.at(-1) ?? 0) + personas[p][f.key].length],
    [],
  );

const totalChars = (p: number) => fieldEnds(p).at(-1) ?? 0;

/**
 * Fake editor typing into a fake PDF. Starts fully typed (no-JS / reduced motion
 * show a finished resume), then cycles personas while on screen.
 */
export function LiveDemo({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  const [{ p, n }, setState] = useState({ p: 0, n: totalChars(0) });

  const total = totalChars(p);

  useEffect(() => {
    if (reduce || !inView) return;
    const ends = fieldEnds(p);
    const delay = n >= total ? 2600 : ends.includes(n) ? 450 : 55;
    const id = setTimeout(
      () =>
        setState(
          n >= total ? { p: (p + 1) % personas.length, n: 0 } : { p, n: n + 1 },
        ),
      delay,
    );
    return () => clearTimeout(id);
  }, [p, n, total, reduce, inView]);

  const ends = fieldEnds(p);
  const typed = fields.map(({ key }, i) => {
    const value = personas[p][key];
    return value.slice(0, Math.max(0, n - (ends[i] - value.length)));
  });
  const active =
    n < total
      ? fields.findIndex(
          ({ key }, i) => typed[i].length < personas[p][key].length,
        )
      : -1;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Typing in the editor updates the PDF preview live"
      className={cn(
        "relative mx-auto w-full max-w-sm pr-2 pb-12 pl-6 sm:max-w-md sm:pl-8",
        className,
      )}
    >
      <div className="aspect-[1/1.3] rotate-2 rounded-lg border bg-white p-7 shadow-2xl shadow-foreground/10 sm:p-9">
        <p className="min-h-[1em] font-display text-4xl leading-none">
          {typed[0]}
        </p>
        <p className="mt-2 min-h-[1.5em] font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {typed[1]}
        </p>
        <div className="mt-5 h-px bg-border" />

        <p className="mt-5 font-mono text-[0.65rem] font-semibold tracking-widest uppercase">
          Experience
        </p>
        <p
          className={cn(
            "mt-2 min-h-[1.5em] rounded-sm text-sm transition-colors",
            active === 2 && "bg-highlight/40",
          )}
        >
          {typed[2] && <>• {typed[2]}</>}
        </p>
        <Lines widths={["w-11/12", "w-4/5"]} />

        <p className="mt-6 font-mono text-[0.65rem] font-semibold tracking-widest uppercase">
          Education
        </p>
        <Lines widths={["w-3/4", "w-1/2"]} />

        <p className="mt-6 font-mono text-[0.65rem] font-semibold tracking-widest uppercase">
          Skills
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {["w-12", "w-16", "w-10", "w-14"].map((w, i) => (
            <span key={i} className={cn("h-4 rounded-full bg-muted", w)} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-60 -rotate-2 space-y-3 rounded-xl border bg-card p-4 shadow-xl sm:w-64">
        <p className="flex items-center gap-1.5 font-mono text-[0.65rem] tracking-widest text-muted-foreground uppercase">
          <span className="size-1.5 rounded-full bg-highlight-dark" /> Editor
        </p>
        {fields.map(({ key, label }, i) => (
          <div key={key}>
            <p className="text-[0.7rem] font-medium text-muted-foreground">
              {label}
            </p>
            <div
              className={cn(
                "mt-1 h-8 truncate rounded-md border px-2.5 text-sm leading-7.5 transition-shadow",
                active === i && "border-ring ring-3 ring-ring/20",
              )}
            >
              {typed[i]}
              {active === i && (
                <span className="ml-px inline-block h-4 w-px translate-y-0.75 bg-foreground motion-safe:animate-caret" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Lines({ widths }: { widths: string[] }) {
  return (
    <div className="mt-2 space-y-2">
      {widths.map((w) => (
        <div key={w} className={cn("h-2 rounded-full bg-muted", w)} />
      ))}
    </div>
  );
}

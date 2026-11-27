"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/utils/cn";

import { useReducedMotion } from "./use-reduced-motion";

/**
 * Cycles through `words` in place. All words share one grid cell so width never
 * jumps; screen readers (and reduced motion) get only the first word.
 */
export function RotatingWord({
  words,
  interval = 2800,
  className,
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval,
    );
    return () => clearInterval(id);
  }, [reduce, interval, words.length]);

  return (
    <span className="inline-grid whitespace-nowrap">
      <span className="sr-only">{words[0]}</span>
      {words.map((w) => (
        <span key={w} aria-hidden className="invisible [grid-area:1/1]">
          {w}
        </span>
      ))}
      <AnimatePresence initial={false}>
        <motion.span
          key={words[index]}
          aria-hidden
          initial={{ y: "0.35em", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-0.35em", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={cn("justify-self-start [grid-area:1/1]", className)}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

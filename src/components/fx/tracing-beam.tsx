"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";

import { cn } from "@/utils/cn";

import { useReducedMotion } from "./use-reduced-motion";

/** Vertical rail on the left that fills w/ highlighter as the reader scrolls. */
export function TracingBeam({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 300, damping: 40 });

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div
        aria-hidden
        className="absolute top-4 bottom-10 left-4.5 w-0.5 -translate-x-1/2 rounded-full bg-border"
      />
      <motion.div
        aria-hidden
        style={{ scaleY: reduce ? 1 : fill }}
        className="absolute top-4 bottom-10 left-4.5 w-0.5 origin-top -translate-x-1/2 rounded-full bg-highlight-dark"
      />
      {children}
    </div>
  );
}

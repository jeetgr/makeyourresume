"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { cn } from "@/utils/cn";

import { useReducedMotion } from "./use-reduced-motion";

/** Tilted frame that flattens as it scrolls into view. */
export function ContainerScroll({
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
    offset: ["start end", "start 25%"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);

  return (
    <div ref={ref} className="perspective-[1200px]">
      <motion.div
        style={reduce ? { rotateX: 0, scale: 1 } : { rotateX, scale }}
        className={cn("origin-top will-change-transform", className)}
      >
        {children}
      </motion.div>
    </div>
  );
}

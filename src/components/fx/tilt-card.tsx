"use client";

import { cn } from "@/utils/cn";

/** Tilts toward the mouse pointer (touch ignored). */
export function TiltCard({
  max = 8,
  className,
  ...props
}: React.ComponentProps<"div"> & { max?: number }) {
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty("--rx", `${-y * max}deg`);
    e.currentTarget.style.setProperty("--ry", `${x * max}deg`);
  }

  function onPointerLeave(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.style.removeProperty("--rx");
    e.currentTarget.style.removeProperty("--ry");
  }

  return (
    <div
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn("tilt", className)}
      {...props}
    />
  );
}

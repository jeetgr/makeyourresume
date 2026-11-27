"use client";

import { cn } from "@/utils/cn";

/** Card w/ a soft highlighter glow following the pointer. */
export function SpotlightCard({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      onPointerMove={onPointerMove}
      className={cn(
        "group/spot relative overflow-hidden rounded-2xl border bg-card",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--x) var(--y), color-mix(in oklab, var(--highlight) 22%, transparent), transparent 70%)",
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

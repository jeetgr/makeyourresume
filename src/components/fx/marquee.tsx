import { cn } from "@/utils/cn";

/**
 * Endless horizontal scroll of `<li>` children (CSS only). Pauses on hover/focus.
 * Reduced motion: no animation, scrollable row, duplicate hidden.
 */
export function Marquee({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const list = "flex shrink-0 gap-6 pr-6";

  return (
    <div
      className={cn(
        "group/marquee flex overflow-hidden mask-[linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)] motion-reduce:overflow-x-auto motion-reduce:mask-none",
        className,
      )}
    >
      <div className="flex w-max shrink-0 group-focus-within/marquee:[animation-play-state:paused] group-hover/marquee:[animation-play-state:paused] motion-safe:animate-marquee">
        <ul className={list}>{children}</ul>
        <ul aria-hidden inert className={cn(list, "motion-reduce:hidden")}>
          {children}
        </ul>
      </div>
    </div>
  );
}

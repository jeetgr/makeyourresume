import { cn } from "@/utils/cn";

/**
 * Endless scroll of `<li>` children (CSS only). Pauses on hover/focus.
 * Reduced motion: no animation, scrollable row, duplicate hidden.
 */
export function Marquee({
  vertical,
  className,
  children,
}: {
  vertical?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const list = cn("flex shrink-0 gap-6", vertical ? "flex-col pb-6" : "pr-6");

  return (
    <div
      className={cn(
        "group/marquee flex overflow-hidden motion-reduce:mask-none",
        vertical
          ? "flex-col mask-[linear-gradient(to_bottom,transparent,#000_10%,#000_90%,transparent)] motion-reduce:overflow-y-auto"
          : "mask-[linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)] motion-reduce:overflow-x-auto",
        className,
      )}
    >
      <div
        className={cn(
          "flex shrink-0 group-focus-within/marquee:[animation-play-state:paused] group-hover/marquee:[animation-play-state:paused]",
          vertical
            ? "h-max flex-col motion-safe:animate-marquee-y"
            : "w-max motion-safe:animate-marquee",
        )}
      >
        <ul className={list}>{children}</ul>
        <ul aria-hidden inert className={cn(list, "motion-reduce:hidden")}>
          {children}
        </ul>
      </div>
    </div>
  );
}

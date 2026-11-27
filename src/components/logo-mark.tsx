/** Brand mark: folded page, top line highlighted (Q64). Ink follows `currentColor`. */
export function LogoMark({
  animated,
  className,
}: {
  /** Highlighter bar draws in on a loop (motion-safe). */
  animated?: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={className}>
      <path
        d="M8 3h11l6 6v18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M19 3v6h6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <rect
        x="9.5"
        y="13"
        width="12"
        height="3.6"
        rx="1.2"
        fill="var(--highlight)"
        className={
          animated
            ? "origin-left [transform-box:fill-box] motion-safe:animate-mark-draw"
            : undefined
        }
      />
      <path
        d="M10.5 20.5h10M10.5 24.5h6.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

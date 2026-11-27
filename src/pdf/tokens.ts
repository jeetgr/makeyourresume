import { createContext, use } from "react";

import type { Density, Theme } from "@/lib/resume/theme";

import { FONT_FAMILIES } from "./font-families";

const densityScale: Record<Density, number> = {
  compact: 0.8,
  normal: 1,
  relaxed: 1.2,
};

/** Theme → concrete sizes (pt) and colors used by templates and primitives. */
export function makeTokens(theme: Theme) {
  const b = theme.baseSize;
  const d = densityScale[theme.density];
  const { ascent, capHeight } = FONT_FAMILIES[theme.font];

  return {
    fontFamily: theme.font,
    pageSize: theme.pageSize,
    size: {
      xs: b * 0.8,
      sm: b * 0.9,
      base: b,
      md: b * 1.15,
      lg: b * 1.4,
      xl: b * 2.2,
    },
    /** Spacing in pt: `space(n)` = n × 4pt × density. */
    space: (n: number) => n * 4 * d,
    /**
     * How far caps sit below center in a `lineHeight: 1` box (baseline ≈ ascent);
     * shift text up by this (pt) to center uppercase text optically.
     */
    capShift: (fontSize: number) => (ascent - capHeight / 2 - 0.5) * fontSize,
    accent: theme.accent,
    /** Accent with alpha (0–1); expects `#rrggbb`. */
    tint: (alpha: number) =>
      theme.accent +
      Math.round(alpha * 255)
        .toString(16)
        .padStart(2, "0"),
    text: "#1a1a1a",
    muted: "#555555",
  };
}

export type Tokens = ReturnType<typeof makeTokens>;

export const TokensContext = createContext<Tokens | null>(null);

export function useTokens() {
  const tokens = use(TokensContext);
  if (!tokens) throw new Error("useTokens outside TokensContext");
  return tokens;
}

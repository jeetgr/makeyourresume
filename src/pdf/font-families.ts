import type { FontId } from "@/lib/resume/theme";

/** Engine-free font info (safe for the main bundle). `ascent`/`capHeight` in em, from the TTFs. */
export const FONT_FAMILIES: Record<
  FontId,
  { label: string; serif: boolean; ascent: number; capHeight: number }
> = {
  inter: { label: "Inter", serif: false, ascent: 0.969, capHeight: 0.728 },
  lato: { label: "Lato", serif: false, ascent: 0.987, capHeight: 0.717 },
  "ibm-plex-sans": {
    label: "IBM Plex Sans",
    serif: false,
    ascent: 1.025,
    capHeight: 0.698,
  },
  roboto: { label: "Roboto", serif: false, ascent: 0.928, capHeight: 0.711 },
  "source-serif-4": {
    label: "Source Serif 4",
    serif: true,
    ascent: 1.036,
    capHeight: 0.67,
  },
  "eb-garamond": {
    label: "EB Garamond",
    serif: true,
    ascent: 1.007,
    capHeight: 0.65,
  },
};

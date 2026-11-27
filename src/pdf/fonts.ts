import { Font } from "@react-pdf/renderer";

import type { FontId } from "@/lib/resume/theme";

/** `ascent`/`capHeight` in em (from the TTFs), for optical centering. */
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

const FILES = [
  { file: "400" },
  { file: "400i", fontStyle: "italic" },
  { file: "700", fontWeight: 700 },
  { file: "700i", fontStyle: "italic", fontWeight: 700 },
] as const;

/** Font file URL/path; `root` = site origin (browser) or `public/` dir (node). */
const fontSrc = (root: string, font: FontId, file = "400") =>
  `${root}/fonts/${font}/${file}.ttf`;

let registered = false;

/** Registers every theme font under its id; react-pdf loads files lazily. */
export function registerFonts(root: string) {
  if (registered) return;
  registered = true;

  for (const family of Object.keys(FONT_FAMILIES) as FontId[]) {
    Font.register({
      family,
      fonts: FILES.map(({ file, ...rest }) => ({
        src: fontSrc(root, family, file),
        ...rest,
      })),
    });
  }
  Font.registerHyphenationCallback((word) => [word]);
}

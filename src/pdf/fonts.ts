import { Font } from "@react-pdf/renderer";

import type { FontId } from "@/lib/resume/theme";

export const FONT_FAMILIES: Record<FontId, { label: string; serif: boolean }> =
  {
    inter: { label: "Inter", serif: false },
    lato: { label: "Lato", serif: false },
    "ibm-plex-sans": { label: "IBM Plex Sans", serif: false },
    roboto: { label: "Roboto", serif: false },
    "source-serif-4": { label: "Source Serif 4", serif: true },
    "eb-garamond": { label: "EB Garamond", serif: true },
  };

const FILES = [
  { file: "400" },
  { file: "400i", fontStyle: "italic" },
  { file: "700", fontWeight: 700 },
  { file: "700i", fontStyle: "italic", fontWeight: 700 },
] as const;

/** Font file URL/path; `root` = site origin (browser) or `public/` dir (node). */
export const fontSrc = (root: string, font: FontId, file = "400") =>
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

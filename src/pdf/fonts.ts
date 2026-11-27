import { Font } from "@react-pdf/renderer";

import type { FontId } from "@/lib/resume/theme";

import { FONT_FAMILIES } from "./font-families";

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

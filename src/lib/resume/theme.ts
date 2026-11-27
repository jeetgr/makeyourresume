import * as z from "zod";

const FONTS = [
  "inter",
  "lato",
  "ibm-plex-sans",
  "roboto",
  "source-serif-4",
  "eb-garamond",
] as const;

export const DENSITIES = ["compact", "normal", "relaxed"] as const;

export const themeSchema = z.object({
  accent: z.string().default("#cd6060"),
  font: z.enum(FONTS).default("inter"),
  /** Body font size in pt. */
  baseSize: z.number().min(8).max(14).default(10),
  density: z.enum(DENSITIES).default("normal"),
  pageSize: z.enum(["A4", "LETTER"]).default("A4"),
});

export type Theme = z.infer<typeof themeSchema>;
export type Density = Theme["density"];

export const defaultTheme: Theme = themeSchema.parse({});

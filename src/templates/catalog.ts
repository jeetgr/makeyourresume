import { defaultTheme, type Theme } from "@/lib/resume/theme";

import type { TemplateMeta } from "./types";

/** Template metadata, engine-free (safe for the main bundle); documents live in `registry.ts`. */
export const templateCatalog: TemplateMeta[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Single column, serif, centered header. Safest for ATS.",
    tags: ["ATS-friendly", "Serif"],
    defaultTheme: { accent: "#1f2a44", font: "source-serif-4", baseSize: 10.5 },
  },
  {
    id: "modern",
    name: "Modern",
    description: "Single column, accent headings, skill chips, optional photo.",
    tags: ["ATS-friendly", "Photo"],
    defaultTheme: { accent: "#2563eb", font: "inter", baseSize: 10 },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Airy single column with dates in a left gutter.",
    tags: ["ATS-friendly", "Spacious"],
    defaultTheme: {
      accent: "#0e7490",
      font: "lato",
      baseSize: 10,
      density: "relaxed",
    },
  },
  {
    id: "executive",
    name: "Executive",
    description:
      "Dense and formal, competencies grid. Fits 2-page senior resumes.",
    tags: ["ATS-friendly", "Compact"],
    defaultTheme: {
      accent: "#1e3a5f",
      font: "roboto",
      baseSize: 9.5,
      density: "compact",
    },
  },
  {
    id: "sidebar",
    name: "Sidebar",
    description: "Photo and contacts in a left column, accent header.",
    tags: ["Photo", "Two-column"],
    defaultTheme: { accent: "#cd6060", font: "inter", baseSize: 10 },
  },
];

export const DEFAULT_TEMPLATE_ID = "classic";

/** Unknown/legacy ids (e.g. `template-1`) → default template. */
export const getTemplateMeta = (id?: string | null) =>
  templateCatalog.find((t) => t.id === id) ??
  templateCatalog.find((t) => t.id === DEFAULT_TEMPLATE_ID)!;

export const templateTheme = (template: TemplateMeta): Theme => ({
  ...defaultTheme,
  ...template.defaultTheme,
});

export const thumbnailSrc = (id: string) => `/templates/${id}.png`;

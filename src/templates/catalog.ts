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

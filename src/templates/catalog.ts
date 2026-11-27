import { defaultTheme, type Theme } from "@/lib/resume/theme";

import type { TemplateMeta } from "./types";

/** Template metadata, engine-free (safe for the main bundle); documents live in `registry.ts`. */
export const templateCatalog: TemplateMeta[] = [
  {
    id: "sidebar",
    name: "Sidebar",
    description: "Photo and contacts in a left column, accent header.",
    defaultTheme: { accent: "#cd6060", font: "inter", baseSize: 10 },
  },
];

export const DEFAULT_TEMPLATE_ID = "sidebar";

/** Unknown/legacy ids (e.g. `template-1`) → default template. */
export const getTemplateMeta = (id?: string | null) =>
  templateCatalog.find((t) => t.id === id) ??
  templateCatalog.find((t) => t.id === DEFAULT_TEMPLATE_ID)!;

export const templateTheme = (template: TemplateMeta): Theme => ({
  ...defaultTheme,
  ...template.defaultTheme,
});

export const thumbnailSrc = (id: string) => `/templates/${id}.png`;

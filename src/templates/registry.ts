import { defaultTheme, type Theme } from "@/lib/resume/theme";

import { sidebar } from "./sidebar";
import type { TemplateDef } from "./types";

export const templates: TemplateDef[] = [sidebar];

export const DEFAULT_TEMPLATE_ID = sidebar.id;

/** Unknown/legacy ids (e.g. `template-1`) → default template. */
export const getTemplate = (id?: string | null) =>
  templates.find((t) => t.id === id) ?? sidebar;

export const templateTheme = (template: TemplateDef): Theme => ({
  ...defaultTheme,
  ...template.defaultTheme,
});

import { getTemplateMeta, templateTheme } from "@/templates/catalog";

import type { ResumeDocState } from "./doc";
import { fromJsonResume, isJsonResume } from "./jsonresume";
import { MAX_RESUME_BYTES } from "./limits";
import { parseResumeData } from "./migrate";
import { themeSchema } from "./theme";

const APP = "makeyourresume";
/** File envelope version; `data.version` versions the resume itself. */
const FORMAT = 1;

type ImportError = "too_large" | "invalid_json" | "unsupported" | "invalid";

type ImportResult =
  | { ok: true; value: ResumeDocState; source: "own" | "jsonresume" }
  | { ok: false; error: ImportError };

/** Own export file; lossless (Q59). */
export const toResumeFile = ({ data, theme, templateId }: ResumeDocState) => ({
  app: APP,
  format: FORMAT,
  templateId: getTemplateMeta(templateId).id,
  theme,
  data,
});

const defaultBase = () => {
  const template = getTemplateMeta(null);
  return { theme: templateTheme(template), templateId: template.id };
};

/**
 * Imported file text → resume state. Own files carry theme + template;
 * JSON Resume files keep `base`'s (default: the default template).
 */
export function parseImport(
  text: string,
  base: Pick<ResumeDocState, "theme" | "templateId"> = defaultBase(),
): ImportResult {
  if (text.length > MAX_RESUME_BYTES) return { ok: false, error: "too_large" };

  let input: unknown;
  try {
    input = JSON.parse(text);
  } catch {
    return { ok: false, error: "invalid_json" };
  }

  if (isResumeFile(input)) {
    const data = parseResumeData(input.data);
    if (!data) return { ok: false, error: "invalid" };
    const template = getTemplateMeta(
      typeof input.templateId === "string" ? input.templateId : null,
    );
    return {
      ok: true,
      source: "own",
      value: {
        data,
        theme: themeSchema.catch(templateTheme(template)).parse(input.theme),
        templateId: template.id,
      },
    };
  }

  if (isJsonResume(input)) {
    const data = fromJsonResume(input);
    return data
      ? { ok: true, source: "jsonresume", value: { ...base, data } }
      : { ok: false, error: "invalid" };
  }

  return { ok: false, error: "unsupported" };
}

const isResumeFile = (
  input: unknown,
): input is { data: unknown; theme?: unknown; templateId?: unknown } =>
  !!input &&
  typeof input === "object" &&
  "app" in input &&
  input.app === APP &&
  "data" in input;

export const IMPORT_ERRORS: Record<ImportError, string> = {
  too_large: "File is too large (max 1 MB).",
  invalid_json: "File isn't valid JSON.",
  unsupported: "Not a makeyourresume or JSON Resume file.",
  invalid: "Resume data is invalid or from a newer version.",
};

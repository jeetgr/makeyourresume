import { z } from "zod";

import { resumeDataSchema } from "@/lib/resume/schema";
import { themeSchema } from "@/lib/resume/theme";

/** Upper bound for a stored resume (data + theme JSON), photo data URL included. */
export const MAX_RESUME_BYTES = 1_000_000;

export const resumeIdSchema = z.uuid();

export const titleSchema = z.string().trim().min(1).max(120);

export const resumeContentSchema = z.object({
  data: resumeDataSchema,
  theme: themeSchema,
  templateId: z.string().min(1).max(64),
});

export const saveInputSchema = resumeContentSchema.extend({
  baseUpdatedAt: z.iso.datetime(),
});

export type ResumeContent = z.infer<typeof resumeContentSchema>;

export type ParseResult<T> =
  { ok: true; value: T } | { ok: false; error: "invalid" | "too_large" };

/** Size check first (cheap, bounds zod work), then schema validation. */
export function parseResumeInput<T>(
  schema: z.ZodType<T>,
  input: unknown,
): ParseResult<T> {
  if (JSON.stringify(input ?? null).length > MAX_RESUME_BYTES) {
    return { ok: false, error: "too_large" };
  }
  const result = schema.safeParse(input);
  return result.success
    ? { ok: true, value: result.data }
    : { ok: false, error: "invalid" };
}

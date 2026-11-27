import { emptyResume } from "./empty";
import { resumeDataSchema, type ResumeData } from "./schema";

/** Stored/imported value → current `ResumeData`; unknown version or invalid → `null`. */
export function parseResumeData(input: unknown): ResumeData | null {
  const version = (input as { version?: unknown } | null)?.version;

  switch (version) {
    case 1: {
      const result = resumeDataSchema.safeParse(input);
      if (result.success) return result.data;
      break;
    }
  }

  return null;
}

/** Like `parseResumeData`, but falls back to an empty resume. */
export const migrate = (input: unknown): ResumeData =>
  parseResumeData(input) ?? emptyResume();

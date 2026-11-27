import { emptyResume } from "./empty";
import { resumeDataSchema, type ResumeData } from "./schema";

/** Any stored/imported value → current `ResumeData`; unknown or invalid → empty. */
export function migrate(input: unknown): ResumeData {
  const version = (input as { version?: unknown } | null)?.version;

  switch (version) {
    case 1: {
      const result = resumeDataSchema.safeParse(input);
      if (result.success) return result.data;
      break;
    }
  }

  return emptyResume();
}

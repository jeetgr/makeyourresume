import { describe, expect, it } from "vitest";

import { emptyResume } from "@/lib/resume/empty";
import { defaultTheme } from "@/lib/resume/theme";

import {
  MAX_RESUME_BYTES,
  parseResumeInput,
  resumeContentSchema,
  saveInputSchema,
} from "./resume-input";

const content = {
  data: emptyResume(),
  theme: defaultTheme,
  templateId: "sidebar",
};

describe("parseResumeInput", () => {
  it("accepts valid content", () => {
    expect(parseResumeInput(resumeContentSchema, content)).toMatchObject({
      ok: true,
    });
  });

  it("rejects invalid shape", () => {
    expect(
      parseResumeInput(resumeContentSchema, {
        ...content,
        data: { version: 99 },
      }),
    ).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseResumeInput(saveInputSchema, content)).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("rejects payloads over the size limit before parsing", () => {
    const data = emptyResume();
    data.profile.photo = "x".repeat(MAX_RESUME_BYTES);
    expect(parseResumeInput(resumeContentSchema, { ...content, data })).toEqual(
      {
        ok: false,
        error: "too_large",
      },
    );
  });
});

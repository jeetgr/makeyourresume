import { describe, expect, it } from "vitest";

import { defaultTheme } from "./theme";
import { MAX_RESUME_BYTES } from "./limits";
import { sampleResume } from "./sample";
import { parseImport, toResumeFile } from "./transfer";

const state = {
  data: sampleResume,
  theme: { ...defaultTheme, accent: "#123456", font: "lato" as const },
  templateId: "minimal",
};

const file = (value: unknown) => JSON.stringify(value);

describe("own JSON import/export", () => {
  it("round-trips losslessly", () => {
    const result = parseImport(file(toResumeFile(state)));
    expect(result).toEqual({ ok: true, source: "own", value: state });
  });

  it("falls back for unknown template / invalid theme", () => {
    const result = parseImport(
      file({ ...toResumeFile(state), templateId: "nope", theme: { font: 1 } }),
    );
    expect(result.ok && result.value.templateId).toBe("classic");
    expect(result.ok && result.value.theme.font).toBe("source-serif-4");
  });

  it("rejects bad input", () => {
    const err = (text: string) => {
      const r = parseImport(text);
      return !r.ok && r.error;
    };
    expect(err("{")).toBe("invalid_json");
    expect(err(file({ hello: "world" }))).toBe("unsupported");
    expect(err(file({ app: "other", data: sampleResume }))).toBe("unsupported");
    expect(err(file({ ...toResumeFile(state), data: { version: 2 } }))).toBe(
      "invalid",
    );
    expect(
      err(file({ ...toResumeFile(state), data: { version: 1, skills: 3 } })),
    ).toBe("invalid");
    expect(err(" ".repeat(MAX_RESUME_BYTES + 1))).toBe("too_large");
  });

  it("imports JSON Resume onto the given template + theme", () => {
    const result = parseImport(
      file({ basics: { name: "Ada Lovelace" } }),
      state,
    );
    expect(result.ok && result.source).toBe("jsonresume");
    expect(result.ok && result.value.templateId).toBe("minimal");
    expect(result.ok && result.value.data.profile.lastName).toBe("Lovelace");
  });
});

import path from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { beforeAll, describe, expect, it } from "vitest";

import { emptyResume } from "@/lib/resume/empty";
import { sampleResume } from "@/lib/resume/sample";
import { renderResumeToBuffer } from "@/pdf/engine";
import { registerFonts } from "@/pdf/fonts";

import {
  DEFAULT_TEMPLATE_ID,
  getTemplate,
  templateTheme,
  templates,
} from "./registry";

beforeAll(() => registerFonts(path.resolve("public")));

async function pdfText(buffer: Uint8Array) {
  const doc = await getDocument({ data: buffer }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const content = await (await doc.getPage(i)).getTextContent();
    pages.push(
      content.items.map((item) => ("str" in item ? item.str : "")).join(" "),
    );
  }
  return pages.join("\n");
}

describe("registry", () => {
  it("unknown ids fall back to default", () => {
    expect(getTemplate("template-1").id).toBe(DEFAULT_TEMPLATE_ID);
    expect(getTemplate(null).id).toBe(DEFAULT_TEMPLATE_ID);
  });

  it("ids are unique", () => {
    expect(new Set(templates.map((t) => t.id)).size).toBe(templates.length);
  });
});

describe.each(templates)("$id", (template) => {
  const theme = templateTheme(template);
  const render = (data = sampleResume) =>
    renderResumeToBuffer({ data, theme, templateId: template.id });

  it("renders empty data", async () => {
    expect((await render(emptyResume())).length).toBeGreaterThan(0);
  });

  it("renders sample on Letter", async () => {
    const buffer = await renderResumeToBuffer({
      data: sampleResume,
      theme: { ...theme, pageSize: "LETTER" },
      templateId: template.id,
    });
    expect(buffer.length).toBeGreaterThan(0);
  });

  it("has extractable text in reading order (ATS)", async () => {
    const text = await pdfText(new Uint8Array(await render()));
    const expected = [
      "John Doe",
      sampleResume.profile.email,
      ...sampleResume.experience.map((e) => e.role),
    ];
    const positions = expected.map((s) => text.indexOf(s));
    expect(
      positions.every((p) => p >= 0),
      text,
    ).toBe(true);
    expect(positions.slice(2)).toEqual(
      [...positions.slice(2)].sort((a, b) => a - b),
    );
  });
});

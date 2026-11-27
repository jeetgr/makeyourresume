import path from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { beforeAll, describe, expect, it } from "vitest";

import { emptyResume } from "@/lib/resume/empty";
import type { ResumeData } from "@/lib/resume/schema";
import type { Theme } from "@/lib/resume/theme";
import { sampleResume } from "@/lib/resume/sample";
import { renderResumeToBuffer } from "@/pdf/engine";
import { registerFonts } from "@/pdf/fonts";

import {
  DEFAULT_TEMPLATE_ID,
  getTemplateMeta,
  templateCatalog,
  templateTheme,
} from "./catalog";
import { templateDocuments } from "./registry";

beforeAll(() => registerFonts(path.resolve("public")));

async function pdfPages(buffer: Uint8Array) {
  const doc = await getDocument({ data: buffer }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const content = await (await doc.getPage(i)).getTextContent();
    pages.push(
      content.items.map((item) => ("str" in item ? item.str : "")).join(" "),
    );
  }
  return pages;
}

const pdfText = async (buffer: Uint8Array) =>
  (await pdfPages(buffer)).join("\n");

/** Sample w/ experience ×12 and tripled bullets → 3+ pages. */
const longResume: ResumeData = {
  ...sampleResume,
  experience: Array.from({ length: 6 }, (_, k) =>
    sampleResume.experience.map((e) => ({
      ...e,
      id: `${e.id}-${k}`,
      role: `${e.role} #${k}`,
      bullets: [...e.bullets, ...e.bullets, ...e.bullets].map((b, j) => ({
        ...b,
        id: `${b.id}-${j}`,
        text: `${b.text} with measurable impact across teams and quarters`,
      })),
    })),
  ).flat(),
};

describe("registry", () => {
  it("unknown ids fall back to default", () => {
    expect(getTemplateMeta("template-1").id).toBe(DEFAULT_TEMPLATE_ID);
    expect(getTemplateMeta(null).id).toBe(DEFAULT_TEMPLATE_ID);
  });

  it("ids are unique and each has a document", () => {
    const ids = templateCatalog.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(Object.keys(templateDocuments).sort()).toEqual([...ids].sort());
  });
});

describe.each(templateCatalog)("$id", (template) => {
  const theme = templateTheme(template);
  const render = async (data = sampleResume, overrides?: Partial<Theme>) =>
    new Uint8Array(
      await renderResumeToBuffer({
        data,
        theme: { ...theme, ...overrides },
        templateId: template.id,
      }),
    );

  it("renders empty data", async () => {
    expect((await render(emptyResume())).length).toBeGreaterThan(0);
  });

  it("renders sample on Letter", async () => {
    expect(
      (await render(sampleResume, { pageSize: "LETTER" })).length,
    ).toBeGreaterThan(0);
  });

  it("has extractable text in reading order (ATS)", async () => {
    const text = await pdfText(await render());
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

  it("contacts are text (ATS)", async () => {
    const text = await pdfText(await render());
    expect(text).toContain(sampleResume.profile.phone);
    expect(text).toContain("linkedin.com/in/johndoe");
  });

  it("skips hidden sections; headings extract as words at small sizes", async () => {
    const text = (
      await pdfText(
        await render(
          {
            ...sampleResume,
            layout: { ...sampleResume.layout, hidden: ["awards"] },
          },
          { font: "eb-garamond", baseSize: 8, density: "compact" },
        ),
      )
    ).toLowerCase();
    expect(text).not.toContain(sampleResume.awards[0].title.toLowerCase());
    expect(text).toContain(sampleResume.customSections[0].title.toLowerCase());
  });

  it("long resume spans 3+ pages, keeps every entry", async () => {
    const pages = await pdfPages(await render(longResume));
    expect(pages.length).toBeGreaterThanOrEqual(3);
    const text = pages.join("\n");
    const positions = longResume.experience.map((e) => text.indexOf(e.role));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });
});

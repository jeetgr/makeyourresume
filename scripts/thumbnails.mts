import fs from "node:fs/promises";
import path from "node:path";
import { createCanvas } from "@napi-rs/canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

import { sampleResume } from "@/lib/resume/sample";
import { renderResumeToBuffer } from "@/pdf/engine";
import { registerFonts } from "@/pdf/fonts";
import { templateCatalog, templateTheme } from "@/templates/catalog";

/** Renders page 1 of each template w/ sample data → `public/templates/<id>.png`. */
const WIDTH = 600;
const outDir = process.argv[2] ?? "public/templates";

registerFonts(path.resolve("public"));
await fs.mkdir(outDir, { recursive: true });

for (const template of templateCatalog) {
  const buffer = await renderResumeToBuffer({
    data: sampleResume,
    theme: templateTheme(template),
    templateId: template.id,
  });
  const doc = await getDocument({ data: new Uint8Array(buffer) }).promise;
  const page = await doc.getPage(1);
  const viewport = page.getViewport({
    scale: WIDTH / page.getViewport({ scale: 1 }).width,
  });
  const canvas = createCanvas(
    Math.ceil(viewport.width),
    Math.ceil(viewport.height),
  );
  await page.render({
    canvas: canvas as unknown as HTMLCanvasElement,
    viewport,
  }).promise;

  const file = path.join(outDir, `${template.id}.png`);
  await fs.writeFile(file, canvas.toBuffer("image/png"));
  console.log(file);
}

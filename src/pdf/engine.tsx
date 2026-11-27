import { pdf, renderToBuffer } from "@react-pdf/renderer";

import type { ResumeData } from "@/lib/resume/schema";
import type { Theme } from "@/lib/resume/theme";
import { getTemplateDocument } from "@/templates/registry";

export type RenderInput = {
  data: ResumeData;
  theme: Theme;
  templateId?: string | null;
};

function resumeElement({ data, theme, templateId }: RenderInput) {
  const Document = getTemplateDocument(templateId);
  return <Document data={data} theme={theme} />;
}

/** The only place that knows the PDF engine's render API. */
export const renderResume = (input: RenderInput) =>
  pdf(resumeElement(input)).toBlob();

/** Node only (tests, thumbnail script). */
export const renderResumeToBuffer = (input: RenderInput) =>
  renderToBuffer(resumeElement(input));

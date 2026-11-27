"use client";

import { templateComponents } from "@/lib/templateList";

import { useResumeDoc } from "./resume-doc";

export const DEFAULT_TEMPLATE_ID = "template-1";

/** Live HTML preview (temporary until the PDF preview in P8). */
export function EditorPreview() {
  const { data, theme, templateId } = useResumeDoc((s) => s);
  const Template =
    templateComponents[templateId ?? DEFAULT_TEMPLATE_ID] ??
    templateComponents[DEFAULT_TEMPLATE_ID]!;

  return (
    <div className="overflow-hidden rounded border">
      <Template data={data} theme={theme} />
    </div>
  );
}

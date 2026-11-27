"use client";

import { templateComponents } from "@/lib/templateList";
import { sampleResume } from "@/lib/resume/sample";
import { useResumeData, useTheme } from "@/stores/resume-store";

type LocalTemplateProps = {
  templateId: string;
  /** Render demo content (gallery) with the user's theme. */
  sample?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

/** Template rendered from the local resume store. */
export function LocalTemplate({ templateId, sample, ref }: LocalTemplateProps) {
  const data = useResumeData();
  const theme = useTheme();
  const Template = templateComponents[templateId];

  if (!Template) {
    return <div className="rounded border p-4">Template not found</div>;
  }

  return (
    <Template data={sample ? sampleResume : data} theme={theme} ref={ref} />
  );
}

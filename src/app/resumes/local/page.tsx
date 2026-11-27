"use client";

import { localResumeDoc } from "@/stores/resume-store";

import { Editor } from "@/features/editor/editor";
import { ResumeDocProvider } from "@/features/editor/resume-doc";

export default function LocalResumePage() {
  return (
    <ResumeDocProvider value={localResumeDoc}>
      <Editor />
    </ResumeDocProvider>
  );
}

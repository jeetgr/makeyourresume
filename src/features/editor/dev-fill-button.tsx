"use client";

import { FlaskConical } from "lucide-react";

import { sampleResume } from "@/lib/resume/sample";

import { Button } from "@/components/ui/button";
import { useResumeOps } from "./resume-doc";

/** Dev only: fills the resume with sample data. Render behind a `NODE_ENV` check so prod builds drop it. */
export function DevFillButton() {
  const { reset } = useResumeOps();

  return (
    <Button
      variant="secondary"
      className="fixed right-4 bottom-4 z-50 shadow-lg"
      onClick={() => reset(sampleResume)}
      data-testid="dev-fill"
    >
      <FlaskConical /> Fill sample
    </Button>
  );
}

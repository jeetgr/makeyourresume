import type { ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";

import type { ResumeData } from "@/lib/resume/schema";
import type { Theme } from "@/lib/resume/theme";

export type TemplateProps = { data: ResumeData; theme: Theme };

/** Templates import only `@react-pdf/renderer` + `src/pdf/*` (engine-agnostic rule). */
export type TemplateDef = {
  id: string;
  name: string;
  description: string;
  Document: (props: TemplateProps) => ReactElement<DocumentProps>;
  defaultTheme: Partial<Theme>;
};

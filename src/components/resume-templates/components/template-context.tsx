"use client";

import { createContext, use } from "react";

import type { ResumeData } from "@/lib/resume/schema";
import type { Theme } from "@/lib/resume/theme";

export type TemplateProps = {
  data: ResumeData;
  theme: Theme;
  ref?: React.Ref<HTMLDivElement>;
};

const TemplateContext = createContext<Omit<TemplateProps, "ref"> | null>(null);

export const TemplateProvider = TemplateContext;

export function useTemplate() {
  const value = use(TemplateContext);
  if (!value) throw new Error("useTemplate outside TemplateProvider");
  return value;
}

/** Whether a section has content and isn't hidden. */
export function useShowSection(section: string, length: number) {
  const { data } = useTemplate();
  return length > 0 && !data.layout.hidden.includes(section);
}

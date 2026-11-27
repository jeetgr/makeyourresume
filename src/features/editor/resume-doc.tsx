"use client";

import { createContext, use } from "react";

import type { ResumeDoc, ResumeDocState } from "@/lib/resume/doc";

const ResumeDocContext = createContext<ResumeDoc | null>(null);

export const ResumeDocProvider = ResumeDocContext;

function useDoc() {
  const doc = use(ResumeDocContext);
  if (!doc) throw new Error("useResumeDoc outside ResumeDocProvider");
  return doc;
}

/** Selects a slice of the current resume; re-renders only when it changes. */
export function useResumeDoc<T>(selector: (s: ResumeDocState) => T): T {
  return useDoc().useSelect(selector);
}

export const useResumeOps = () => useDoc().ops;

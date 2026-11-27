"use client";

import { createContext, use } from "react";

import { usePdf } from "@/pdf/use-pdf";

import { useResumeDoc } from "./resume-doc";

type PdfState = ReturnType<typeof usePdf>;

const PdfContext = createContext<PdfState | null>(null);

/** One render shared by preview and download. */
export function PdfProvider({ children }: { children: React.ReactNode }) {
  const input = useResumeDoc((s) => s);
  return <PdfContext value={usePdf(input)}>{children}</PdfContext>;
}

export function usePdfState() {
  const state = use(PdfContext);
  if (!state) throw new Error("usePdfState outside PdfProvider");
  return state;
}

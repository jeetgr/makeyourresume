"use client";

import { PdfPreview } from "@/components/pdf-preview";

import { usePdfState } from "./pdf-context";

export function EditorPreview() {
  const { blob, loading, error } = usePdfState();
  return <PdfPreview blob={blob} loading={loading} error={error} />;
}

"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, TriangleAlert } from "lucide-react";

import { cn } from "@/utils/cn";

let pdfjs: Promise<typeof import("pdfjs-dist")> | null = null;

/** pdf.js touches browser globals on import, so load it lazily on the client. */
const loadPdfjs = () =>
  (pdfjs ??= import("pdfjs-dist").then((lib) => {
    lib.GlobalWorkerOptions.workerPort = new Worker(
      new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url),
      { type: "module" },
    );
    return lib;
  }));

type PdfPreviewProps = {
  blob: Blob | null;
  loading?: boolean;
  error?: string | null;
  className?: string;
};

/** All pages as canvases, fit to width; old pages stay until new ones are drawn. */
export function PdfPreview({
  blob,
  loading,
  error,
  className,
}: PdfPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry.contentRect.width)),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!blob || !width) return;
    let cancelled = false;

    (async () => {
      const lib = await loadPdfjs();
      const task = lib.getDocument({ data: await blob.arrayBuffer() });
      const doc = await task.promise;
      try {
        const dpr = window.devicePixelRatio || 1;
        const canvases: HTMLCanvasElement[] = [];

        for (let i = 1; i <= doc.numPages && !cancelled; i++) {
          const page = await doc.getPage(i);
          const scale = width / page.getViewport({ scale: 1 }).width;
          const viewport = page.getViewport({ scale: scale * dpr });
          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          canvas.className = "w-full bg-white shadow-md";
          canvas.setAttribute("aria-label", `Page ${i}`);
          await page.render({ canvas, viewport }).promise;
          canvases.push(canvas);
        }

        if (!cancelled) pagesRef.current?.replaceChildren(...canvases);
      } finally {
        await task.destroy();
      }
    })().catch((err) => console.error("PDF preview failed", err));

    return () => {
      cancelled = true;
    };
  }, [blob, width]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/** Filled imperatively; must have no React children. */}
      <div
        ref={pagesRef}
        className="space-y-4"
        role="img"
        aria-label="Resume preview"
      />
      {!blob && (
        <div className="aspect-[1/1.414] w-full animate-pulse bg-muted" />
      )}

      {(loading || error) && (
        <div
          className="absolute top-2 right-2 flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-xs shadow"
          role="status"
        >
          {error ? (
            <>
              <TriangleAlert className="size-3.5 text-destructive" />
              Preview failed
            </>
          ) : (
            <>
              <LoaderCircle className="size-3.5 animate-spin" />
              Rendering
            </>
          )}
        </div>
      )}
    </div>
  );
}

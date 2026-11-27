"use client";
import { useResizeDetector } from "react-resize-detector";

export default function TemplateWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { width, ref } = useResizeDetector<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={
        {
          "--WIDTH": (width ?? 0) * 0.75 + "pt",
        } as React.CSSProperties
      }
    >
      {width && children}
    </div>
  );
}

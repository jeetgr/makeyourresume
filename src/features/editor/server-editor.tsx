"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { ResumeDocState } from "@/lib/resume/doc";

import { Editor } from "./editor";
import { ResumeDocProvider } from "./resume-doc";
import { ResumeTitle } from "./resume-title";
import { SaveIndicator } from "./save-indicator";
import { createServerResumeDoc } from "./server-resume-doc";

export function ServerEditor({
  id,
  title,
  initial,
}: {
  id: string;
  title: string;
  initial: ResumeDocState & { updatedAt: string };
}) {
  const [handle] = useState(() => createServerResumeDoc(id, initial));

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") handle.flush();
    };
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!handle.hasUnsaved()) return;
      handle.flush();
      e.preventDefault();
    };
    const unsubscribe = handle.onStatus((status) => {
      if (status === "conflict") {
        toast.error("This resume was changed in another tab.", {
          action: { label: "Reload", onClick: () => location.reload() },
          duration: Infinity,
        });
      }
    });
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("beforeunload", onBeforeUnload);
      unsubscribe();
      handle.flush();
    };
  }, [handle]);

  return (
    <ResumeDocProvider value={handle.doc}>
      <Editor
        title={<ResumeTitle id={id} initial={title} />}
        status={<SaveIndicator handle={handle} />}
      />
    </ResumeDocProvider>
  );
}

"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";

import type { ResumeDocState } from "@/lib/resume/doc";
import { toJsonResume } from "@/lib/resume/jsonresume";
import {
  IMPORT_ERRORS,
  parseImport,
  toResumeFile,
} from "@/lib/resume/transfer";
import { downloadJson, fileSlug } from "@/utils/download";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useResumeDoc, useResumeOps } from "./resume-doc";

/** Editor import (replace w/ confirm) + JSON / JSON Resume export; render `elements` once. */
export function useImportExport() {
  const state = useResumeDoc((s) => s);
  const { load } = useResumeOps();
  const input = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<ResumeDocState | null>(null);

  const { firstName, lastName } = state.data.profile;
  const name = fileSlug("resume", firstName, lastName);

  async function onFile(file?: File) {
    if (!file) return;
    const result = parseImport(await file.text(), state);
    if (result.ok) setPending(result.value);
    else toast.error(IMPORT_ERRORS[result.error]);
  }

  const elements = (
    <>
      <input
        ref={input}
        type="file"
        accept=".json,application/json"
        hidden
        data-testid="import-input"
        onChange={(e) => {
          void onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <AlertDialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace current resume?</AlertDialogTitle>
            <AlertDialogDescription>
              The imported file replaces this resume&apos;s content, theme and
              template. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pending) load(pending);
                setPending(null);
                toast.success("Resume imported");
              }}
            >
              Replace
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );

  return {
    openImport: () => input.current?.click(),
    exportJson: () => downloadJson(toResumeFile(state), `${name}.json`),
    exportJsonResume: () =>
      downloadJson(toJsonResume(state.data), `${name}.jsonresume.json`),
    elements,
  };
}

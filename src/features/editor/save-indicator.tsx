"use client";

import { Cloud, CloudAlert, CloudUpload, RefreshCw } from "lucide-react";

import { cn } from "@/utils/cn";

import type { ServerResumeHandle } from "./server-resume-doc";

export function SaveIndicator({ handle }: { handle: ServerResumeHandle }) {
  const status = handle.useStatus();

  if (status === "conflict") {
    return (
      <button
        type="button"
        onClick={() => location.reload()}
        className="flex items-center gap-1.5 text-sm text-destructive hover:underline"
      >
        <RefreshCw className="size-4" />
        Changed elsewhere · reload
      </button>
    );
  }

  if (status === "error") {
    return (
      <button
        type="button"
        onClick={() => handle.flush()}
        className="flex items-center gap-1.5 text-sm text-destructive hover:underline"
      >
        <CloudAlert className="size-4" />
        Not saved · retry
      </button>
    );
  }

  const saving = status !== "saved";
  const Icon = saving ? CloudUpload : Cloud;

  return (
    <span
      role="status"
      className={cn(
        "flex items-center gap-1.5 text-sm text-muted-foreground",
        saving && "animate-pulse",
      )}
    >
      <Icon className="size-4" />
      {saving ? "Saving…" : "Saved"}
    </span>
  );
}

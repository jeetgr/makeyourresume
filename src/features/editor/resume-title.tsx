"use client";

import { useState } from "react";
import { toast } from "sonner";

import { renameResume } from "@/server/resumes";

/** Inline-editable title; saves on blur/Enter, reverts on Escape or failure. */
export function ResumeTitle({ id, initial }: { id: string; initial: string }) {
  const [saved, setSaved] = useState(initial);
  const [value, setValue] = useState(initial);

  async function commit() {
    const title = value.trim();
    if (!title || title === saved) return setValue(saved);
    const res = await renameResume(id, title);
    if (res.ok) setSaved(title);
    else {
      setValue(saved);
      toast.error("Couldn't rename resume");
    }
  }

  return (
    <input
      aria-label="Resume title"
      value={value}
      maxLength={120}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          setValue(saved);
          requestAnimationFrame(() => e.currentTarget?.blur());
        }
      }}
      className="field-sizing-content max-w-full min-w-24 truncate rounded-md border border-transparent bg-transparent px-1 font-display text-3xl tracking-tight outline-none hover:border-input focus:border-input focus:ring-2 focus:ring-ring/30"
    />
  );
}

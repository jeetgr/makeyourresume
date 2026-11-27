"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp } from "lucide-react";
import { toast } from "sonner";

import { IMPORT_ERRORS, parseImport } from "@/lib/resume/transfer";
import { createResume } from "@/server/resumes";
import { Button } from "@/components/ui/button";

/** Own JSON / JSON Resume file → new saved resume. */
export function ImportResumeButton() {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onFile(file?: File) {
    if (!file) return;
    const parsed = parseImport(await file.text());
    if (!parsed.ok) return toast.error(IMPORT_ERRORS[parsed.error]);

    const { firstName, lastName } = parsed.value.data.profile;
    const title =
      [firstName, lastName].join(" ").trim() ||
      file.name.replace(/\.json$/i, "");

    setBusy(true);
    const res = await createResume({
      content: parsed.value,
      title: title.slice(0, 120),
    });
    if (res.ok) router.push(`/resumes/${res.id}`);
    else {
      setBusy(false);
      toast.error(
        res.error === "too_large"
          ? IMPORT_ERRORS.too_large
          : "Couldn't import resume",
      );
    }
  }

  return (
    <>
      <Button
        variant="outline"
        disabled={busy}
        onClick={() => input.current?.click()}
      >
        <FileUp /> {busy ? "Importing…" : "Import"}
      </Button>
      <input
        ref={input}
        type="file"
        accept=".json,application/json"
        hidden
        onChange={(e) => {
          void onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </>
  );
}

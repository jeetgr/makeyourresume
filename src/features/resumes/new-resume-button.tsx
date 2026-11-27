"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { createResume } from "@/server/resumes";
import { templateCatalog } from "@/templates/catalog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TemplateThumbnail } from "@/components/template-thumbnail";

export function NewResumeButton() {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);

  async function create(templateId: string) {
    setPending(templateId);
    const res = await createResume({ templateId });
    if (res.ok) router.push(`/resumes/${res.id}`);
    else {
      setPending(null);
      toast.error("Couldn't create resume");
    }
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button />}>
        <Plus /> New resume
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pick a template</DialogTitle>
          <DialogDescription>
            You can switch templates anytime.
          </DialogDescription>
        </DialogHeader>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {templateCatalog.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                disabled={pending !== null}
                onClick={() => create(t.id)}
                className="group block w-full space-y-1 rounded text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-60"
              >
                <div className="overflow-hidden rounded border-2 transition group-hover:border-primary">
                  <TemplateThumbnail templateId={t.id} />
                </div>
                <p className="text-sm font-semibold">
                  {pending === t.id ? "Creating…" : t.name}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

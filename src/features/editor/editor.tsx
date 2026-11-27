"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Download,
  EllipsisVertical,
  LayoutTemplate,
  RotateCcw,
} from "lucide-react";

import { cn } from "@/utils/cn";
import { renderPdf } from "@/pdf/use-pdf";
import { getTemplateMeta, templateCatalog } from "@/templates/catalog";

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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DevFillButton } from "./dev-fill-button";
import { EditorPreview } from "./editor-preview";
import { PdfProvider, usePdfState } from "./pdf-context";
import { ProfilePanel } from "./profile-panel";
import { useResumeDoc, useResumeOps } from "./resume-doc";
import { SectionsList } from "./sections-list";
import { ThemeEditor } from "./theme-editor";

type Tab = "edit" | "preview";

/** `title`/`status` slots let the saved-resume page add rename + save state. */
export function Editor({
  title = <h1 className="text-2xl font-bold">My Resume</h1>,
  status,
}: {
  title?: React.ReactNode;
  status?: React.ReactNode;
}) {
  const [tab, setTab] = useState<Tab>("edit");

  return (
    <PdfProvider>
      <section className="py-20">
        <TopBar title={title} status={status} />

        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as Tab)}
          className="mb-4 lg:hidden"
        >
          <TabsList className="w-full">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className={cn("space-y-3", tab !== "edit" && "hidden lg:block")}>
            <ProfilePanel />
            <SectionsList />
          </div>
          <div className={cn(tab !== "preview" && "hidden lg:block")}>
            <div className="lg:sticky lg:top-20">
              <EditorPreview />
            </div>
          </div>
        </div>
      </section>
      {process.env.NODE_ENV === "development" && <DevFillButton />}
    </PdfProvider>
  );
}

function TopBar({
  title,
  status,
}: {
  title: React.ReactNode;
  status?: React.ReactNode;
}) {
  const { reset } = useResumeOps();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <div className="mr-auto flex min-w-0 items-center gap-3">
        {title}
        {status}
      </div>

      <TemplateSelect />
      <ThemeEditor />
      <DownloadButton />

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="More actions" />
          }
        >
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem render={<Link href="/templates" />}>
            <LayoutTemplate /> Browse templates
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmReset(true)}
          >
            <RotateCcw /> Reset resume
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset resume?</AlertDialogTitle>
            <AlertDialogDescription>
              All content is cleared. Theme and template are kept. This
              can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                reset();
                setConfirmReset(false);
              }}
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const templateItems = templateCatalog.map((t) => ({
  value: t.id,
  label: t.name,
}));

function TemplateSelect() {
  const templateId = getTemplateMeta(useResumeDoc((s) => s.templateId)).id;
  const { setTemplate } = useResumeOps();

  return (
    <Select
      items={templateItems}
      value={templateId}
      onValueChange={(id) => id && setTemplate(id)}
    >
      <SelectTrigger className="w-36" aria-label="Template">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {templateItems.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const fileName = (...parts: string[]) =>
  ["resume", ...parts]
    .join("-")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") + ".pdf";

/** Saves the previewed PDF; renders a fresh one if the preview is behind. */
function DownloadButton() {
  const { blob, loading } = usePdfState();
  const input = useResumeDoc((s) => s);
  const [busy, setBusy] = useState(false);

  async function download() {
    setBusy(true);
    try {
      const file = !loading && blob ? blob : await renderPdf(input);
      const { firstName, lastName } = input.data.profile;
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName(firstName, lastName);
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      toast.error("Couldn't create the PDF. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button onClick={download} disabled={busy}>
      <Download /> Download
    </Button>
  );
}

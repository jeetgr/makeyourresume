"use client";

import { useState } from "react";
import Link from "next/link";
import {
  EllipsisVertical,
  LayoutTemplate,
  Printer,
  RotateCcw,
} from "lucide-react";

import { cn } from "@/utils/cn";
import { templatesList } from "@/lib/templateList";

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_TEMPLATE_ID, EditorPreview } from "./editor-preview";
import { ProfilePanel } from "./profile-panel";
import { useResumeDoc, useResumeOps } from "./resume-doc";
import { SectionsList } from "./sections-list";

type Tab = "edit" | "preview";

export function Editor() {
  const [tab, setTab] = useState<Tab>("edit");

  return (
    <section className="py-20">
      <TopBar />

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
  );
}

function TopBar() {
  const templateId = useResumeDoc((s) => s.templateId) ?? DEFAULT_TEMPLATE_ID;
  const templateName = templatesList.find((t) => t.id === templateId)?.name;
  const { reset } = useResumeOps();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <div className="mr-auto">
        <h1 className="text-2xl font-bold">My Resume</h1>
        {templateName && (
          <p className="text-sm text-muted-foreground">{templateName}</p>
        )}
      </div>

      <Button
        variant="outline"
        nativeButton={false}
        render={<Link href="/templates" />}
      >
        <LayoutTemplate /> Templates
      </Button>
      <Button
        nativeButton={false}
        render={<Link href="/resumes/local/print" />}
      >
        <Printer /> Print
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="More actions" />
          }
        >
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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

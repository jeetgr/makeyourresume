"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteResume, duplicateResume, renameResume } from "@/server/resumes";
import { timeAgo } from "@/utils/time-ago";
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { TemplateThumbnail } from "@/components/template-thumbnail";

type Resume = {
  id: string;
  title: string;
  templateId: string;
  updatedAt: Date;
};

export function ResumeCard({
  resume,
  index,
}: {
  resume: Resume;
  index: number;
}) {
  const router = useRouter();
  const [dialog, setDialog] = useState<"rename" | "delete" | null>(null);
  const [title, setTitle] = useState(resume.title);

  async function run(action: () => Promise<{ ok: boolean }>, error: string) {
    const res = await action();
    if (!res.ok) toast.error(error);
    setDialog(null);
    router.refresh();
  }

  return (
    <li
      className="group relative motion-safe:animate-blur-fade"
      style={{ animationDelay: `${Math.min(index, 10) * 60}ms` }}
    >
      <Link
        href={`/resumes/${resume.id}`}
        className="block space-y-2 rounded focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm transition duration-300 group-hover:-translate-y-0.5 group-hover:border-highlight group-hover:shadow-[0_10px_30px_-8px_color-mix(in_oklab,var(--highlight)_70%,transparent)]">
          <TemplateThumbnail templateId={resume.templateId} eager={index < 4} />
        </div>
        <div className="pr-9">
          <p className="truncate font-semibold">{resume.title}</p>
          <p className="text-sm text-muted-foreground">
            Edited {timeAgo(resume.updatedAt)}
          </p>
        </div>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Actions for ${resume.title}`}
              className="absolute right-0 bottom-3"
            />
          }
        >
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setDialog("rename")}>
            <Pencil /> Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              run(() => duplicateResume(resume.id), "Couldn't duplicate resume")
            }
          >
            <Copy /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDialog("delete")}
          >
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={dialog === "rename"}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <DialogContent>
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              run(
                () => renameResume(resume.id, title),
                "Couldn't rename resume",
              );
            }}
          >
            <DialogHeader>
              <DialogTitle>Rename resume</DialogTitle>
            </DialogHeader>
            <Input
              aria-label="Title"
              value={title}
              maxLength={120}
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
            />
            <DialogFooter>
              <Button type="submit" disabled={!title.trim()}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={dialog === "delete"}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{resume.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() =>
                run(() => deleteResume(resume.id), "Couldn't delete resume")
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  );
}

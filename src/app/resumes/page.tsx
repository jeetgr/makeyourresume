import type { Metadata } from "next";
import { FileText } from "lucide-react";

import { ImportResumeButton } from "@/features/resumes/import-resume-button";
import { MigrateGuestEffect } from "@/features/resumes/migrate-guest-effect";
import { NewResumeButton } from "@/features/resumes/new-resume-button";
import { ResumeCard } from "@/features/resumes/resume-card";
import { listForUser } from "@/server/resume-repo";
import { requireUser } from "@/server/session";

export const metadata: Metadata = { title: "My resumes" };

export default async function ResumesPage({
  searchParams,
}: PageProps<"/resumes">) {
  const user = await requireUser();
  const [resumes, { migrate }] = await Promise.all([
    listForUser(user.id),
    searchParams,
  ]);

  return (
    <section className="space-y-6 py-20">
      {migrate === "1" && <MigrateGuestEffect />}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-accent">My resumes</h1>
        <div className="flex gap-2">
          <ImportResumeButton />
          <NewResumeButton />
        </div>
      </div>

      {resumes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed py-16 text-center">
          <FileText className="size-10 text-muted-foreground" />
          <p className="font-semibold">No resumes yet</p>
          <p className="text-sm text-muted-foreground">
            Create one from a template or import a JSON file.
          </p>
          <div className="flex gap-2">
            <ImportResumeButton />
            <NewResumeButton />
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {resumes.map((resume, i) => (
            <ResumeCard key={resume.id} resume={resume} priority={i < 4} />
          ))}
        </ul>
      )}
    </section>
  );
}

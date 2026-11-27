import type { Metadata } from "next";

import { ImportResumeButton } from "@/features/resumes/import-resume-button";
import { MigrateGuestEffect } from "@/features/resumes/migrate-guest-effect";
import { NewResumeButton } from "@/features/resumes/new-resume-button";
import { ResumeCard } from "@/features/resumes/resume-card";
import { listForUser } from "@/server/resume-repo";
import { requireUser } from "@/server/session";
import { LogoMark } from "@/components/logo-mark";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "My resumes",
  robots: { index: false },
};

export default async function ResumesPage({
  searchParams,
}: PageProps<"/resumes">) {
  const user = await requireUser();
  const [resumes, { migrate }] = await Promise.all([
    listForUser(user.id),
    searchParams,
  ]);

  return (
    <section className="space-y-8 pt-28 pb-20">
      {migrate === "1" && <MigrateGuestEffect />}
      <PageHeading
        title="My resumes"
        actions={
          <>
            <ImportResumeButton />
            <NewResumeButton />
          </>
        }
      />

      {resumes.length === 0 ? (
        <div className="relative flex flex-col items-center gap-3 overflow-hidden rounded-3xl border border-dashed py-20 text-center">
          <div aria-hidden className="absolute inset-0 -z-10 bg-dot-grid" />
          <LogoMark animated className="size-16" />
          <p className="font-display text-3xl tracking-tight">No resumes yet</p>
          <p className="text-sm text-muted-foreground">
            Start from a template or import a JSON Resume file.
          </p>
          <div className="flex gap-2">
            <ImportResumeButton />
            <NewResumeButton />
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {resumes.map((resume, i) => (
            <ResumeCard key={resume.id} resume={resume} index={i} />
          ))}
        </ul>
      )}
    </section>
  );
}

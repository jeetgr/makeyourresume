import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServerEditor } from "@/features/editor/server-editor";
import { resumeIdSchema } from "@/server/resume-input";
import { findForUser } from "@/server/resume-repo";
import { requireUser } from "@/server/session";

export const metadata: Metadata = {
  title: "Edit resume",
  robots: { index: false },
};

export default async function ResumePage({
  params,
}: PageProps<"/resumes/[id]">) {
  const { id } = await params;
  const user = await requireUser();
  if (!resumeIdSchema.safeParse(id).success) notFound();
  const resume = await findForUser(user.id, id);
  if (!resume) notFound();

  return (
    <ServerEditor
      key={resume.id}
      id={resume.id}
      title={resume.title}
      initial={{
        data: resume.data,
        theme: resume.theme,
        templateId: resume.templateId,
        updatedAt: resume.updatedAt.toISOString(),
      }}
    />
  );
}

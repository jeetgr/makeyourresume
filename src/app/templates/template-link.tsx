"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { createResume } from "@/server/resumes";
import { setTemplate } from "@/stores/resume-store";

/** Signed in → new saved resume with this template; guest → local editor. */
export function TemplateLink({
  templateId,
  className,
  children,
}: {
  templateId: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  async function onClick(e: React.MouseEvent) {
    if (!session) return setTemplate(templateId);
    e.preventDefault();
    const res = await createResume({ templateId });
    if (res.ok) router.push(`/resumes/${res.id}`);
    else toast.error("Couldn't create resume");
  }

  return (
    <Link href="/resumes/local" className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

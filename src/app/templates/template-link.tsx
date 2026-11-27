"use client";

import Link from "next/link";

import { setTemplate } from "@/stores/resume-store";

export function TemplateLink({
  templateId,
  className,
  children,
}: {
  templateId: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href="/resumes/local"
      className={className}
      onClick={() => setTemplate(templateId)}
    >
      {children}
    </Link>
  );
}

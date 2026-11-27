"use client";
import { useUser } from "@/stores/auth-store";
import { setTemplate } from "@/stores/resume-store";
import React from "react";
import { api } from "@/lib/api";

export const AddTemplate = ({
  children,
  templateId,
}: {
  children: React.ReactNode;
  templateId: string;
}) => {
  const user = useUser();
  const handleAddTemplate = () => {
    setTemplate(templateId);

    if (!user) {
      return;
    }

    api("/api/resumes", { body: { templateId } }).catch((err) =>
      console.error(err),
    );
  };

  return (
    <div aria-hidden onClick={handleAddTemplate}>
      {children}
    </div>
  );
};

"use client";
import React from "react";
import { api } from "@/lib/api";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/features/auth/authSlice";

export const AddTemplate = ({
  children,
  templateId,
}: {
  children: React.ReactNode;
  templateId: string;
}) => {
  const user = useAppSelector(selectUser);
  const handleAddTemplate = () => {
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

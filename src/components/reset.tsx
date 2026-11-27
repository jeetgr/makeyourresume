"use client";

import { useEffect } from "react";

import { useAppDispatch } from "@/redux/hooks";

import { resetSkippedSections } from "@/redux/features/skipped-sections/skippedSectionSlice";
import { resetStyles } from "@/redux/features/custom-styles/customStyleSlice";
import { resetResumeData } from "@/redux/features/resume-data/resumeDataSlice";

export default function Reset() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetResumeData());
    dispatch(resetStyles({}));
    dispatch(resetSkippedSections());
  }, [dispatch]);

  return null;
}

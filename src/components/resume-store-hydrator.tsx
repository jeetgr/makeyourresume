"use client";

import { useEffect } from "react";

import { rehydrateResumeStore } from "@/stores/resume-store";

/** Loads the persisted resume after hydration, so SSR markup matches the empty store. */
export function ResumeStoreHydrator() {
  useEffect(() => {
    rehydrateResumeStore();
  }, []);

  return null;
}

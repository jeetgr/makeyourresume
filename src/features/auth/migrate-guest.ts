import { isEmptyResume } from "@/lib/resume/empty";
import { createResume } from "@/server/resumes";
import { getTemplateMeta } from "@/templates/catalog";
import {
  clearLocalResume,
  getLocalResume,
  rehydrateResumeStore,
} from "@/stores/resume-store";

let running: Promise<string | null> | null = null;

/**
 * Guest → account (Q22): a non-empty local resume becomes a saved one and local is cleared.
 * Returns the new id, or `null` if there was nothing to move. Deduped (StrictMode, re-renders).
 */
export function migrateGuestResume() {
  running ??= (async () => {
    await rehydrateResumeStore();
    const local = getLocalResume();
    if (isEmptyResume(local.data)) return null;

    const res = await createResume({
      content: {
        data: local.data,
        theme: local.theme,
        templateId: getTemplateMeta(local.templateId).id,
      },
      title: "My resume",
    });
    if (!res.ok) throw new Error(res.error);
    clearLocalResume();
    return res.id;
  })().finally(() => {
    running = null;
  });
  return running;
}

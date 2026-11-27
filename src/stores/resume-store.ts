import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";

import type { ResumeDoc, ResumeDocState } from "@/lib/resume/doc";
import { createDocOps } from "@/lib/resume/doc-ops";
import { emptyResume, isEmptyResume } from "@/lib/resume/empty";
import { migrate } from "@/lib/resume/migrate";
import { themeSchema } from "@/lib/resume/theme";
import { getTemplateMeta, templateTheme } from "@/templates/catalog";

type ResumeState = ResumeDocState;

const initialTheme = templateTheme(getTemplateMeta(null));

/** Local (signed-out) resume. Hydrated client-side by `ResumeStoreHydrator`. */
const useResumeStore = create<ResumeState>()(
  persist(
    immer(() => ({
      data: emptyResume(),
      theme: initialTheme,
      templateId: null,
    })),
    {
      name: "myr:local-resume",
      version: 1,
      skipHydration: true,
      /** Future persist versions transform here; `merge` validates either way. */
      migrate: (persisted) => persisted as ResumeState,
      merge: (persisted, current) => {
        const state = (persisted ?? {}) as Partial<ResumeState>;
        return {
          ...current,
          data: migrate(state.data),
          theme: themeSchema.catch(initialTheme).parse(state.theme),
          templateId: state.templateId ?? null,
        };
      },
    },
  ),
);

export const rehydrateResumeStore = () => useResumeStore.persist.rehydrate();

/** Gallery pick: sets the template; a still-empty resume also takes its default theme. */
export const startLocalResume = (templateId: string) =>
  useResumeStore.setState((s) => {
    s.templateId = templateId;
    if (isEmptyResume(s.data))
      s.theme = templateTheme(getTemplateMeta(templateId));
  });

/** Persisted guest resume (after `rehydrateResumeStore`). */
export const getLocalResume = (): ResumeDocState => {
  const { data, theme, templateId } = useResumeStore.getState();
  return { data, theme, templateId };
};

export const clearLocalResume = () =>
  useResumeStore.setState({
    data: emptyResume(),
    theme: initialTheme,
    templateId: null,
  });

export const localResumeDoc: ResumeDoc = {
  useSelect: (selector) => useResumeStore(useShallow(selector)),
  ops: createDocOps(useResumeStore),
};

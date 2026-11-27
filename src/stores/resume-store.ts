import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";

import type { ResumeDoc, ResumeDocState } from "@/lib/resume/doc";
import { createDocOps } from "@/lib/resume/doc-ops";
import { emptyResume } from "@/lib/resume/empty";
import { migrate } from "@/lib/resume/migrate";
import { defaultTheme, themeSchema } from "@/lib/resume/theme";

type ResumeState = ResumeDocState;

/** Local (signed-out) resume. Hydrated client-side by `ResumeStoreHydrator`. */
const useResumeStore = create<ResumeState>()(
  persist(
    immer(() => ({
      data: emptyResume(),
      theme: defaultTheme,
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
          theme: themeSchema.catch(defaultTheme).parse(state.theme),
          templateId: state.templateId ?? null,
        };
      },
    },
  ),
);

export const rehydrateResumeStore = () => useResumeStore.persist.rehydrate();

export const setTemplate = (templateId: string) =>
  useResumeStore.setState({ templateId });

/** Persisted guest resume (after `rehydrateResumeStore`). */
export const getLocalResume = (): ResumeDocState => {
  const { data, theme, templateId } = useResumeStore.getState();
  return { data, theme, templateId };
};

export const clearLocalResume = () =>
  useResumeStore.setState({
    data: emptyResume(),
    theme: defaultTheme,
    templateId: null,
  });

export const localResumeDoc: ResumeDoc = {
  useSelect: (selector) => useResumeStore(useShallow(selector)),
  ops: createDocOps(useResumeStore),
};

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { emptyResume } from "@/lib/resume/empty";
import { migrate } from "@/lib/resume/migrate";
import * as ops from "@/lib/resume/ops";
import type {
  ListItem,
  ListKey,
  Profile,
  ResumeData,
} from "@/lib/resume/schema";
import { defaultTheme, themeSchema, type Theme } from "@/lib/resume/theme";

type ResumeState = {
  data: ResumeData;
  theme: Theme;
  templateId: string | null;
};

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

export const useResumeData = () => useResumeStore((s) => s.data);
export const useProfile = () => useResumeStore((s) => s.data.profile);
export const useList = <K extends ListKey>(key: K) =>
  useResumeStore((s) => s.data[key] as ListItem<K>[]);
export const useIsSectionHidden = (section: string) =>
  useResumeStore((s) => s.data.layout.hidden.includes(section));
export const useTheme = () => useResumeStore((s) => s.theme);

const setData = (fn: (d: ResumeData) => ResumeData) =>
  useResumeStore.setState((s) => {
    s.data = fn(s.data);
  });

export const setProfile = (patch: Partial<Profile>) =>
  setData((d) => ops.setProfile(d, patch));

export const addItem = <K extends ListKey>(
  key: K,
  item?: Partial<ListItem<K>>,
) => setData((d) => ops.addItem(d, key, item));

export const updateItem = <K extends ListKey>(
  key: K,
  id: string,
  patch: Partial<ListItem<K>>,
) => setData((d) => ops.updateItem(d, key, id, patch));

export const removeItem = (key: ListKey, id: string) =>
  setData((d) => ops.removeItem(d, key, id));

export const moveItem = (key: ListKey, from: number, to: number) =>
  setData((d) => ops.moveItem(d, key, from, to));

export const toggleSection = (section: string, hidden?: boolean) =>
  setData((d) => ops.toggleSection(d, section, hidden));

export const setTheme = (patch: Partial<Theme>) =>
  useResumeStore.setState((s) => {
    Object.assign(s.theme, patch);
  });

export const setTemplate = (templateId: string) =>
  useResumeStore.setState({ templateId });

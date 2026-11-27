import { emptyResume } from "./empty";
import type { ResumeDoc, ResumeDocState } from "./doc";
import * as ops from "./ops";
import type { ResumeData } from "./schema";

type DraftSetter = {
  setState: (recipe: (draft: ResumeDocState) => void) => void;
};

/** `ResumeDoc["ops"]` over any immer-backed zustand store holding `ResumeDocState`. */
export function createDocOps(store: DraftSetter): ResumeDoc["ops"] {
  const setData = (fn: (d: ResumeData) => ResumeData) =>
    store.setState((s) => {
      s.data = fn(s.data);
    });

  return {
    setProfile: (patch) => setData((d) => ops.setProfile(d, patch)),
    addItem: (key, item) => setData((d) => ops.addItem(d, key, item)),
    updateItem: (key, id, patch) =>
      setData((d) => ops.updateItem(d, key, id, patch)),
    removeItem: (key, id) => setData((d) => ops.removeItem(d, key, id)),
    duplicateItem: (key, id) => setData((d) => ops.duplicateItem(d, key, id)),
    moveItem: (key, from, to) => setData((d) => ops.moveItem(d, key, from, to)),
    toggleSection: (section, hidden) =>
      setData((d) => ops.toggleSection(d, section, hidden)),
    moveSection: (from, to) => setData((d) => ops.moveSection(d, from, to)),
    reset: (data = emptyResume()) => setData(() => structuredClone(data)),
    setTheme: (patch) =>
      store.setState((s) => {
        Object.assign(s.theme, patch);
      }),
    load: ({ data, theme, templateId }) =>
      store.setState((s) => {
        s.data = structuredClone(data);
        s.theme = structuredClone(theme);
        s.templateId = templateId;
      }),
    setTemplate: (templateId) =>
      store.setState((s) => {
        s.templateId = templateId;
      }),
  };
}

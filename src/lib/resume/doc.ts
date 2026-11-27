import type { ListItem, ListKey, Profile, ResumeData } from "./schema";
import type { Theme } from "./theme";

export type ResumeDocState = {
  data: ResumeData;
  theme: Theme;
  templateId: string | null;
};

type ResumeDocOps = {
  setProfile: (patch: Partial<Profile>) => void;
  addItem: <K extends ListKey>(key: K, item?: Partial<ListItem<K>>) => void;
  updateItem: <K extends ListKey>(
    key: K,
    id: string,
    patch: Partial<ListItem<K>>,
  ) => void;
  removeItem: (key: ListKey, id: string) => void;
  duplicateItem: (key: ListKey, id: string) => void;
  moveItem: (key: ListKey, from: number, to: number) => void;
  toggleSection: (section: string, hidden?: boolean) => void;
  moveSection: (from: number, to: number) => void;
  setTheme: (patch: Partial<Theme>) => void;
  setTemplate: (templateId: string) => void;
  /** Replaces content (default: empty); theme and template are kept. */
  reset: (data?: ResumeData) => void;
};

/**
 * Storage-agnostic resume handle used by the editor.
 * `useSelect` is a hook; results are shallow-compared.
 */
export type ResumeDoc = {
  useSelect: <T>(selector: (s: ResumeDocState) => T) => T;
  ops: ResumeDocOps;
};

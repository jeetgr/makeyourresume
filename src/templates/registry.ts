import { getTemplateMeta } from "./catalog";
import { SidebarDocument } from "./sidebar";
import type { TemplateDocument } from "./types";

/** PDF documents by template id; every catalog entry needs one. */
export const templateDocuments: Record<string, TemplateDocument> = {
  sidebar: SidebarDocument,
};

export const getTemplateDocument = (id?: string | null) =>
  templateDocuments[getTemplateMeta(id).id];

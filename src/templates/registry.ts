import { getTemplateMeta } from "./catalog";
import { ClassicDocument } from "./classic";
import { ModernDocument } from "./modern";
import { SidebarDocument } from "./sidebar";
import type { TemplateDocument } from "./types";

/** PDF documents by template id; every catalog entry needs one. */
export const templateDocuments: Record<string, TemplateDocument> = {
  classic: ClassicDocument,
  modern: ModernDocument,
  sidebar: SidebarDocument,
};

export const getTemplateDocument = (id?: string | null) =>
  templateDocuments[getTemplateMeta(id).id];

import { getTemplateMeta } from "./catalog";
import { ClassicDocument } from "./classic";
import { ExecutiveDocument } from "./executive";
import { MinimalDocument } from "./minimal";
import { ModernDocument } from "./modern";
import { SidebarDocument } from "./sidebar";
import type { TemplateDocument } from "./types";

/** PDF documents by template id; every catalog entry needs one. */
export const templateDocuments: Record<string, TemplateDocument> = {
  classic: ClassicDocument,
  modern: ModernDocument,
  minimal: MinimalDocument,
  executive: ExecutiveDocument,
  sidebar: SidebarDocument,
};

export const getTemplateDocument = (id?: string | null) =>
  templateDocuments[getTemplateMeta(id).id];

import {
  listItemSchemas,
  resumeDataSchema,
  type ListItem,
  type ListKey,
  type ResumeData,
} from "./schema";

export const emptyResume = (): ResumeData =>
  resumeDataSchema.parse({ version: 1 });

/** New blank item with a fresh id. */
export const emptyItem = <K extends ListKey>(key: K): ListItem<K> =>
  listItemSchemas[key].parse({}) as ListItem<K>;

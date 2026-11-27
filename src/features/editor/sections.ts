import type { LucideIcon } from "lucide-react";

import { icons } from "@/lib/data";
import { formatMonthYear } from "@/lib/resume/format";
import { NETWORKS, type ListItem, type ListKey } from "@/lib/resume/schema";

type Base<N extends string> = { name: N; label: string };

export type FieldDef<N extends string = string> = Base<N> &
  (
    | {
        kind: "text" | "url" | "email" | "tel";
        placeholder?: string;
        span?: 1 | 2;
      }
    | { kind: "markdown"; rows?: number }
    | { kind: "dateRange" }
    | { kind: "monthYear" }
    | {
        kind: "select";
        options: readonly string[];
        icons?: Record<string, LucideIcon>;
      }
    | { kind: "tags" }
    | { kind: "bullets" }
  );

export type ListSectionKey = Exclude<ListKey, "customSections">;

export type SectionDef<K extends ListSectionKey> = {
  key: K;
  title: string;
  /** Singular, for "Add …". */
  itemName: string;
  itemLabel: (item: ListItem<K>) => string;
  fields: FieldDef<Extract<keyof ListItem<K>, string>>[];
  newItem?: () => Partial<ListItem<K>>;
};

const join = (...parts: string[]) => parts.filter(Boolean).join(" · ");

export const sectionDefs: { [K in ListSectionKey]: SectionDef<K> } = {
  experience: {
    key: "experience",
    title: "Experience",
    itemName: "experience",
    itemLabel: (i) => join(i.role, i.company),
    newItem: () => ({ bullets: [{ id: crypto.randomUUID(), text: "" }] }),
    fields: [
      { name: "role", label: "Role", kind: "text" },
      { name: "company", label: "Company", kind: "text" },
      { name: "location", label: "Location", kind: "text", span: 2 },
      { name: "dates", label: "Dates", kind: "dateRange" },
      { name: "bullets", label: "Highlights", kind: "bullets" },
    ],
  },
  projects: {
    key: "projects",
    title: "Projects",
    itemName: "project",
    itemLabel: (i) => i.name,
    fields: [
      { name: "name", label: "Name", kind: "text", span: 2 },
      { name: "description", label: "Description", kind: "markdown" },
      { name: "liveUrl", label: "Live URL", kind: "url" },
      { name: "sourceUrl", label: "Source URL", kind: "url" },
      { name: "tags", label: "Tags", kind: "tags" },
    ],
  },
  education: {
    key: "education",
    title: "Education",
    itemName: "education",
    itemLabel: (i) => join(i.degree, i.institution),
    fields: [
      { name: "degree", label: "Degree", kind: "text" },
      { name: "institution", label: "Institution", kind: "text" },
      { name: "location", label: "Location", kind: "text", span: 2 },
      { name: "dates", label: "Dates", kind: "dateRange" },
      { name: "details", label: "Details", kind: "markdown", rows: 3 },
    ],
  },
  skills: {
    key: "skills",
    title: "Skills",
    itemName: "skill",
    itemLabel: (i) => i.name,
    fields: [{ name: "name", label: "Skill", kind: "text", span: 2 }],
  },
  languages: {
    key: "languages",
    title: "Languages",
    itemName: "language",
    itemLabel: (i) => join(i.name, i.proficiency),
    fields: [
      { name: "name", label: "Language", kind: "text" },
      {
        name: "proficiency",
        label: "Proficiency",
        kind: "text",
        placeholder: "Native, Fluent, B2…",
      },
    ],
  },
  certifications: {
    key: "certifications",
    title: "Certifications",
    itemName: "certification",
    itemLabel: (i) => join(i.name, i.issuer),
    fields: [
      { name: "name", label: "Name", kind: "text" },
      { name: "issuer", label: "Issuer", kind: "text" },
      { name: "date", label: "Date", kind: "monthYear" },
      { name: "url", label: "URL", kind: "url", span: 2 },
    ],
  },
  awards: {
    key: "awards",
    title: "Awards",
    itemName: "award",
    itemLabel: (i) => join(i.title, i.date ? formatMonthYear(i.date) : ""),
    fields: [
      { name: "title", label: "Title", kind: "text" },
      { name: "issuer", label: "Issuer", kind: "text" },
      { name: "date", label: "Date", kind: "monthYear" },
      { name: "description", label: "Description", kind: "markdown", rows: 3 },
    ],
  },
  interests: {
    key: "interests",
    title: "Interests",
    itemName: "interest",
    itemLabel: (i) => i.name,
    fields: [{ name: "name", label: "Interest", kind: "text", span: 2 }],
  },
  links: {
    key: "links",
    title: "Links",
    itemName: "link",
    itemLabel: (i) => i.label || i.url,
    fields: [
      {
        name: "network",
        label: "Network",
        kind: "select",
        options: NETWORKS,
        icons,
      },
      { name: "label", label: "Label", kind: "text", placeholder: "Optional" },
      { name: "url", label: "URL", kind: "url", span: 2 },
    ],
  },
};

export const customItemFields: FieldDef<
  "title" | "subtitle" | "dates" | "description"
>[] = [
  { name: "title", label: "Title", kind: "text" },
  { name: "subtitle", label: "Subtitle", kind: "text" },
  { name: "dates", label: "Dates", kind: "dateRange" },
  { name: "description", label: "Description", kind: "markdown", rows: 3 },
];

export const isListSection = (key: string): key is ListSectionKey =>
  key in sectionDefs;

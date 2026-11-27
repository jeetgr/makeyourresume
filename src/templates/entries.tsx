import { Fragment } from "react";
import { Text } from "@react-pdf/renderer";

import { formatMonthYear } from "@/lib/resume/format";
import type {
  DateRange as DateRangeValue,
  ResumeData,
} from "@/lib/resume/schema";

import { paragraphs } from "@/pdf/markdown";
import { LinkText, Markdown } from "@/pdf/primitives/text";

import { nonEmpty } from "./utils";

/** Normalized entry of a list section; templates decide how it looks. */
export type EntryData = {
  id: string;
  title: string;
  subtitle?: string;
  dates?: DateRangeValue;
  location?: string;
  meta?: string;
  link?: string;
  /** Body start; keep with the entry head. */
  lead?: React.ReactNode;
  /** Body remainder; may continue on the next page. */
  rest?: React.ReactNode;
};

type Render = {
  bullet: (bullet: { id: string; text: string }) => React.ReactNode;
  /** Small secondary line (project tags). */
  meta: (text: string) => React.ReactNode;
};

const DEFAULT_TITLES: Record<string, string> = {
  summary: "Summary",
  links: "Links",
  experience: "Work Experience",
  projects: "Projects",
  education: "Education",
  skills: "Skills",
  languages: "Languages",
  certifications: "Certifications",
  awards: "Awards",
  interests: "Interests",
};

export const sectionTitle = (data: ResumeData, key: string) =>
  key.startsWith("custom:")
    ? data.customSections.find((s) => `custom:${s.id}` === key)?.title || ""
    : (DEFAULT_TITLES[key] ?? "");

/** First paragraph stays w/ the entry head; later ones may move to the next page. */
const splitText = (text: string) => {
  const [first = "", ...rest] = paragraphs(text);
  return {
    lead: first ? <Markdown text={first} /> : null,
    rest: rest.length ? <Markdown text={rest.join("\n")} /> : null,
  };
};

/** Entries of a list section, or `undefined` for non-list keys (summary, skills…). */
export function sectionEntries(
  data: ResumeData,
  key: string,
  { bullet, meta }: Render,
): EntryData[] | undefined {
  switch (key) {
    case "experience":
      return nonEmpty(data.experience, (e) => e.role + e.company).map((e) => {
        const [first, ...rest] = nonEmpty(e.bullets, (b) => b.text);
        return {
          id: e.id,
          title: e.role,
          subtitle: e.company,
          dates: e.dates,
          location: e.location,
          lead: first ? bullet(first) : null,
          rest: rest.map(bullet),
        };
      });
    case "projects":
      return nonEmpty(data.projects, (p) => p.name).map((p) => {
        const { lead, rest } = splitText(p.description);
        return {
          id: p.id,
          title: p.name,
          link: p.liveUrl,
          lead,
          rest: [
            rest,
            p.sourceUrl ? (
              <Text key="source">
                <Text style={{ fontWeight: 700 }}>Source: </Text>
                <LinkText url={p.sourceUrl} />
              </Text>
            ) : null,
            p.tags.length ? (
              <Fragment key="tags">{meta(p.tags.join(", "))}</Fragment>
            ) : null,
          ],
        };
      });
    case "education":
      return nonEmpty(data.education, (e) => e.degree + e.institution).map(
        (e) => ({
          id: e.id,
          title: e.degree,
          subtitle: e.institution,
          dates: e.dates,
          location: e.location,
          ...splitText(e.details),
        }),
      );
    case "certifications":
      return nonEmpty(data.certifications, (c) => c.name).map((c) => ({
        id: c.id,
        title: c.name,
        subtitle: c.issuer,
        meta: formatMonthYear(c.date),
        link: c.url,
      }));
    case "awards":
      return nonEmpty(data.awards, (a) => a.title).map((a) => ({
        id: a.id,
        title: a.title,
        subtitle: a.issuer,
        meta: formatMonthYear(a.date),
        ...splitText(a.description),
      }));
    default: {
      if (!key.startsWith("custom:")) return undefined;
      const section = data.customSections.find((s) => `custom:${s.id}` === key);
      return nonEmpty(section?.items ?? [], (i) => i.title + i.description).map(
        (i) => ({
          id: i.id,
          title: i.title,
          subtitle: i.subtitle,
          dates: i.dates,
          ...splitText(i.description),
        }),
      );
    }
  }
}

import * as z from "zod";

import {
  NETWORKS,
  SECTION_KEYS,
  resumeDataSchema,
  type CustomSection,
  type DateRange,
  type MonthYear,
  type ResumeData,
} from "./schema";

/** JSON Resume (https://jsonresume.org/schema) ↔ `ResumeData`; lossy both ways (Q60). */

const SCHEMA_URL =
  "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json";

const str = z.string().optional().catch(undefined);
const strs = z.array(z.string()).optional().catch(undefined);
const list = <T extends z.ZodType>(item: T) =>
  z
    .array(item.catch(undefined as z.infer<T>))
    .optional()
    .catch(undefined);

const dated = { startDate: str, endDate: str };

const jsonResumeSchema = z.object({
  basics: z
    .object({
      name: str,
      label: str,
      image: str,
      email: str,
      phone: str,
      url: str,
      summary: str,
      location: z
        .object({ address: str, city: str, region: str, countryCode: str })
        .optional()
        .catch(undefined),
      profiles: list(z.object({ network: str, username: str, url: str })),
    })
    .optional()
    .catch(undefined),
  work: list(
    z.object({
      name: str,
      position: str,
      location: str,
      summary: str,
      highlights: strs,
      ...dated,
    }),
  ),
  volunteer: list(
    z.object({
      organization: str,
      position: str,
      summary: str,
      highlights: strs,
      ...dated,
    }),
  ),
  education: list(
    z.object({
      institution: str,
      area: str,
      studyType: str,
      score: str,
      courses: strs,
      ...dated,
    }),
  ),
  awards: list(z.object({ title: str, date: str, awarder: str, summary: str })),
  certificates: list(z.object({ name: str, date: str, issuer: str, url: str })),
  publications: list(
    z.object({
      name: str,
      publisher: str,
      releaseDate: str,
      url: str,
      summary: str,
    }),
  ),
  skills: list(z.object({ name: str, keywords: strs })),
  languages: list(z.object({ language: str, fluency: str })),
  interests: list(z.object({ name: str })),
  references: list(z.object({ name: str, reference: str })),
  projects: list(
    z.object({
      name: str,
      description: str,
      highlights: strs,
      keywords: strs,
      url: str,
    }),
  ),
});

type JsonResume = z.infer<typeof jsonResumeSchema>;

/** Custom section titles that map to JSON Resume arrays. */
const CUSTOM = {
  volunteer: "Volunteering",
  publications: "Publications",
  references: "References",
} as const;

const NETWORK_NAMES: Record<(typeof NETWORKS)[number], string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  portfolio: "Website",
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "Twitter",
  other: "Website",
};

const PROFILE_URLS: Partial<Record<string, (user: string) => string>> = {
  linkedin: (u) => `https://www.linkedin.com/in/${u}`,
  github: (u) => `https://github.com/${u}`,
  twitter: (u) => `https://x.com/${u}`,
};

/** Loose check: an object w/ JSON Resume's characteristic keys. */
export const isJsonResume = (input: unknown) =>
  !!input &&
  typeof input === "object" &&
  ("basics" in input || "work" in input);

/** `YYYY`, `YYYY-MM` or `YYYY-MM-DD` → `MonthYear`. */
export function parseDate(value?: string): MonthYear | undefined {
  const m = value?.trim().match(/^(\d{4})(?:-(\d{1,2}))?/);
  if (!m) return undefined;
  const month = m[2] ? Number(m[2]) : undefined;
  return {
    year: Number(m[1]),
    ...(month && month >= 1 && month <= 12 && { month }),
  };
}

export const formatDate = (date?: MonthYear) =>
  date &&
  (date.month
    ? `${date.year}-${String(date.month).padStart(2, "0")}`
    : String(date.year));

/** Missing end w/ a start = ongoing (JSON Resume convention). */
const parseRange = (startDate?: string, endDate?: string): DateRange => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  return { start, end, present: !!start && !end };
};

const lines = (...parts: (string | string[] | undefined)[]) =>
  parts
    .flat()
    .map((p) => p?.trim())
    .filter(Boolean)
    .join("\n");

const bulleted = (items?: string[]) => items?.map((h) => `• ${h}`);

const toNetwork = (name = "") => {
  const key = name.trim().toLowerCase();
  if (key === "x") return "twitter";
  return (NETWORKS as readonly string[]).includes(key)
    ? (key as (typeof NETWORKS)[number])
    : "other";
};

const splitName = (name = "") => {
  const trimmed = name.trim();
  const at = trimmed.lastIndexOf(" ");
  return at < 0
    ? { firstName: trimmed, lastName: "" }
    : { firstName: trimmed.slice(0, at), lastName: trimmed.slice(at + 1) };
};

const present = <T>(items?: (T | undefined)[]) =>
  (items ?? []).filter((i): i is T => i !== undefined);

const customSection = (
  title: string,
  items: CustomSection["items"],
): CustomSection | null =>
  items.length ? { id: crypto.randomUUID(), title, items } : null;

/** JSON Resume → `ResumeData`, or `null` when it doesn't look like one. */
export function fromJsonResume(input: unknown): ResumeData | null {
  if (!isJsonResume(input)) return null;
  const r = jsonResumeSchema.parse(input);
  const b = r.basics ?? {};
  const loc = b.location;

  const links = [
    ...(b.url ? [{ network: "portfolio" as const, url: b.url }] : []),
    ...present(b.profiles).flatMap(({ network, username, url }) => {
      const key = toNetwork(network);
      const href = url || (username && PROFILE_URLS[key]?.(username));
      return href
        ? [{ network: key, url: href, label: key === "other" ? network : "" }]
        : [];
    }),
  ];

  const customSections = [
    customSection(
      CUSTOM.volunteer,
      present(r.volunteer).map((v) => ({
        id: crypto.randomUUID(),
        title: v.position ?? "",
        subtitle: v.organization ?? "",
        dates: parseRange(v.startDate, v.endDate),
        description: lines(v.summary, bulleted(v.highlights)),
      })),
    ),
    customSection(
      CUSTOM.publications,
      present(r.publications).map((p) => ({
        id: crypto.randomUUID(),
        title: p.name ?? "",
        subtitle: p.publisher ?? "",
        dates: { start: parseDate(p.releaseDate), present: false },
        description: lines(p.summary, p.url),
      })),
    ),
    customSection(
      CUSTOM.references,
      present(r.references).map((ref) => ({
        id: crypto.randomUUID(),
        title: ref.name ?? "",
        subtitle: "",
        description: ref.reference ?? "",
      })),
    ),
  ].filter((s): s is CustomSection => s !== null);

  const data = resumeDataSchema.safeParse({
    version: 1,
    profile: {
      ...splitName(b.name),
      headline: b.label,
      email: b.email,
      phone: b.phone,
      location: [loc?.city, loc?.region, loc?.countryCode]
        .filter(Boolean)
        .join(", "),
      summary: b.summary,
      photo: b.image?.startsWith("data:image/") ? b.image : "",
    },
    links,
    experience: present(r.work).map((w) => ({
      company: w.name,
      role: w.position,
      location: w.location,
      dates: parseRange(w.startDate, w.endDate),
      bullets: [w.summary, ...(w.highlights ?? [])]
        .filter((text) => text?.trim())
        .map((text) => ({ text })),
    })),
    projects: present(r.projects).map((p) => ({
      name: p.name,
      description: lines(p.description, bulleted(p.highlights)),
      liveUrl: p.url,
      tags: p.keywords ?? [],
    })),
    education: present(r.education).map((e) => ({
      institution: e.institution,
      degree: [e.studyType, e.area].filter(Boolean).join(" in "),
      dates: parseRange(e.startDate, e.endDate),
      details: lines(e.score && `Score: ${e.score}`, bulleted(e.courses)),
    })),
    skills: present(r.skills).flatMap((s) =>
      (s.keywords?.length ? s.keywords : [s.name ?? ""])
        .filter((name) => name.trim())
        .map((name) => ({ name })),
    ),
    languages: present(r.languages).map((l) => ({
      name: l.language,
      proficiency: l.fluency,
    })),
    certifications: present(r.certificates).map((c) => ({
      name: c.name,
      issuer: c.issuer,
      date: parseDate(c.date),
      url: c.url,
    })),
    awards: present(r.awards).map((a) => ({
      title: a.title,
      issuer: a.awarder,
      date: parseDate(a.date),
      description: a.summary,
    })),
    interests: present(r.interests).map((i) => ({ name: i.name })),
    customSections,
    layout: {
      order: [...SECTION_KEYS, ...customSections.map((s) => `custom:${s.id}`)],
    },
  });

  return data.success ? data.data : null;
}

const findCustom = (data: ResumeData, title: string) =>
  data.customSections.find(
    (s) => s.title.trim().toLowerCase() === title.toLowerCase(),
  )?.items ?? [];

const orUndefined = (value: string) => value || undefined;

/** `ResumeData` → JSON Resume; custom sections other than `CUSTOM` titles are dropped. */
export function toJsonResume(data: ResumeData): JsonResume & {
  $schema: string;
} {
  const { profile } = data;
  const portfolio = data.links.find((l) => l.network === "portfolio");
  const range = ({ start, end, present }: DateRange) => ({
    startDate: formatDate(start),
    endDate: present ? undefined : formatDate(end),
  });

  return {
    $schema: SCHEMA_URL,
    basics: {
      name: orUndefined([profile.firstName, profile.lastName].join(" ").trim()),
      label: orUndefined(profile.headline),
      image: orUndefined(profile.photo),
      email: orUndefined(profile.email),
      phone: orUndefined(profile.phone),
      url: portfolio?.url,
      summary: orUndefined(profile.summary),
      location: profile.location ? { city: profile.location } : undefined,
      profiles: data.links
        .filter((l) => l !== portfolio && l.url)
        .map((l) => ({
          network:
            l.network === "other"
              ? l.label || NETWORK_NAMES.other
              : NETWORK_NAMES[l.network],
          url: l.url,
        })),
    },
    work: data.experience.map((e) => ({
      name: orUndefined(e.company),
      position: orUndefined(e.role),
      location: orUndefined(e.location),
      ...range(e.dates),
      highlights: e.bullets.map((b) => b.text).filter(Boolean),
    })),
    volunteer: findCustom(data, CUSTOM.volunteer).map((i) => ({
      organization: orUndefined(i.subtitle),
      position: orUndefined(i.title),
      summary: orUndefined(i.description),
      ...(i.dates && range(i.dates)),
    })),
    education: data.education.map((e) => ({
      institution: orUndefined(e.institution),
      studyType: orUndefined(e.degree),
      ...range(e.dates),
      courses: e.details
        ? e.details
            .split("\n")
            .map((l) => l.replace(/^•\s*/, "").trim())
            .filter(Boolean)
        : undefined,
    })),
    awards: data.awards.map((a) => ({
      title: orUndefined(a.title),
      awarder: orUndefined(a.issuer),
      date: formatDate(a.date),
      summary: orUndefined(a.description),
    })),
    certificates: data.certifications.map((c) => ({
      name: orUndefined(c.name),
      issuer: orUndefined(c.issuer),
      date: formatDate(c.date),
      url: orUndefined(c.url),
    })),
    publications: findCustom(data, CUSTOM.publications).map((i) => ({
      name: orUndefined(i.title),
      publisher: orUndefined(i.subtitle),
      releaseDate: formatDate(i.dates?.start),
      summary: orUndefined(i.description),
    })),
    skills: data.skills.filter((s) => s.name).map((s) => ({ name: s.name })),
    languages: data.languages.map((l) => ({
      language: orUndefined(l.name),
      fluency: orUndefined(l.proficiency),
    })),
    interests: data.interests.map((i) => ({ name: orUndefined(i.name) })),
    references: findCustom(data, CUSTOM.references).map((i) => ({
      name: orUndefined(i.title),
      reference: orUndefined(i.description),
    })),
    projects: data.projects.map((p) => ({
      name: orUndefined(p.name),
      description: orUndefined(p.description),
      url: orUndefined(p.liveUrl || p.sourceUrl),
      keywords: p.tags.length ? p.tags : undefined,
    })),
  };
}

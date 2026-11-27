import * as z from "zod";

const id = z
  .string()
  .min(1)
  .default(() => crypto.randomUUID());
const text = z.string().default("");

export const monthYearSchema = z.object({
  year: z.number().int(),
  month: z.number().int().min(1).max(12).optional(),
});

export const dateRangeSchema = z.object({
  start: monthYearSchema.optional(),
  end: monthYearSchema.optional(),
  present: z.boolean().default(false),
});

export const profileSchema = z.object({
  /** Data URL. */
  photo: text,
  firstName: text,
  lastName: text,
  headline: text,
  email: text,
  phone: text,
  location: text,
  /** Markdown subset. */
  summary: text,
});

export const NETWORKS = [
  "linkedin",
  "github",
  "portfolio",
  "facebook",
  "instagram",
  "twitter",
  "other",
] as const;

const linkSchema = z.object({
  id,
  network: z.enum(NETWORKS).default("other"),
  label: text,
  url: text,
});

const bulletSchema = z.object({ id, text });

const experienceSchema = z.object({
  id,
  company: text,
  role: text,
  location: text,
  dates: dateRangeSchema.prefault({}),
  bullets: z.array(bulletSchema).default([]),
});

const projectSchema = z.object({
  id,
  name: text,
  description: text,
  liveUrl: text,
  sourceUrl: text,
  tags: z.array(z.string()).default([]),
});

const educationSchema = z.object({
  id,
  institution: text,
  degree: text,
  location: text,
  dates: dateRangeSchema.prefault({}),
  details: text,
});

const skillSchema = z.object({ id, name: text, level: z.number().optional() });

const languageSchema = z.object({ id, name: text, proficiency: text });

const certificationSchema = z.object({
  id,
  name: text,
  issuer: text,
  date: monthYearSchema.optional(),
  url: text,
});

const awardSchema = z.object({
  id,
  title: text,
  issuer: text,
  date: monthYearSchema.optional(),
  description: text,
});

const interestSchema = z.object({ id, name: text });

const customItemSchema = z.object({
  id,
  title: text,
  subtitle: text,
  dates: dateRangeSchema.optional(),
  description: text,
});

const customSectionSchema = z.object({
  id,
  title: text,
  items: z.array(customItemSchema).default([]),
});

export const listItemSchemas = {
  links: linkSchema,
  experience: experienceSchema,
  projects: projectSchema,
  education: educationSchema,
  skills: skillSchema,
  languages: languageSchema,
  certifications: certificationSchema,
  awards: awardSchema,
  interests: interestSchema,
  customSections: customSectionSchema,
};

export const SECTION_KEYS = [
  "summary",
  "experience",
  "projects",
  "education",
  "skills",
  "languages",
  "certifications",
  "awards",
  "interests",
  "links",
] as const;

export const resumeDataSchema = z.object({
  version: z.literal(1),
  profile: profileSchema.prefault({}),
  links: z.array(linkSchema).default([]),
  experience: z.array(experienceSchema).default([]),
  projects: z.array(projectSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(skillSchema).default([]),
  languages: z.array(languageSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  awards: z.array(awardSchema).default([]),
  interests: z.array(interestSchema).default([]),
  customSections: z.array(customSectionSchema).default([]),
  layout: z
    .object({
      /** `SectionKey` or `custom:${id}`. */
      order: z.array(z.string()).default(() => [...SECTION_KEYS]),
      hidden: z.array(z.string()).default([]),
    })
    .prefault({}),
});

export type MonthYear = z.infer<typeof monthYearSchema>;
export type DateRange = z.infer<typeof dateRangeSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Network = (typeof NETWORKS)[number];
export type SectionKey = (typeof SECTION_KEYS)[number];
export type ResumeData = z.infer<typeof resumeDataSchema>;
export type ListKey = keyof typeof listItemSchemas;
export type ListItem<K extends ListKey> = z.infer<(typeof listItemSchemas)[K]>;
export type Experience = ListItem<"experience">;
export type CustomSection = ListItem<"customSections">;

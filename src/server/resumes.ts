"use server";

import { revalidatePath } from "next/cache";

import {
  DEFAULT_TEMPLATE_ID,
  getTemplateMeta,
  templateTheme,
} from "@/templates/catalog";
import { emptyResume } from "@/lib/resume/empty";

import {
  parseResumeInput,
  resumeContentSchema,
  resumeIdSchema,
  saveInputSchema,
  titleSchema,
} from "./resume-input";
import * as repo from "./resume-repo";
import { requireUser } from "./session";

type Failure = {
  ok: false;
  error: "invalid" | "too_large" | "not_found" | "conflict";
};

const invalid: Failure = { ok: false, error: "invalid" };
const notFound: Failure = { ok: false, error: "not_found" };

/**
 * New resume; `content` omitted → empty data + template's default theme.
 * Used by the dashboard, the templates gallery and guest migration.
 */
export async function createResume(input: {
  templateId?: string;
  content?: unknown;
  title?: string;
}): Promise<{ ok: true; id: string } | Failure> {
  const user = await requireUser();
  const title =
    input.title === undefined
      ? undefined
      : titleSchema.safeParse(input.title).data;

  let content;
  if (input.content === undefined) {
    const template = getTemplateMeta(input.templateId ?? DEFAULT_TEMPLATE_ID);
    content = {
      data: emptyResume(),
      theme: templateTheme(template),
      templateId: template.id,
    };
  } else {
    const parsed = parseResumeInput(resumeContentSchema, input.content);
    if (!parsed.ok) return parsed;
    content = parsed.value;
  }

  const id = await repo.insertForUser(user.id, { ...content, title });
  revalidatePath("/resumes");
  return { ok: true, id };
}

export async function duplicateResume(
  id: string,
): Promise<{ ok: true; id: string } | Failure> {
  const user = await requireUser();
  if (!resumeIdSchema.safeParse(id).success) return invalid;
  const source = await repo.findForUser(user.id, id);
  if (!source) return notFound;

  const newId = await repo.insertForUser(user.id, {
    data: source.data,
    theme: source.theme,
    templateId: source.templateId,
    title: `${source.title} (copy)`.slice(0, 120),
  });
  revalidatePath("/resumes");
  return { ok: true, id: newId };
}

export async function renameResume(
  id: string,
  title: string,
): Promise<{ ok: true } | Failure> {
  const user = await requireUser();
  const parsed = titleSchema.safeParse(title);
  if (!resumeIdSchema.safeParse(id).success || !parsed.success) return invalid;
  if (!(await repo.renameForUser(user.id, id, parsed.data))) return notFound;
  revalidatePath("/resumes");
  return { ok: true };
}

export async function deleteResume(
  id: string,
): Promise<{ ok: true } | Failure> {
  const user = await requireUser();
  if (!resumeIdSchema.safeParse(id).success) return invalid;
  if (!(await repo.deleteForUser(user.id, id))) return notFound;
  revalidatePath("/resumes");
  return { ok: true };
}

/** Autosave; `conflict` when the row changed since `baseUpdatedAt` (e.g. another tab). */
export async function saveResume(
  id: string,
  input: unknown,
): Promise<{ ok: true; updatedAt: string } | Failure> {
  const user = await requireUser();
  if (!resumeIdSchema.safeParse(id).success) return invalid;
  const parsed = parseResumeInput(saveInputSchema, input);
  if (!parsed.ok) return parsed;

  const { baseUpdatedAt, ...content } = parsed.value;
  const updatedAt = await repo.saveForUser(user.id, id, content, baseUpdatedAt);
  if (updatedAt) return { ok: true, updatedAt: updatedAt.toISOString() };
  return (await repo.findForUser(user.id, id))
    ? { ok: false, error: "conflict" }
    : notFound;
}

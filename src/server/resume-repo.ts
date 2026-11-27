import "server-only";

import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { resume } from "@/db/schema";
import { migrate } from "@/lib/resume/migrate";
import { defaultTheme, themeSchema } from "@/lib/resume/theme";

import type { ResumeContent } from "./resume-input";

const owned = (userId: string, id: string) =>
  and(eq(resume.id, id), eq(resume.userId, userId));

export async function listForUser(userId: string) {
  return db
    .select({
      id: resume.id,
      title: resume.title,
      templateId: resume.templateId,
      updatedAt: resume.updatedAt,
    })
    .from(resume)
    .where(eq(resume.userId, userId))
    .orderBy(desc(resume.updatedAt));
}

/** Stored JSON may predate the current schema → `migrate()` on read. */
export async function findForUser(userId: string, id: string) {
  const [row] = await db.select().from(resume).where(owned(userId, id));
  if (row === undefined) return null;
  return {
    ...row,
    data: migrate(row.data),
    theme: themeSchema.catch(defaultTheme).parse(row.theme),
  };
}

export async function insertForUser(
  userId: string,
  { title, ...content }: ResumeContent & { title?: string },
) {
  const [row] = await db
    .insert(resume)
    .values({ userId, ...content, ...(title && { title }) })
    .returning({ id: resume.id });
  return row!.id;
}

export async function renameForUser(userId: string, id: string, title: string) {
  const rows = await db
    .update(resume)
    .set({ title })
    .where(owned(userId, id))
    .returning({ id: resume.id });
  return rows.length > 0;
}

export async function deleteForUser(userId: string, id: string) {
  const rows = await db
    .delete(resume)
    .where(owned(userId, id))
    .returning({ id: resume.id });
  return rows.length > 0;
}

/**
 * Optimistic concurrency: updates only if the row is unchanged since `baseUpdatedAt`
 * (compared at ms precision; JS dates have no µs). `null` = conflict or not found.
 */
export async function saveForUser(
  userId: string,
  id: string,
  content: ResumeContent,
  baseUpdatedAt: string,
): Promise<Date | null> {
  const [row] = await db
    .update(resume)
    .set(content)
    .where(
      and(
        owned(userId, id),
        sql`date_trunc('milliseconds', ${resume.updatedAt}) = ${baseUpdatedAt}::timestamptz`,
      ),
    )
    .returning({ updatedAt: resume.updatedAt });
  return row?.updatedAt ?? null;
}

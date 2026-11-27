import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import type { ResumeData } from "@/lib/resume/schema";
import type { Theme } from "@/lib/resume/theme";

import { user } from "./auth";

export const resume = pgTable(
  "resume",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull().default("Untitled resume"),
    templateId: text("template_id").notNull(),
    theme: jsonb("theme").$type<Theme>().notNull(),
    data: jsonb("data").$type<ResumeData>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [index("resume_userId_updatedAt_idx").on(t.userId, t.updatedAt)],
);

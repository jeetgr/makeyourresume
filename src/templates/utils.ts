import type { ResumeData } from "@/lib/resume/schema";

/** `layout.order` keys that aren't hidden. */
export const visibleOrder = (data: ResumeData) =>
  data.layout.order.filter((key) => !data.layout.hidden.includes(key));

/** Drops whitespace-only entries of a list by a text getter. */
export const nonEmpty = <T>(items: T[], text: (item: T) => string) =>
  items.filter((i) => text(i).trim());

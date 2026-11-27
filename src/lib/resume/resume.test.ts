import { describe, expect, it } from "vitest";

import { emptyItem, emptyResume, isEmptyResume } from "./empty";
import { formatDateRange, formatMonthYear } from "./format";
import { migrate } from "./migrate";
import {
  addItem,
  duplicateItem,
  move,
  moveItem,
  moveSection,
  removeItem,
  setProfile,
  toggleSection,
  updateItem,
} from "./ops";
import { sampleResume } from "./sample";
import { SECTION_KEYS, resumeDataSchema } from "./schema";
import { defaultTheme, themeSchema } from "./theme";

describe("isEmptyResume", () => {
  it("ignores generated ids", () => {
    expect(isEmptyResume(emptyResume())).toBe(true);
  });

  it("detects content, items and layout changes", () => {
    const d = emptyResume();
    expect(isEmptyResume(setProfile(d, { firstName: "A" }))).toBe(false);
    expect(isEmptyResume(addItem(d, "experience"))).toBe(false);
    expect(isEmptyResume(moveSection(d, 0, 1))).toBe(false);
    expect(isEmptyResume(sampleResume)).toBe(false);
  });
});

describe("schema", () => {
  it("parses empty resume with defaults", () => {
    const d = emptyResume();
    expect(d.version).toBe(1);
    expect(d.profile.firstName).toBe("");
    expect(d.experience).toEqual([]);
    expect(d.layout).toEqual({ order: [...SECTION_KEYS], hidden: [] });
  });

  it("round-trips sample", () => {
    expect(resumeDataSchema.parse(sampleResume)).toEqual(sampleResume);
  });

  it("fills item defaults with fresh ids", () => {
    const a = emptyItem("experience");
    const b = emptyItem("experience");
    expect(a.id).not.toBe(b.id);
    expect(a.dates.present).toBe(false);
    expect(a.bullets).toEqual([]);
  });

  it("rejects wrong version and bad month", () => {
    expect(resumeDataSchema.safeParse({ version: 2 }).success).toBe(false);
    expect(
      resumeDataSchema.safeParse({
        version: 1,
        experience: [{ dates: { start: { year: 2020, month: 13 } } }],
      }).success,
    ).toBe(false);
  });

  it("theme defaults", () => {
    expect(themeSchema.parse({})).toEqual(defaultTheme);
    expect(defaultTheme.density).toBe("normal");
  });
});

describe("ops", () => {
  it("setProfile patches", () => {
    const d = setProfile(emptyResume(), { firstName: "Ada" });
    expect(d.profile.firstName).toBe("Ada");
    expect(d.profile.lastName).toBe("");
  });

  it("add/update/remove item without mutating input", () => {
    const d0 = emptyResume();
    const d1 = addItem(d0, "skills", { name: "TS" });
    expect(d0.skills).toHaveLength(0);
    expect(d1.skills).toHaveLength(1);

    const id = d1.skills[0].id;
    const d2 = updateItem(d1, "skills", id, { name: "TypeScript" });
    expect(d2.skills[0]).toEqual({ id, name: "TypeScript" });
    expect(d1.skills[0].name).toBe("TS");

    expect(removeItem(d2, "skills", id).skills).toHaveLength(0);
  });

  it("moveItem reorders", () => {
    const d = ["a", "b", "c"].reduce(
      (acc, name) => addItem(acc, "interests", { id: name, name }),
      emptyResume(),
    );
    expect(moveItem(d, "interests", 0, 2).interests.map((i) => i.id)).toEqual([
      "b",
      "c",
      "a",
    ]);
  });

  it("move ignores out-of-range from", () => {
    expect(move([1, 2], 5, 0)).toEqual([1, 2]);
  });

  it("custom sections sync layout", () => {
    const d1 = addItem(emptyResume(), "customSections", { id: "x" });
    expect(d1.layout.order.at(-1)).toBe("custom:x");

    const d2 = toggleSection(d1, "custom:x");
    expect(d2.layout.hidden).toEqual(["custom:x"]);

    const d3 = removeItem(d2, "customSections", "x");
    expect(d3.layout.order).not.toContain("custom:x");
    expect(d3.layout.hidden).toEqual([]);
  });

  it("toggleSection flips or forces", () => {
    const d1 = toggleSection(emptyResume(), "skills");
    expect(d1.layout.hidden).toEqual(["skills"]);
    expect(toggleSection(d1, "skills").layout.hidden).toEqual([]);
    expect(toggleSection(d1, "skills", true).layout.hidden).toEqual(["skills"]);
  });

  it("duplicateItem inserts copy after original", () => {
    const d = ["a", "b"].reduce(
      (acc, name) => addItem(acc, "interests", { id: name, name }),
      emptyResume(),
    );
    const next = duplicateItem(d, "interests", "a").interests;
    expect(next.map((i) => i.name)).toEqual(["a", "a", "b"]);
    expect(next[1].id).not.toBe("a");

    const c = duplicateItem(
      addItem(emptyResume(), "customSections", { id: "x" }),
      "customSections",
      "x",
    );
    expect(c.layout.order.at(-1)).toBe(`custom:${c.customSections[1].id}`);
  });

  it("moveSection reorders layout", () => {
    const d = moveSection(emptyResume(), 0, 1);
    expect(d.layout.order.slice(0, 2)).toEqual(["experience", "summary"]);
  });
});

describe("migrate", () => {
  it("keeps valid v1", () => {
    expect(migrate(sampleResume)).toEqual(sampleResume);
  });

  it("garbage, missing or unknown version → empty", () => {
    for (const input of [null, undefined, "x", {}, { version: 99 }]) {
      expect(migrate(input)).toEqual(emptyResume());
    }
  });

  it("invalid v1 → empty", () => {
    expect(migrate({ version: 1, skills: "nope" })).toEqual(emptyResume());
  });
});

describe("format", () => {
  it("formats month/year and ranges", () => {
    expect(formatMonthYear({ year: 2020, month: 3 })).toBe("Mar 2020");
    expect(formatMonthYear({ year: 2020 })).toBe("2020");
    expect(formatDateRange({ present: false })).toBe("");
    expect(
      formatDateRange({
        start: { year: 2020 },
        end: { year: 2021 },
        present: false,
      }),
    ).toBe("2020 - 2021");
    expect(
      formatDateRange({ start: { year: 2020, month: 1 }, present: true }),
    ).toBe("Jan 2020 - Present");
  });
});

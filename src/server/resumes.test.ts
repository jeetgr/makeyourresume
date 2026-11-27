import { beforeEach, describe, expect, it, vi } from "vitest";

import { emptyResume } from "@/lib/resume/empty";
import { defaultTheme } from "@/lib/resume/theme";

import * as repo from "./resume-repo";
import {
  createResume,
  deleteResume,
  duplicateResume,
  renameResume,
  saveResume,
} from "./resumes";
import { requireUser } from "./session";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("./session", () => ({ requireUser: vi.fn() }));
vi.mock("./resume-repo", () => ({
  findForUser: vi.fn(),
  insertForUser: vi.fn(),
  renameForUser: vi.fn(),
  deleteForUser: vi.fn(),
  saveForUser: vi.fn(),
}));

const ID = "00000000-0000-4000-8000-000000000001";
const content = {
  data: emptyResume(),
  theme: defaultTheme,
  templateId: "sidebar",
};
const base = "2026-01-01T00:00:00.000Z";

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(requireUser).mockResolvedValue({ id: "user-a" } as never);
});

describe("authorization", () => {
  it("every action requires a session", async () => {
    vi.mocked(requireUser).mockRejectedValue(new Error("NEXT_REDIRECT"));
    const calls = [
      createResume({}),
      duplicateResume(ID),
      renameResume(ID, "x"),
      deleteResume(ID),
      saveResume(ID, { ...content, baseUpdatedAt: base }),
    ];
    for (const call of calls)
      await expect(call).rejects.toThrow("NEXT_REDIRECT");
    expect(
      Object.values(repo).every((fn) => !vi.mocked(fn).mock.calls.length),
    ).toBe(true);
  });

  it("scopes repo calls to the session user", async () => {
    vi.mocked(repo.deleteForUser).mockResolvedValue(true);
    vi.mocked(repo.renameForUser).mockResolvedValue(true);
    await deleteResume(ID);
    await renameResume(ID, "New");
    expect(repo.deleteForUser).toHaveBeenCalledWith("user-a", ID);
    expect(repo.renameForUser).toHaveBeenCalledWith("user-a", ID, "New");
  });

  it("another user's resume is not found", async () => {
    vi.mocked(repo.deleteForUser).mockResolvedValue(false);
    vi.mocked(repo.findForUser).mockResolvedValue(null);
    expect(await deleteResume(ID)).toEqual({ ok: false, error: "not_found" });
    expect(await duplicateResume(ID)).toEqual({
      ok: false,
      error: "not_found",
    });
  });

  it("rejects malformed ids without touching the db", async () => {
    expect(await deleteResume("1 or 1=1")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(repo.deleteForUser).not.toHaveBeenCalled();
  });
});

describe("createResume", () => {
  it("defaults to empty data + template theme; unknown template falls back", async () => {
    vi.mocked(repo.insertForUser).mockResolvedValue(ID);
    expect(await createResume({ templateId: "template-1" })).toEqual({
      ok: true,
      id: ID,
    });
    expect(repo.insertForUser).toHaveBeenCalledWith(
      "user-a",
      expect.objectContaining({ templateId: "sidebar", data: emptyResume() }),
    );
  });

  it("validates provided content", async () => {
    expect(
      await createResume({ content: { ...content, theme: { accent: 1 } } }),
    ).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(repo.insertForUser).not.toHaveBeenCalled();
  });
});

describe("saveResume", () => {
  it("returns the new updatedAt", async () => {
    const updated = new Date("2026-01-02T00:00:00.000Z");
    vi.mocked(repo.saveForUser).mockResolvedValue(updated);
    expect(await saveResume(ID, { ...content, baseUpdatedAt: base })).toEqual({
      ok: true,
      updatedAt: updated.toISOString(),
    });
    expect(repo.saveForUser).toHaveBeenCalledWith("user-a", ID, content, base);
  });

  it("stale base on an existing resume is a conflict", async () => {
    vi.mocked(repo.saveForUser).mockResolvedValue(null);
    vi.mocked(repo.findForUser).mockResolvedValue({ id: ID } as never);
    expect(await saveResume(ID, { ...content, baseUpdatedAt: base })).toEqual({
      ok: false,
      error: "conflict",
    });
  });

  it("missing or foreign resume is not found", async () => {
    vi.mocked(repo.saveForUser).mockResolvedValue(null);
    vi.mocked(repo.findForUser).mockResolvedValue(null);
    expect(await saveResume(ID, { ...content, baseUpdatedAt: base })).toEqual({
      ok: false,
      error: "not_found",
    });
  });
});

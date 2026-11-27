import { useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { createStore } from "zustand/vanilla";

import type { ResumeDoc, ResumeDocState } from "@/lib/resume/doc";
import { createDocOps } from "@/lib/resume/doc-ops";
import { saveResume } from "@/server/resumes";

export type SaveStatus = "saved" | "pending" | "saving" | "error" | "conflict";

const SAVE_DELAY = 1000;

/**
 * Saved resume: local store for instant UI + debounced `saveResume`.
 * One in-flight save at a time; edits during a save are sent right after.
 * A `conflict` (row changed elsewhere) stops autosave until reload.
 */
export function createServerResumeDoc(
  id: string,
  initial: ResumeDocState & { updatedAt: string },
) {
  const { updatedAt, ...state } = initial;
  const store = createStore<ResumeDocState>()(immer(() => state));
  const statusStore = createStore<{ status: SaveStatus }>()(() => ({
    status: "saved",
  }));

  let base = updatedAt;
  let dirty = false;
  let inFlight: Promise<void> | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const getStatus = () => statusStore.getState().status;
  const setStatus = (status: SaveStatus) => statusStore.setState({ status });

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(flush, SAVE_DELAY);
  }

  async function save() {
    dirty = false;
    setStatus("saving");
    try {
      const res = await saveResume(id, {
        ...store.getState(),
        baseUpdatedAt: base,
      });
      if (res.ok) {
        base = res.updatedAt;
        setStatus(dirty ? "pending" : "saved");
      } else if (res.error === "conflict") {
        setStatus("conflict");
      } else {
        dirty = true;
        setStatus("error");
      }
    } catch {
      dirty = true;
      setStatus("error");
    }
  }

  /** Saves pending edits now; resolves when nothing is in flight. */
  async function flush(): Promise<void> {
    clearTimeout(timer);
    if (inFlight) {
      await inFlight;
      return dirty ? flush() : undefined;
    }
    if (!dirty || getStatus() === "conflict") return;
    inFlight = save().finally(() => {
      inFlight = null;
    });
    await inFlight;
    if (dirty && getStatus() === "pending") schedule();
  }

  store.subscribe(() => {
    if (getStatus() === "conflict") return;
    dirty = true;
    if (!inFlight) setStatus("pending");
    schedule();
  });

  const doc: ResumeDoc = {
    useSelect: (selector) => useStore(store, useShallow(selector)),
    ops: createDocOps(store),
  };

  return {
    doc,
    flush,
    useStatus: () => useStore(statusStore, (s) => s.status),
    hasUnsaved: () => dirty || inFlight !== null,
    onStatus: (listener: (status: SaveStatus) => void) =>
      statusStore.subscribe((s) => listener(s.status)),
  };
}

export type ServerResumeHandle = ReturnType<typeof createServerResumeDoc>;

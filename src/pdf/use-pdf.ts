import { useEffect, useRef, useState } from "react";

import type { RenderInput } from "./engine";
import type { WorkerRequest, WorkerResponse } from "./worker";

let worker: Worker | null = null;
let nextId = 0;
const pending = new Map<number, (res: WorkerResponse) => void>();

function getWorker() {
  if (!worker) {
    worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });
    worker.onmessage = ({ data }: MessageEvent<WorkerResponse>) => {
      pending.get(data.id)?.(data);
      pending.delete(data.id);
    };
  }
  return worker;
}

/** Renders off the main thread; one shared worker. */
export function renderPdf(input: RenderInput) {
  const id = ++nextId;
  return new Promise<Blob>((resolve, reject) => {
    pending.set(id, (res) =>
      "error" in res
        ? reject(new Error(res.error))
        : resolve(new Blob([res.buffer], { type: "application/pdf" })),
    );
    getWorker().postMessage({ id, ...input } satisfies WorkerRequest);
  });
}

type Result = { input: RenderInput; blob: Blob | null; error: string | null };

/** Debounced (first render immediate), latest-wins PDF for `input`. */
export function usePdf(input: RenderInput, delay = 400) {
  const { data, theme, templateId } = input;
  const [result, setResult] = useState<Result | null>(null);
  const rendered = useRef(false);

  useEffect(() => {
    let stale = false;
    const current = { data, theme, templateId };
    const timer = setTimeout(
      () =>
        renderPdf(current).then(
          (blob) => {
            rendered.current = true;
            if (!stale) setResult({ input: current, blob, error: null });
          },
          (err: Error) =>
            !stale &&
            setResult((r) => ({
              input: current,
              blob: r?.blob ?? null,
              error: err.message,
            })),
        ),
      rendered.current ? delay : 0,
    );
    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [data, theme, templateId, delay]);

  const done =
    result?.input.data === data &&
    result.input.theme === theme &&
    result.input.templateId === templateId;

  return {
    blob: result?.blob ?? null,
    error: result?.error ?? null,
    loading: !done,
  };
}

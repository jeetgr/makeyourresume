import { renderResume, type RenderInput } from "./engine";
import { registerFonts } from "./fonts";

export type WorkerRequest = RenderInput & { id: number };
export type WorkerResponse =
  { id: number; buffer: ArrayBuffer } | { id: number; error: string };

const ctx = self as unknown as {
  location: Location;
  onmessage: ((e: MessageEvent<WorkerRequest>) => void) | null;
  postMessage: (msg: WorkerResponse, transfer?: Transferable[]) => void;
};

registerFonts(ctx.location.origin);

ctx.onmessage = async ({ data: { id, ...input } }) => {
  try {
    const buffer = await (await renderResume(input)).arrayBuffer();
    ctx.postMessage({ id, buffer }, [buffer]);
  } catch (err) {
    ctx.postMessage({
      id,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

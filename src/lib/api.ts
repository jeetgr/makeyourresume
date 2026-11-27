type ApiOptions = {
  method?: "GET" | "POST" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
};

/** JSON request to our API; throws the server's `message` on non-2xx. */
export async function api<T = { message: string }>(
  url: string,
  { method = "POST", body, signal }: ApiOptions = {},
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.message || "An error occurred!");

  return data as T;
}

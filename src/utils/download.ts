/** `("resume", "John", "Doe")` → `resume-john-doe`. */
export const fileSlug = (...parts: string[]) =>
  parts
    .join("-")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

/** Saves a blob via a temporary `<a download>`. */
export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const downloadJson = (value: unknown, name: string) =>
  downloadBlob(
    new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
    name,
  );

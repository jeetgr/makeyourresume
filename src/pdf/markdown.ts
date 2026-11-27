export type Segment = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  href?: string;
};

type Marks = Omit<Segment, "text">;

const pattern =
  /\*\*(\S(?:.*?\S)?)\*\*|\*([^*\s](?:[^*]*[^*\s])?)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Inline markdown subset (Q32): `**bold**`, `*italic*`, `[text](url)`. */
export function parseInline(src: string, marks: Marks = {}): Segment[] {
  const out: Segment[] = [];
  let last = 0;

  for (const m of src.matchAll(pattern)) {
    if (m.index > last) out.push({ ...marks, text: src.slice(last, m.index) });

    if (m[1] !== undefined) {
      out.push(...parseInline(m[1], { ...marks, bold: true }));
    } else if (m[2] !== undefined) {
      out.push(...parseInline(m[2], { ...marks, italic: true }));
    } else {
      out.push(...parseInline(m[3], { ...marks, href: m[4] }));
    }
    last = m.index + m[0].length;
  }

  if (last < src.length) out.push({ ...marks, text: src.slice(last) });
  return out;
}

/** Non-empty lines; each renders as its own paragraph. */
export const paragraphs = (src: string) =>
  src
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

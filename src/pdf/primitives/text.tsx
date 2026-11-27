import { Link, Text, type Styles } from "@react-pdf/renderer";

import { formatDateRange } from "@/lib/resume/format";
import type { DateRange as DateRangeValue } from "@/lib/resume/schema";

import { paragraphs, parseInline } from "../markdown";
import { useTokens } from "../tokens";

type Style = Styles[string];

/** Markdown subset; one `<Text>` per non-empty line. */
export function Markdown({ text, style }: { text: string; style?: Style }) {
  const { accent } = useTokens();

  return paragraphs(text).map((line, i) => (
    <Text key={i} style={style} orphans={2} widows={2}>
      {parseInline(line).map((s, j) => {
        const marks = {
          fontWeight: s.bold ? 700 : undefined,
          fontStyle: s.italic ? ("italic" as const) : undefined,
        };
        return s.href ? (
          <Link
            key={j}
            src={s.href}
            style={{ ...marks, color: accent, textDecoration: "none" }}
          >
            {s.text}
          </Link>
        ) : (
          <Text key={j} style={marks}>
            {s.text}
          </Text>
        );
      })}
    </Text>
  ));
}

/** `https://www.x.com/a/` → `x.com/a`. */
export const displayUrl = (url: string) =>
  url.replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/$/, "");

const withProtocol = (url: string) =>
  /^[a-z][a-z\d+.-]*:/i.test(url) ? url : `https://${url}`;

export function LinkText({
  url,
  children,
  style,
}: {
  url: string;
  children?: string;
  style?: Style;
}) {
  const { text } = useTokens();

  return (
    <Link
      src={withProtocol(url)}
      style={{ color: text, textDecoration: "none", ...style }}
    >
      {children || displayUrl(url)}
    </Link>
  );
}

export function DateRange({
  dates,
  style,
}: {
  dates?: DateRangeValue;
  style?: Style;
}) {
  const text = dates ? formatDateRange(dates) : "";
  return text ? <Text style={style}>{text}</Text> : null;
}

import { Text, View } from "@react-pdf/renderer";

import { useTokens } from "../tokens";
import { Markdown } from "./text";

/** Accent uppercase heading; keeps ≥ 40pt of following content on the same page. */
export function SectionTitle({
  children,
  rule = false,
}: {
  children: string;
  rule?: boolean;
}) {
  const t = useTokens();

  return (
    <View
      minPresenceAhead={40}
      style={{
        marginBottom: t.space(1.5),
        paddingBottom: rule ? 1.5 : 0,
        borderBottomWidth: rule ? 0.8 : 0,
        borderBottomColor: t.accent,
      }}
    >
      <Text
        style={{
          color: t.accent,
          fontSize: t.size.lg,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.3,
        }}
      >
        {children}
      </Text>
    </View>
  );
}

/** Bullet list w/ markdown text; `marker` defaults to a small accent square. */
export function Bullets({
  items,
  marker,
}: {
  items: { id: string; text: string }[];
  marker?: React.ReactNode;
}) {
  const t = useTokens();
  const lines = items.filter((b) => b.text.trim());
  if (!lines.length) return null;

  const box = t.size.base * 0.45;
  const dot = marker ?? (
    <View
      style={{
        width: box,
        height: box,
        borderWidth: 0.8,
        borderColor: t.accent,
        marginTop: t.size.base * 0.4,
      }}
    />
  );

  return (
    <View style={{ gap: t.space(0.5) }}>
      {lines.map(({ id, text }) => (
        <View key={id} style={{ flexDirection: "row", gap: t.space(1.5) }}>
          {dot}
          <View style={{ flex: 1 }}>
            <Markdown text={text} />
          </View>
        </View>
      ))}
    </View>
  );
}

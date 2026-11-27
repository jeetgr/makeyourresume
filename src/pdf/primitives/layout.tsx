import { Text, View } from "@react-pdf/renderer";

import { useTokens } from "../tokens";
import { Markdown } from "./text";

/** Accent uppercase heading. Keep it with the next content via a `wrap={false}` group; `minPresenceAhead` is ignored on first children. */
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
      style={{
        marginBottom: t.space(1.5),
        paddingBottom: rule ? 2 : 0,
        borderBottomWidth: rule ? 0.8 : 0,
        borderBottomColor: t.accent,
      }}
    >
      <Text
        style={{
          color: t.accent,
          fontSize: t.size.lg,
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: 0.3,
        }}
      >
        {children.toUpperCase()}
      </Text>
    </View>
  );
}

/** One unbreakable bullet row w/ markdown text; `marker` defaults to a small accent square. */
export function Bullet({
  text,
  marker,
}: {
  text: string;
  marker?: React.ReactNode;
}) {
  const t = useTokens();
  const box = t.size.base * 0.45;

  return (
    <View
      wrap={false}
      style={{ flexDirection: "row", gap: t.space(1.5), flexShrink: 0 }}
    >
      {marker ?? (
        <View
          style={{
            width: box,
            height: box,
            borderWidth: 0.8,
            borderColor: t.accent,
            marginTop: t.size.base * 0.4,
          }}
        />
      )}
      <View style={{ flex: 1 }}>
        <Markdown text={text} />
      </View>
    </View>
  );
}

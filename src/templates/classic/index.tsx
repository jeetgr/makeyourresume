import { Children, Fragment } from "react";
import { Text, View } from "@react-pdf/renderer";

import type { ResumeData } from "@/lib/resume/schema";

import { ResumeDocument, fullName } from "@/pdf/primitives/document";
import { Bullet } from "@/pdf/primitives/layout";
import {
  DateRange,
  LinkText,
  Markdown,
  displayUrl,
} from "@/pdf/primitives/text";
import { paragraphs } from "@/pdf/markdown";
import { type Tokens, useTokens } from "@/pdf/tokens";

import { type EntryData, sectionEntries, sectionTitle } from "../entries";
import type { TemplateProps } from "../types";
import { nonEmpty, visibleOrder } from "../utils";

type SectionProps = { data: ResumeData };

export function ClassicDocument({ data, theme }: TemplateProps) {
  const order = visibleOrder(data);

  return (
    <ResumeDocument
      data={data}
      theme={theme}
      pageStyle={{ paddingVertical: 36, paddingHorizontal: 44 }}
    >
      <Header data={data} showLinks={order.includes("links")} />
      {order.map((key) => (
        <Section key={key} data={data} sectionKey={key} />
      ))}
    </ResumeDocument>
  );
}

function Header({ data, showLinks }: SectionProps & { showLinks: boolean }) {
  const t = useTokens();
  const name = fullName(data.profile);
  const { headline, email, phone, location } = data.profile;
  const links = showLinks ? nonEmpty(data.links, (l) => l.url) : [];

  const lines = [
    [
      email && <LinkText url={`mailto:${email}`}>{email}</LinkText>,
      phone && (
        <LinkText url={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</LinkText>
      ),
      location && <Text>{location}</Text>,
    ].filter(Boolean),
    links.map(({ id, url, label }) => (
      <LinkText key={id} url={url}>
        {label || displayUrl(url)}
      </LinkText>
    )),
  ].filter((line) => line.length);

  if (!name && !headline && !lines.length) return null;

  return (
    <View
      style={{
        alignItems: "center",
        gap: t.space(1),
        marginBottom: t.space(1),
      }}
    >
      {name && (
        <Text
          style={{
            fontSize: t.size.xl,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: 0.5,
          }}
        >
          {name}
        </Text>
      )}
      {headline && (
        <Text style={{ fontSize: t.size.md, color: t.muted }}>{headline}</Text>
      )}
      {lines.map((line, l) => (
        <Text key={l} style={{ textAlign: "center" }}>
          {line.map((node, i) => (
            <Fragment key={i}>
              {i > 0 && <Text style={{ color: t.muted }}>{"  ·  "}</Text>}
              {node}
            </Fragment>
          ))}
        </Text>
      ))}
    </View>
  );
}

/** Faux small caps (uppercase, tracked) over an accent hairline. */
function Heading({ children }: { children: string }) {
  const t = useTokens();

  return (
    <View
      style={{
        marginBottom: t.space(1.5),
        paddingBottom: 1.5,
        borderBottomWidth: 0.5,
        borderBottomColor: t.accent,
      }}
    >
      <Text
        style={{
          color: t.accent,
          fontSize: t.size.base,
          fontWeight: 700,
          letterSpacing: 0.7,
          lineHeight: 1.2,
        }}
      >
        {children.toUpperCase()}
      </Text>
    </View>
  );
}

const inline = (items: string[]) => items.join(", ");

/** Heading + first block stay together; the rest flows (flat blocks, see Sidebar). */
function Section({ data, sectionKey }: SectionProps & { sectionKey: string }) {
  const t = useTokens();
  const title = sectionTitle(data, sectionKey);
  const top = { marginTop: t.space(4) };

  const block = (first: React.ReactNode, rest?: React.ReactNode) => (
    <>
      <View wrap={false} style={top}>
        {title && <Heading>{title}</Heading>}
        {first}
      </View>
      {rest}
    </>
  );

  switch (sectionKey) {
    case "summary": {
      const [first, ...rest] = paragraphs(data.profile.summary);
      if (!first) return null;
      return block(
        <Markdown text={first} />,
        rest.length > 0 && <Markdown text={rest.join("\n")} />,
      );
    }
    case "links":
      return null;
    case "skills": {
      const skills = nonEmpty(data.skills, (s) => s.name).map((s) => s.name);
      return skills.length ? block(<Text>{inline(skills)}</Text>) : null;
    }
    case "languages": {
      const languages = nonEmpty(data.languages, (l) => l.name);
      if (!languages.length) return null;
      return block(
        <Text>
          {languages.map(({ id, name, proficiency }, i) => (
            <Fragment key={id}>
              {i > 0 && ", "}
              <Text style={{ fontWeight: 700 }}>{name}</Text>
              {proficiency && ` (${proficiency})`}
            </Fragment>
          ))}
        </Text>,
      );
    }
    case "interests": {
      const interests = nonEmpty(data.interests, (i) => i.name).map(
        (i) => i.name,
      );
      return interests.length ? block(<Text>{inline(interests)}</Text>) : null;
    }
  }

  const entries = sectionEntries(data, sectionKey, {
    bullet: (b) => (
      <Bullet
        key={b.id}
        text={b.text}
        marker={<Text style={{ width: t.size.base * 0.6 }}>•</Text>}
      />
    ),
    meta: (text) => (
      <Text style={{ color: t.muted, fontStyle: "italic" }}>{text}</Text>
    ),
  });
  if (!entries?.length) return null;

  return entries.map(({ id, ...entry }, i) => {
    const [head, rest] = entryBlocks(entry, t);
    return i === 0 ? (
      <Fragment key={id}>{block(head, rest)}</Fragment>
    ) : (
      <Fragment key={id}>
        <View wrap={false} style={{ marginTop: t.space(2.5) }}>
          {head}
        </View>
        {rest}
      </Fragment>
    );
  });
}

/** `[head + lead, rest]`; head is meant for a `wrap={false}` block. */
function entryBlocks(
  {
    title,
    subtitle,
    dates,
    location,
    meta,
    link,
    lead,
    rest,
  }: Omit<EntryData, "id">,
  t: Tokens,
) {
  const small = { fontSize: t.size.sm, color: t.muted };
  const body = { paddingLeft: t.space(1), gap: t.space(0.5) };
  const right = dates ? (
    <DateRange dates={dates} style={small} />
  ) : meta ? (
    <Text style={small}>{meta}</Text>
  ) : null;

  const head = (
    <View style={{ gap: t.space(0.5) }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: t.space(2),
        }}
      >
        <Text style={{ flex: 1 }}>
          {title && <Text style={{ fontWeight: 700 }}>{title}</Text>}
          {title && subtitle && " — "}
          {subtitle}
        </Text>
        {right && <View style={{ flexShrink: 0 }}>{right}</View>}
      </View>
      {(location || link || (dates && meta)) && (
        <Text style={{ ...small, fontStyle: "italic" }}>
          {[location, dates && meta].filter(Boolean).join(" · ")}
          {link && (
            <>
              {(location || (dates && meta)) && " · "}
              <LinkText url={link} style={{ color: t.muted }} />
            </>
          )}
        </Text>
      )}
      {lead && <View style={body}>{lead}</View>}
    </View>
  );

  const hasRest = Children.toArray(rest).length > 0;
  return [
    head,
    hasRest && <View style={{ ...body, marginTop: t.space(0.5) }}>{rest}</View>,
  ] as const;
}

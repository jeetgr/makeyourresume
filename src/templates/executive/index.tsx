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

export function ExecutiveDocument({ data, theme }: TemplateProps) {
  const order = visibleOrder(data);

  return (
    <ResumeDocument
      data={data}
      theme={theme}
      pageStyle={{ paddingVertical: 28, paddingHorizontal: 34 }}
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
        gap: t.space(1),
        paddingBottom: t.space(1.5),
        borderBottomWidth: 2,
        borderBottomColor: t.accent,
      }}
    >
      {(name || headline) && (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            columnGap: t.space(3),
          }}
        >
          {name && (
            <Text
              style={{
                fontSize: t.size.xl * 0.85,
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              {name}
            </Text>
          )}
          {headline && (
            <Text
              style={{ color: t.accent, fontSize: t.size.md, fontWeight: 700 }}
            >
              {headline}
            </Text>
          )}
        </View>
      )}
      {lines.map((line, l) => (
        <Text key={l} style={{ fontSize: t.size.sm }}>
          {line.map((node, i) => (
            <Fragment key={i}>
              {i > 0 && <Text style={{ color: t.tint(0.6) }}>{"  |  "}</Text>}
              {node}
            </Fragment>
          ))}
        </Text>
      ))}
    </View>
  );
}

function Heading({ children }: { children: string }) {
  const t = useTokens();

  return (
    <View
      style={{
        marginBottom: t.space(1.25),
        paddingBottom: 1,
        borderBottomWidth: 0.5,
        borderBottomColor: t.tint(0.5),
      }}
    >
      <Text
        style={{
          color: t.accent,
          fontSize: t.size.sm * 1.05,
          fontWeight: 700,
          letterSpacing: 0.6,
          lineHeight: 1.2,
        }}
      >
        {children.toUpperCase()}
      </Text>
    </View>
  );
}

const inline = (items: string[]) => items.join(", ");

/** Sections whose entries lead with the organization (subtitle), then the role. */
const ORG_FIRST = new Set(["experience", "education"]);

/** Heading + first block stay together; the rest flows (flat blocks, see Sidebar). */
function Section({ data, sectionKey }: SectionProps & { sectionKey: string }) {
  const t = useTokens();
  const title = sectionTitle(data, sectionKey);

  const block = (first: React.ReactNode, rest?: React.ReactNode) => (
    <>
      <View wrap={false} style={{ marginTop: t.space(3.5) }}>
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
      const emphasis = {
        fontSize: t.size.base + 0.5,
        paddingLeft: t.space(2),
        borderLeftWidth: 2,
        borderLeftColor: t.tint(0.5),
      };
      return block(
        <View style={emphasis}>
          <Markdown text={first} />
        </View>,
        rest.length > 0 && (
          <View style={{ ...emphasis, paddingTop: t.space(1) }}>
            <Markdown text={rest.join("\n")} />
          </View>
        ),
      );
    }
    case "links":
      return null;
    case "skills": {
      const skills = nonEmpty(data.skills, (s) => s.name);
      if (!skills.length) return null;
      const square = t.size.base * 0.35;
      return block(
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            rowGap: t.space(0.5),
          }}
        >
          {skills.map(({ id, name }) => (
            <View
              key={id}
              style={{
                width: "33.33%",
                flexDirection: "row",
                gap: t.space(1),
                paddingRight: t.space(1),
              }}
            >
              <View
                style={{
                  width: square,
                  height: square,
                  marginTop: t.size.base * 0.32,
                  backgroundColor: t.accent,
                }}
              />
              <Text style={{ flex: 1 }}>{name}</Text>
            </View>
          ))}
        </View>,
      );
    }
    case "languages": {
      const languages = nonEmpty(data.languages, (l) => l.name);
      if (!languages.length) return null;
      return block(
        <Text>
          {languages.map(({ id, name, proficiency }, i) => (
            <Fragment key={id}>
              {i > 0 && "  |  "}
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
        marker={<Text style={{ width: t.size.base * 0.5 }}>•</Text>}
      />
    ),
    meta: (text) => (
      <Text style={{ color: t.muted, fontStyle: "italic" }}>{text}</Text>
    ),
  });
  if (!entries?.length) return null;

  return entries.map(({ id, ...entry }, i) => {
    const [head, rest] = entryBlocks(entry, t, ORG_FIRST.has(sectionKey));
    return i === 0 ? (
      <Fragment key={id}>{block(head, rest)}</Fragment>
    ) : (
      <Fragment key={id}>
        <View wrap={false} style={{ marginTop: t.space(2.25) }}>
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
  orgFirst: boolean,
) {
  const small = { fontSize: t.size.sm, color: t.muted };
  const row = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: t.space(2),
  } as const;
  const body = { gap: t.space(0.4), marginTop: t.space(0.5) };
  const [primary, secondary] =
    orgFirst && subtitle ? [subtitle, title] : [title, subtitle];
  const right = dates ? (
    <DateRange dates={dates} style={{ ...small, fontWeight: 700 }} />
  ) : (
    meta && <Text style={small}>{meta}</Text>
  );
  const sideNote = location || (dates && meta) || "";

  const head = (
    <View>
      <View style={row}>
        <Text style={{ flex: 1, fontWeight: 700 }}>{primary}</Text>
        {right}
      </View>
      {(secondary || link || sideNote) && (
        <View style={row}>
          <Text style={{ flex: 1, fontStyle: "italic" }}>
            {secondary}
            {link && (
              <Text style={{ fontStyle: "normal" }}>
                {secondary && "  "}
                <LinkText url={link} style={{ color: t.accent }} />
              </Text>
            )}
          </Text>
          {sideNote && <Text style={small}>{sideNote}</Text>}
        </View>
      )}
      {lead && <View style={body}>{lead}</View>}
    </View>
  );

  return [
    head,
    Children.toArray(rest).length > 0 && (
      <View style={{ ...body, marginTop: t.space(0.4) }}>{rest}</View>
    ),
  ] as const;
}

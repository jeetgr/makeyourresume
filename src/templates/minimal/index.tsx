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

const GUTTER = "22%";

type SectionProps = { data: ResumeData };

export function MinimalDocument({ data, theme }: TemplateProps) {
  const order = visibleOrder(data);

  return (
    <ResumeDocument
      data={data}
      theme={theme}
      pageStyle={{ paddingVertical: 48, paddingHorizontal: 56 }}
    >
      <Header data={data} showLinks={order.includes("links")} />
      {order.map((key) => (
        <Section key={key} data={data} sectionKey={key} />
      ))}
    </ResumeDocument>
  );
}

/** Left gutter (dates) + content column; one row keeps a single reading flow. */
function Row({
  gutter,
  children,
  style,
}: {
  gutter?: React.ReactNode;
  children: React.ReactNode;
  style?: { marginTop?: number; marginBottom?: number };
}) {
  const t = useTokens();

  return (
    <View style={{ flexDirection: "row", ...style }}>
      <View style={{ width: GUTTER, paddingRight: t.space(3) }}>{gutter}</View>
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

function Header({ data, showLinks }: SectionProps & { showLinks: boolean }) {
  const t = useTokens();
  const name = fullName(data.profile);
  const { headline, email, phone, location } = data.profile;
  const links = showLinks ? nonEmpty(data.links, (l) => l.url) : [];

  const contacts = [
    email && <LinkText url={`mailto:${email}`}>{email}</LinkText>,
    phone && (
      <LinkText url={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</LinkText>
    ),
    location && <Text>{location}</Text>,
    ...links.map(({ id, url, label }) => (
      <LinkText key={id} url={url}>
        {label || displayUrl(url)}
      </LinkText>
    )),
  ].filter(Boolean);

  if (!name && !headline && !contacts.length) return null;

  return (
    <View style={{ gap: t.space(1.25), marginBottom: t.space(2) }}>
      {name && (
        <Text style={{ color: t.accent, fontSize: t.size.xl, lineHeight: 1.1 }}>
          {name}
        </Text>
      )}
      {headline && (
        <Text style={{ fontSize: t.size.md, color: t.muted }}>{headline}</Text>
      )}
      {contacts.length > 0 && (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            columnGap: t.space(3.5),
            rowGap: t.space(0.5),
            marginTop: t.space(0.5),
            fontSize: t.size.sm,
          }}
        >
          {contacts.map((node, i) => (
            <Fragment key={i}>{node}</Fragment>
          ))}
        </View>
      )}
    </View>
  );
}

function Heading({ children }: { children: string }) {
  const t = useTokens();

  return (
    <Row style={{ marginBottom: t.space(2) }}>
      <View
        style={{
          paddingBottom: t.space(0.75),
          borderBottomWidth: 0.5,
          borderBottomColor: t.tint(0.5),
        }}
      >
        <Text
          style={{
            color: t.muted,
            fontSize: t.size.sm,
            fontWeight: 700,
            letterSpacing: 0.6,
            lineHeight: 1.2,
          }}
        >
          {children.toUpperCase()}
        </Text>
      </View>
    </Row>
  );
}

const inline = (items: string[]) => items.join(", ");

/** Heading + first block stay together; the rest flows (flat blocks, see Sidebar). */
function Section({ data, sectionKey }: SectionProps & { sectionKey: string }) {
  const t = useTokens();
  const title = sectionTitle(data, sectionKey);

  const block = (first: React.ReactNode, rest?: React.ReactNode) => (
    <>
      <View wrap={false} style={{ marginTop: t.space(5.5) }}>
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
        <Row>
          <Markdown text={first} />
        </Row>,
        rest.length > 0 && (
          <Row>
            <Markdown text={rest.join("\n")} />
          </Row>
        ),
      );
    }
    case "links":
      return null;
    case "skills": {
      const skills = nonEmpty(data.skills, (s) => s.name).map((s) => s.name);
      if (!skills.length) return null;
      return block(
        <Row>
          <Text>{inline(skills)}</Text>
        </Row>,
      );
    }
    case "languages": {
      const languages = nonEmpty(data.languages, (l) => l.name);
      if (!languages.length) return null;
      return block(
        <Row>
          <Text>
            {languages.map(({ id, name, proficiency }, i) => (
              <Fragment key={id}>
                {i > 0 && ", "}
                {name}
                {proficiency && (
                  <Text style={{ color: t.muted }}> ({proficiency})</Text>
                )}
              </Fragment>
            ))}
          </Text>
        </Row>,
      );
    }
    case "interests": {
      const interests = nonEmpty(data.interests, (i) => i.name).map(
        (i) => i.name,
      );
      if (!interests.length) return null;
      return block(
        <Row>
          <Text>{inline(interests)}</Text>
        </Row>,
      );
    }
  }

  const entries = sectionEntries(data, sectionKey, {
    bullet: (b) => (
      <Bullet
        key={b.id}
        text={b.text}
        marker={<Text style={{ color: t.muted }}>–</Text>}
      />
    ),
    meta: (text) => (
      <Text style={{ color: t.muted, fontSize: t.size.sm }}>{text}</Text>
    ),
  });
  if (!entries?.length) return null;

  return entries.map(({ id, ...entry }, i) => {
    const [head, rest] = entryBlocks(entry, t);
    return i === 0 ? (
      <Fragment key={id}>{block(head, rest)}</Fragment>
    ) : (
      <Fragment key={id}>
        <View wrap={false} style={{ marginTop: t.space(3.5) }}>
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
  const body = { gap: t.space(0.75), marginTop: t.space(1) };
  const gutter = dates ? (
    <DateRange dates={dates} style={small} />
  ) : (
    meta && <Text style={small}>{meta}</Text>
  );
  const details = [subtitle, location, dates && meta].filter(Boolean);

  const head = (
    <Row gutter={gutter}>
      <Text style={{ fontWeight: 700 }}>{title}</Text>
      {(details.length > 0 || link) && (
        <Text style={small}>
          {details.join(", ")}
          {link && (
            <>
              {details.length > 0 && " · "}
              <LinkText url={link} style={{ color: t.muted }} />
            </>
          )}
        </Text>
      )}
      {lead && <View style={body}>{lead}</View>}
    </Row>
  );

  return [
    head,
    Children.toArray(rest).length > 0 && (
      <Row>
        <View style={{ ...body, marginTop: t.space(0.75) }}>{rest}</View>
      </Row>
    ),
  ] as const;
}

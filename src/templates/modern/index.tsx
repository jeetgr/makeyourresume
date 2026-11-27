import { Children, Fragment } from "react";
import { Image, Text, View } from "@react-pdf/renderer";

import type { ResumeData } from "@/lib/resume/schema";

import { ResumeDocument, fullName } from "@/pdf/primitives/document";
import { Icon } from "@/pdf/primitives/icon";
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

const PHOTO_SIZE = 64;

type SectionProps = { data: ResumeData };
type Contact = { icon: string; text: string; url?: string };

export function ModernDocument({ data, theme }: TemplateProps) {
  const order = visibleOrder(data);

  return (
    <ResumeDocument
      data={data}
      theme={theme}
      pageStyle={{ paddingVertical: 34, paddingHorizontal: 40 }}
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
  const { headline, email, phone, location, photo } = data.profile;
  const links = showLinks ? nonEmpty(data.links, (l) => l.url) : [];

  const contacts = [
    email && { icon: "mail", text: email, url: `mailto:${email}` },
    phone && {
      icon: "phone",
      text: phone,
      url: `tel:${phone.replace(/[^\d+]/g, "")}`,
    },
    location && { icon: "mapPin", text: location },
    ...links.map(({ network, url, label }) => ({
      icon: network,
      text: label || displayUrl(url),
      url,
    })),
  ].filter((c): c is Contact => !!c);

  if (!name && !headline && !contacts.length && !photo) return null;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: t.space(4),
        paddingBottom: t.space(3),
        borderBottomWidth: 1,
        borderBottomColor: t.tint(0.35),
      }}
    >
      <View style={{ flex: 1, gap: t.space(1) }}>
        {name && (
          <Text
            style={{
              color: t.accent,
              fontSize: t.size.xl,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            {name}
          </Text>
        )}
        {headline && (
          <Text style={{ fontSize: t.size.md, color: t.muted }}>
            {headline}
          </Text>
        )}
        {contacts.length > 0 && (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              rowGap: t.space(0.75),
              columnGap: t.space(3),
              marginTop: t.space(1),
            }}
          >
            {contacts.map(({ icon, text, url }, i) => (
              <View
                key={i}
                style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
              >
                <Icon name={icon} size={t.size.sm} color={t.accent} />
                {url ? (
                  <LinkText url={url}>{text}</LinkText>
                ) : (
                  <Text>{text}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
      {photo && (
        <View
          style={{
            width: PHOTO_SIZE,
            height: PHOTO_SIZE,
            borderRadius: PHOTO_SIZE / 2,
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image
            src={photo}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </View>
      )}
    </View>
  );
}

function Heading({ children }: { children: string }) {
  const t = useTokens();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: t.space(2),
        marginBottom: t.space(1.75),
      }}
    >
      <Text
        style={{
          color: t.accent,
          fontSize: t.size.md,
          fontWeight: 700,
          letterSpacing: 0.8,
          lineHeight: 1.2,
        }}
      >
        {children.toUpperCase()}
      </Text>
      <View style={{ flex: 1, height: 0.75, backgroundColor: t.tint(0.3) }} />
    </View>
  );
}

/** Heading + first block stay together; the rest flows (flat blocks, see Sidebar). */
function Section({ data, sectionKey }: SectionProps & { sectionKey: string }) {
  const t = useTokens();
  const title = sectionTitle(data, sectionKey);

  const block = (first: React.ReactNode, rest?: React.ReactNode) => (
    <>
      <View wrap={false} style={{ marginTop: t.space(4.5) }}>
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
      const skills = nonEmpty(data.skills, (s) => s.name);
      if (!skills.length) return null;
      return block(
        <View
          style={{ flexDirection: "row", flexWrap: "wrap", gap: t.space(1.25) }}
        >
          {skills.map(({ id, name }) => (
            <Chip key={id}>{name}</Chip>
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
              {i > 0 && <Text style={{ color: t.tint(0.6) }}>{"   •   "}</Text>}
              <Text style={{ fontWeight: 700 }}>{name}</Text>
              {proficiency && (
                <Text style={{ color: t.muted }}> – {proficiency}</Text>
              )}
            </Fragment>
          ))}
        </Text>,
      );
    }
    case "interests": {
      const interests = nonEmpty(data.interests, (i) => i.name);
      if (!interests.length) return null;
      return block(<Text>{interests.map((i) => i.name).join(", ")}</Text>);
    }
  }

  const dot = t.size.base * 0.3;
  const entries = sectionEntries(data, sectionKey, {
    bullet: (b) => (
      <Bullet
        key={b.id}
        text={b.text}
        marker={
          <View
            style={{
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              backgroundColor: t.accent,
              marginTop: t.size.sm * 0.55,
            }}
          />
        }
      />
    ),
    meta: (text) => (
      <Text style={{ color: t.muted, fontSize: t.size.xs }}>{text}</Text>
    ),
  });
  if (!entries?.length) return null;

  return entries.map(({ id, ...entry }, i) => {
    const [head, rest] = entryBlocks(entry, t);
    return i === 0 ? (
      <Fragment key={id}>{block(head, rest)}</Fragment>
    ) : (
      <Fragment key={id}>
        <View wrap={false} style={{ marginTop: t.space(3) }}>
          {head}
        </View>
        {rest}
      </Fragment>
    );
  });
}

function Chip({ children }: { children: string }) {
  const t = useTokens();

  return (
    <View
      style={{
        backgroundColor: t.tint(0.1),
        borderRadius: 3,
        paddingHorizontal: 5,
        paddingVertical: 2,
      }}
    >
      <Text
        style={{
          fontSize: t.size.xs,
          lineHeight: 1,
          marginTop: -t.capShift(t.size.xs) / 2,
          marginBottom: t.capShift(t.size.xs) / 2,
        }}
      >
        {children}
      </Text>
    </View>
  );
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
  const small = { fontSize: t.size.xs, color: t.muted };
  const row = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: t.space(2),
  } as const;
  const body = { gap: t.space(0.6), marginTop: t.space(0.75) };

  const head = (
    <View>
      <View style={row}>
        <Text style={{ flex: 1, fontSize: t.size.md, fontWeight: 700 }}>
          {title}
        </Text>
        {dates ? (
          <DateRange dates={dates} style={small} />
        ) : (
          meta && <Text style={small}>{meta}</Text>
        )}
      </View>
      {(subtitle || link || location || (dates && meta)) && (
        <View style={row}>
          <Text style={{ flex: 1, color: t.accent, fontWeight: 700 }}>
            {subtitle}
            {link && (
              <Text style={{ fontWeight: 400 }}>
                {subtitle && "  "}
                <LinkText url={link} style={{ color: t.accent }} />
              </Text>
            )}
          </Text>
          {(location || (dates && meta)) && (
            <Text style={small}>{location || meta}</Text>
          )}
        </View>
      )}
      {lead && <View style={body}>{lead}</View>}
    </View>
  );

  return [
    head,
    Children.toArray(rest).length > 0 && (
      <View style={{ ...body, marginTop: t.space(0.6) }}>{rest}</View>
    ),
  ] as const;
}

import { Children } from "react";
import { Image, Text, View } from "@react-pdf/renderer";

import type { ResumeData } from "@/lib/resume/schema";

import { ResumeDocument, fullName } from "@/pdf/primitives/document";
import { Icon } from "@/pdf/primitives/icon";
import { Bullet, SectionTitle } from "@/pdf/primitives/layout";
import {
  DateRange,
  LinkText,
  Markdown,
  displayUrl,
} from "@/pdf/primitives/text";
import { useTokens } from "@/pdf/tokens";

import { type EntryData, sectionEntries, sectionTitle } from "../entries";
import type { TemplateProps } from "../types";
import { nonEmpty, visibleOrder } from "../utils";

const SIDEBAR_WIDTH = 122;

type SectionProps = { data: ResumeData };

export function SidebarDocument({ data, theme }: TemplateProps) {
  const order = visibleOrder(data);

  return (
    <ResumeDocument
      data={data}
      theme={theme}
      pageStyle={{ paddingVertical: 21, paddingLeft: 15 }}
    >
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Sidebar data={data} order={order} />
        <View style={{ flex: 1 }}>
          <Header data={data} showSummary={order.includes("summary")} />
          <MainSections data={data} order={order} />
        </View>
      </View>
    </ResumeDocument>
  );
}

function Sidebar({ data, order }: SectionProps & { order: string[] }) {
  const t = useTokens();
  const { email, phone, location } = data.profile;
  const links = order.includes("links")
    ? nonEmpty(data.links, (l) => l.url)
    : [];

  return (
    <View style={{ width: SIDEBAR_WIDTH, gap: t.space(3.5) }}>
      <Photo data={data} />

      <View style={{ gap: t.space(1.75) }}>
        {email && (
          <Contact icon="mail" url={`mailto:${email}`}>
            {email}
          </Contact>
        )}
        {phone && (
          <Contact icon="phone" url={`tel:${phone.replace(/[^\d+]/g, "")}`}>
            {phone}
          </Contact>
        )}
        {location && <Contact icon="mapPin">{location}</Contact>}
        {links.map(({ id, network, url, label }) => (
          <Contact key={id} icon={network} url={url}>
            {label || displayUrl(url)}
          </Contact>
        ))}
      </View>

      {order.map((key) => {
        switch (key) {
          case "skills":
            return <Skills key={key} data={data} />;
          case "languages":
            return <Languages key={key} data={data} />;
          case "interests":
            return <Interests key={key} data={data} />;
          default:
            return null;
        }
      })}
    </View>
  );
}

function Photo({ data }: SectionProps) {
  const t = useTokens();
  const { photo, firstName, lastName } = data.profile;
  const initials = (firstName[0] ?? "") + (lastName[0] ?? "");
  if (!photo && !initials) return null;

  return (
    <View
      style={{
        width: SIDEBAR_WIDTH,
        height: SIDEBAR_WIDTH,
        borderWidth: 1,
        borderColor: t.accent,
        borderRadius: 3,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {photo ? (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image
          src={photo}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <Text
          style={{
            color: t.accent,
            fontSize: 56,
            lineHeight: 1,
            marginTop: -2 * t.capShift(56),
          }}
        >
          {initials.toUpperCase()}
        </Text>
      )}
    </View>
  );
}

function Contact({
  icon,
  url,
  children,
}: {
  icon: string;
  url?: string;
  children: string;
}) {
  const t = useTokens();

  return (
    <View style={{ gap: 1 }}>
      <Icon name={icon} size={t.size.base * 1.1} color={t.accent} />
      {url ? (
        <LinkText url={url}>{children}</LinkText>
      ) : (
        <Text>{children}</Text>
      )}
    </View>
  );
}

function Skills({ data }: SectionProps) {
  const t = useTokens();
  const skills = nonEmpty(data.skills, (s) => s.name);
  if (!skills.length) return null;

  return (
    <View>
      <SectionTitle>Skills</SectionTitle>
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", gap: t.space(1.25) }}
      >
        {skills.map(({ id, name }) => (
          <View
            key={id}
            style={{
              borderWidth: 0.9,
              borderColor: t.tint(0.5),
              backgroundColor: t.tint(0.06),
              borderRadius: 3,
              paddingHorizontal: 5,
              paddingVertical: 1.75,
            }}
          >
            <Text
              style={{
                fontSize: t.size.xs,
                lineHeight: 1,
                marginTop: -t.capShift(t.size.xs),
                marginBottom: t.capShift(t.size.xs),
              }}
            >
              {name.toUpperCase()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function Languages({ data }: SectionProps) {
  const t = useTokens();
  const languages = nonEmpty(data.languages, (l) => l.name);
  if (!languages.length) return null;

  return (
    <View>
      <SectionTitle>Languages</SectionTitle>
      <View style={{ gap: t.space(1) }}>
        {languages.map(({ id, name, proficiency }) => (
          <Text key={id}>
            <Text style={{ fontWeight: 700 }}>{name}</Text>
            {proficiency && (
              <Text style={{ color: t.muted }}> · {proficiency}</Text>
            )}
          </Text>
        ))}
      </View>
    </View>
  );
}

function Interests({ data }: SectionProps) {
  const t = useTokens();
  const interests = nonEmpty(data.interests, (i) => i.name);
  if (!interests.length) return null;

  return (
    <View>
      <SectionTitle>Interests</SectionTitle>
      <View style={{ gap: t.space(1) }}>
        {interests.map(({ id, name }) => (
          <Text key={id}>{name}</Text>
        ))}
      </View>
    </View>
  );
}

function Header({
  data,
  showSummary,
}: SectionProps & { showSummary: boolean }) {
  const t = useTokens();
  const name = fullName(data.profile);
  const { headline, summary } = data.profile;
  if (!name && !headline && !(showSummary && summary.trim())) return null;

  return (
    <View
      style={{
        backgroundColor: t.accent,
        color: "#ffffff",
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginBottom: t.space(4),
        gap: t.space(0.75),
      }}
    >
      {name && (
        <Text style={{ fontSize: t.size.xl, lineHeight: 1.1 }}>{name}</Text>
      )}
      {headline && (
        <Text
          style={{
            alignSelf: "flex-start",
            fontSize: t.size.md,
            borderBottomWidth: 0.8,
            borderBottomColor: "#ffffff",
          }}
        >
          {headline}
        </Text>
      )}
      {showSummary && (
        <Markdown
          text={summary}
          style={{ color: "#ffffff" }}
          linkStyle={{ color: "#ffffff", textDecoration: "underline" }}
        />
      )}
    </View>
  );
}

function MainSections({ data, order }: SectionProps & { order: string[] }) {
  const t = useTokens();

  const sections = order.flatMap((key) => {
    const entries = sectionEntries(data, key, {
      bullet: (b) => <Bullet key={b.id} text={b.text} />,
      meta: (text) => <Meta>{text}</Meta>,
    });
    if (!entries?.length) return [];
    return [{ key, title: sectionTitle(data, key), entries }];
  });

  return (
    <View style={{ paddingLeft: 24, paddingRight: 25 }}>
      {sections.flatMap(({ key, title, entries }, s) =>
        entries.map(({ id, ...entry }, i) => (
          <Entry
            key={`${key}-${id}`}
            {...entry}
            gap={i ? t.space(2.25) : s ? t.space(4) : 0}
            heading={
              i === 0 && title ? (
                <SectionTitle rule>{title}</SectionTitle>
              ) : undefined
            }
          />
        )),
      )}
    </View>
  );
}

function Meta({ children }: { children: React.ReactNode }) {
  const t = useTokens();
  return (
    <Text style={{ color: t.accent, fontSize: t.size.xs, fontStyle: "italic" }}>
      {children}
    </Text>
  );
}

type EntryProps = Omit<EntryData, "id"> & {
  /** Section title, for the first entry; kept on the same page as the entry. */
  heading?: React.ReactNode;
  /** Space above (pt). */
  gap?: number;
};

/**
 * `heading` + dot/title head + `lead` form one unbreakable block; `rest` follows.
 * Returns siblings, not a wrapper: react-pdf keeps a parent whose first child
 * doesn't fit on the page instead of moving it, so blocks must stay flat.
 */
function Entry({
  title,
  subtitle,
  dates,
  location,
  meta,
  link,
  heading,
  lead,
  rest,
  gap = 0,
}: EntryProps) {
  const t = useTokens();
  const dot = t.size.base * 0.55;
  const indent = { paddingLeft: 9 + dot + 10, gap: t.space(0.5) };
  const metaStyle = {
    color: t.accent,
    fontSize: t.size.xs,
    fontStyle: "italic",
  } as const;

  return (
    <>
      <View wrap={false} style={{ gap: t.space(0.5), marginTop: gap }}>
        {heading}
        <View style={{ flexDirection: "row", gap: 10, paddingLeft: 9 }}>
          <View
            style={{
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              backgroundColor: t.accent,
              marginTop: t.size.md * 0.35,
            }}
          />
          <View style={{ flex: 1 }}>
            {title && (
              <Text
                style={{
                  color: t.accent,
                  fontSize: t.size.md,
                  fontWeight: 700,
                }}
              >
                {title}
                {link && (
                  <Text style={{ fontSize: t.size.sm, fontWeight: 400 }}>
                    {"  "}
                    <LinkText url={link} style={{ color: t.accent }} />
                  </Text>
                )}
              </Text>
            )}
            {subtitle && (
              <Text style={{ fontSize: t.size.base, fontWeight: 700 }}>
                {subtitle}
              </Text>
            )}
            {(dates || location || meta) && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <DateRange dates={dates} style={metaStyle} />
                {meta && <Text style={metaStyle}>{meta}</Text>}
                {location && <Text style={metaStyle}>{location}</Text>}
              </View>
            )}
          </View>
        </View>
        {lead && <View style={indent}>{lead}</View>}
      </View>
      {Children.toArray(rest).length > 0 && (
        <View style={{ ...indent, marginTop: t.space(0.5) }}>{rest}</View>
      )}
    </>
  );
}

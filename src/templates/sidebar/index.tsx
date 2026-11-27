import { Image, Text, View } from "@react-pdf/renderer";

import { formatMonthYear } from "@/lib/resume/format";
import type {
  DateRange as DateRangeValue,
  ResumeData,
} from "@/lib/resume/schema";

import { ResumeDocument, fullName } from "@/pdf/primitives/document";
import { Icon } from "@/pdf/primitives/icon";
import { Bullets, SectionTitle } from "@/pdf/primitives/layout";
import {
  DateRange,
  LinkText,
  Markdown,
  displayUrl,
} from "@/pdf/primitives/text";
import { useTokens } from "@/pdf/tokens";

import type { TemplateDef, TemplateProps } from "../types";
import { nonEmpty, visibleOrder } from "../utils";

const SIDEBAR_WIDTH = 122;

type SectionProps = { data: ResumeData };

function SidebarDocument({ data, theme }: TemplateProps) {
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
        <Text style={{ color: t.accent, fontSize: 56, lineHeight: 1 }}>
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
          <Text
            key={id}
            style={{
              borderWidth: 0.9,
              borderColor: t.tint(0.5),
              backgroundColor: t.tint(0.06),
              borderRadius: 3,
              paddingHorizontal: 5,
              paddingVertical: 1,
              fontSize: t.size.xs,
              textTransform: "uppercase",
            }}
          >
            {name}
          </Text>
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
            paddingRight: 6,
            borderBottomWidth: 0.8,
            borderBottomColor: "#ffffff",
          }}
        >
          {headline}
        </Text>
      )}
      {showSummary && <Markdown text={summary} style={{ color: "#ffffff" }} />}
    </View>
  );
}

const MAIN_TITLES: Record<string, string> = {
  experience: "Work Experience",
  projects: "Projects",
  education: "Education",
  certifications: "Certifications",
  awards: "Awards",
};

function MainSections({ data, order }: SectionProps & { order: string[] }) {
  const t = useTokens();

  const sections = order.flatMap((key) => {
    const entries = mainEntries(data, key);
    if (!entries?.length) return [];
    const title = key.startsWith("custom:")
      ? data.customSections.find((s) => `custom:${s.id}` === key)?.title || ""
      : MAIN_TITLES[key];
    return [{ key, title, entries }];
  });

  return (
    <View style={{ paddingLeft: 24, paddingRight: 25, gap: t.space(4) }}>
      {sections.map(({ key, title, entries }) => (
        <View key={key}>
          {title && <SectionTitle rule>{title}</SectionTitle>}
          <View style={{ gap: t.space(2.25) }}>{entries}</View>
        </View>
      ))}
    </View>
  );
}

/** Entry elements of a main-column section, or `undefined` if not a main section. */
function mainEntries(data: ResumeData, key: string) {
  switch (key) {
    case "experience":
      return nonEmpty(data.experience, (e) => e.role + e.company).map((e) => (
        <Entry
          key={e.id}
          title={e.role}
          subtitle={e.company}
          dates={e.dates}
          location={e.location}
        >
          <Bullets items={e.bullets} />
        </Entry>
      ));
    case "projects":
      return nonEmpty(data.projects, (p) => p.name).map((p) => (
        <Entry key={p.id} title={p.name} link={p.liveUrl}>
          {p.description && <Markdown text={p.description} />}
          {p.sourceUrl && (
            <Text>
              <Text style={{ fontWeight: 700 }}>Source: </Text>
              <LinkText url={p.sourceUrl} />
            </Text>
          )}
          {p.tags.length > 0 && <Meta>{p.tags.join(", ")}</Meta>}
        </Entry>
      ));
    case "education":
      return nonEmpty(data.education, (e) => e.degree + e.institution).map(
        (e) => (
          <Entry
            key={e.id}
            title={e.degree}
            subtitle={e.institution}
            dates={e.dates}
            location={e.location}
          >
            {e.details && <Markdown text={e.details} />}
          </Entry>
        ),
      );
    case "certifications":
      return nonEmpty(data.certifications, (c) => c.name).map((c) => (
        <Entry
          key={c.id}
          title={c.name}
          subtitle={c.issuer}
          meta={formatMonthYear(c.date)}
          link={c.url}
        />
      ));
    case "awards":
      return nonEmpty(data.awards, (a) => a.title).map((a) => (
        <Entry
          key={a.id}
          title={a.title}
          subtitle={a.issuer}
          meta={formatMonthYear(a.date)}
        >
          {a.description && <Markdown text={a.description} />}
        </Entry>
      ));
    default: {
      if (!key.startsWith("custom:")) return undefined;
      const section = data.customSections.find((s) => `custom:${s.id}` === key);
      return nonEmpty(section?.items ?? [], (i) => i.title + i.description).map(
        (i) => (
          <Entry
            key={i.id}
            title={i.title}
            subtitle={i.subtitle}
            dates={i.dates}
          >
            {i.description && <Markdown text={i.description} />}
          </Entry>
        ),
      );
    }
  }
}

function Meta({ children }: { children: React.ReactNode }) {
  const t = useTokens();
  return (
    <Text style={{ color: t.accent, fontSize: t.size.xs, fontStyle: "italic" }}>
      {children}
    </Text>
  );
}

/** Dot + title head (unbreakable, kept with the first body lines) + indented body. */
function Entry({
  title,
  subtitle,
  dates,
  location,
  meta,
  link,
  children,
}: {
  title: string;
  subtitle?: string;
  dates?: DateRangeValue;
  location?: string;
  meta?: string;
  link?: string;
  children?: React.ReactNode;
}) {
  const t = useTokens();
  const dot = t.size.base * 0.55;
  const metaStyle = {
    color: t.accent,
    fontSize: t.size.xs,
    fontStyle: "italic",
  } as const;

  return (
    <View style={{ paddingLeft: 9, gap: t.space(0.5) }}>
      <View
        wrap={false}
        minPresenceAhead={24}
        style={{ flexDirection: "row", gap: 10 }}
      >
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
              style={{ color: t.accent, fontSize: t.size.md, fontWeight: 700 }}
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
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <DateRange dates={dates} style={metaStyle} />
              {meta && <Text style={metaStyle}>{meta}</Text>}
              {location && <Text style={metaStyle}>{location}</Text>}
            </View>
          )}
        </View>
      </View>
      {children && (
        <View style={{ paddingLeft: dot + 10, gap: t.space(0.5) }}>
          {children}
        </View>
      )}
    </View>
  );
}

export const sidebar: TemplateDef = {
  id: "sidebar",
  name: "Sidebar",
  description: "Photo and contacts in a left column, accent header.",
  Document: SidebarDocument,
  defaultTheme: { accent: "#cd6060", font: "inter", baseSize: 10 },
};

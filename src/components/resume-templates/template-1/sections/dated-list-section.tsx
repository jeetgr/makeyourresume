import { Circle } from "lucide-react";

import { formatMonthYear } from "@/lib/resume/format";
import type { MonthYear } from "@/lib/resume/schema";

import { useShowSection, useTemplate } from "../../components/template-context";
import Heading from "../components/heading";

type Entry = {
  id: string;
  title: string;
  subtitle: string;
  date?: MonthYear;
  description?: string;
};

function DatedListSection({
  section,
  heading,
  entries,
}: {
  section: string;
  heading: string;
  entries: Entry[];
}) {
  const accent = useTemplate().theme.accent;

  if (!useShowSection(section, entries.length)) return null;

  return (
    <div className="ml-[calc(var(--WIDTHPERCENTAGE)*24)]">
      <Heading bottomLine={true} mb={12}>
        {heading}
      </Heading>

      <ul className="flex flex-col gap-[calc(var(--WIDTHPERCENTAGE)*7)] pr-[calc(var(--WIDTHPERCENTAGE)*25)]">
        {entries.map(({ id, title, subtitle, date, description }) => (
          <li
            key={id}
            className="flex gap-[calc(var(--WIDTHPERCENTAGE)*10)] pl-[calc(var(--WIDTHPERCENTAGE)*9)]"
          >
            <Circle
              fill={accent}
              color={accent}
              className="mt-[calc(var(--WIDTHPERCENTAGE)*3.3)] h-[calc(var(--WIDTHPERCENTAGE)*6)] w-[calc(var(--WIDTHPERCENTAGE)*6)] shrink-0"
            />
            <div>
              {title && (
                <h3
                  className="text-[calc(var(--WIDTHPERCENTAGE)*11)] leading-[1.1] font-bold"
                  style={{ color: accent }}
                >
                  {title}
                </h3>
              )}
              {(subtitle || date) && (
                <p className="text-[calc(var(--WIDTHPERCENTAGE)*9)] leading-snug italic">
                  {[subtitle, date && formatMonthYear(date)]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
              {description && (
                <p className="text-[calc(var(--WIDTHPERCENTAGE)*9)] leading-snug">
                  {description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CertificationsSection() {
  const { data } = useTemplate();
  const entries = data.certifications
    .filter((c) => c.name)
    .map(({ id, name, issuer, date }) => ({
      id,
      title: name,
      subtitle: issuer,
      date,
    }));

  return (
    <DatedListSection
      section="certifications"
      heading="Certifications"
      entries={entries}
    />
  );
}

export function AwardsSection() {
  const { data } = useTemplate();
  const entries = data.awards
    .filter((a) => a.title)
    .map(({ id, title, issuer, date, description }) => ({
      id,
      title,
      subtitle: issuer,
      date,
      description,
    }));

  return (
    <DatedListSection section="awards" heading="Awards" entries={entries} />
  );
}

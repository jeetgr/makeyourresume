import { Circle, Square } from "lucide-react";

import { formatDateRange } from "@/lib/resume/format";

import { useShowSection, useTemplate } from "../../components/template-context";
import Heading from "../components/heading";

export default function ExperienceSection() {
  const { data, theme } = useTemplate();
  const accent = theme.accent;

  if (!useShowSection("experience", data.experience.length)) return null;

  return (
    <div className="ml-[calc(var(--WIDTHPERCENTAGE)*24)]">
      <Heading bottomLine={true} mb={12}>
        Work Experience
      </Heading>

      <ul className="grid gap-[calc(var(--WIDTHPERCENTAGE)*9)] pr-[calc(var(--WIDTHPERCENTAGE)*25)]">
        {data.experience.map(
          ({ id, role, company, dates, location, bullets }) => {
            const range = formatDateRange(dates);

            return (
              <li
                key={id}
                className="flex gap-[calc(var(--WIDTHPERCENTAGE)*10)] pl-[calc(var(--WIDTHPERCENTAGE)*9)]"
              >
                <Circle
                  color={accent}
                  fill={accent}
                  className="mt-[calc(var(--WIDTHPERCENTAGE)*3.3)] h-[calc(var(--WIDTHPERCENTAGE)*6)] w-[calc(var(--WIDTHPERCENTAGE)*6)]"
                />

                <div className="grid flex-1">
                  {role && (
                    <h3
                      className="text-[calc(var(--WIDTHPERCENTAGE)*12)] leading-none font-bold"
                      style={{ color: accent }}
                    >
                      {role}
                    </h3>
                  )}

                  {company && (
                    <p className="text-[calc(var(--WIDTHPERCENTAGE)*10)] leading-tight font-semibold">
                      {company}
                    </p>
                  )}

                  <div
                    className="flex justify-between text-[calc(var(--WIDTHPERCENTAGE)*8)] leading-tight italic"
                    style={{ color: accent }}
                  >
                    {range && <p>{range}</p>}
                    {location && <p>{location}</p>}
                  </div>

                  <ul>
                    {bullets
                      .filter((b) => b.text)
                      .map(({ id, text }) => (
                        <li
                          key={id}
                          className="flex gap-[calc(var(--WIDTHPERCENTAGE)*6)]"
                        >
                          <Square
                            color={accent}
                            className="mt-[calc(var(--WIDTHPERCENTAGE)*3.3)] h-[calc(var(--WIDTHPERCENTAGE)*7)] w-[calc(var(--WIDTHPERCENTAGE)*7)]"
                          />
                          <p className="text-[calc(var(--WIDTHPERCENTAGE)*9)]">
                            {text}
                          </p>
                        </li>
                      ))}
                  </ul>
                </div>
              </li>
            );
          },
        )}
      </ul>
    </div>
  );
}

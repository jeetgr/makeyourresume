import { Circle } from "lucide-react";

import { formatDateRange } from "@/lib/resume/format";

import { useShowSection, useTemplate } from "../../components/template-context";
import Heading from "../components/heading";

export default function EducationSection() {
  const { data, theme } = useTemplate();
  const accent = theme.accent;

  if (!useShowSection("education", data.education.length)) return null;

  return (
    <div className="ml-[calc(var(--WIDTHPERCENTAGE)*24)]">
      <Heading bottomLine={true} mb={12}>
        Education
      </Heading>

      <ul className="flex flex-col gap-[calc(var(--WIDTHPERCENTAGE)*7)] pr-[calc(var(--WIDTHPERCENTAGE)*25)]">
        {data.education.map(({ id, degree, institution, dates }) => {
          const range = formatDateRange(dates);

          return (
            <li
              key={id}
              className="flex gap-[calc(var(--WIDTHPERCENTAGE)*10)] pl-[calc(var(--WIDTHPERCENTAGE)*9)]"
            >
              <Circle
                fill={accent}
                color={accent}
                className="mt-[calc(var(--WIDTHPERCENTAGE)*3.3)] h-[calc(var(--WIDTHPERCENTAGE)*6)] w-[calc(var(--WIDTHPERCENTAGE)*6)]"
              />
              <div>
                {degree && (
                  <h3
                    className="text-[calc(var(--WIDTHPERCENTAGE)*12)] leading-[1.1] font-bold"
                    style={{ color: accent }}
                  >
                    {degree}
                  </h3>
                )}

                {institution && (
                  <p className="text-[calc(var(--WIDTHPERCENTAGE)*9)] leading-snug italic">
                    {institution}
                  </p>
                )}

                {range && (
                  <p
                    className="text-[calc(var(--WIDTHPERCENTAGE)*7)] italic"
                    style={{ color: accent }}
                  >
                    {range}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

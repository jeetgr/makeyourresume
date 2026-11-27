import { Circle } from "lucide-react";

import { useShowSection, useTemplate } from "../../components/template-context";
import Heading from "../components/heading";

export default function ProjectsSection() {
  const { data, theme } = useTemplate();
  const accent = theme.accent;

  if (!useShowSection("projects", data.projects.length)) return null;

  return (
    <div className="ml-[calc(var(--WIDTHPERCENTAGE)*24)]">
      <Heading bottomLine={true} mb={12}>
        Projects
      </Heading>

      <ul className="flex flex-col gap-[calc(var(--WIDTHPERCENTAGE)*9)] pr-[calc(var(--WIDTHPERCENTAGE)*25)]">
        {data.projects.map(
          ({ id, name, description, liveUrl, sourceUrl, tags: rawTags }) => {
            const tags = rawTags.map((t) => t.trim()).filter(Boolean);

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
                <div className="grid flex-1">
                  <div
                    className="flex items-center gap-[calc(var(--WIDTHPERCENTAGE)*1.5)] leading-[1.1]"
                    style={{ color: accent }}
                  >
                    {name && (
                      <h3 className="text-[calc(var(--WIDTHPERCENTAGE)*12)] font-bold">
                        {name}
                      </h3>
                    )}

                    {liveUrl && (
                      <p className="text-[calc(var(--WIDTHPERCENTAGE)*9)]">
                        ({liveUrl})
                      </p>
                    )}
                  </div>

                  {description && (
                    <p className="text-[calc(var(--WIDTHPERCENTAGE)*9)] leading-snug">
                      {description}
                    </p>
                  )}

                  {sourceUrl && (
                    <p className="text-[calc(var(--WIDTHPERCENTAGE)*9)] leading-snug">
                      <span className="font-semibold">Source Code: </span>
                      <span className="text-blue-500">{sourceUrl}</span>
                    </p>
                  )}

                  {tags.length > 0 && (
                    <p
                      className="text-[calc(var(--WIDTHPERCENTAGE)*8)] leading-snug italic"
                      style={{ color: accent }}
                    >
                      {tags.join(", ")}
                    </p>
                  )}
                </div>
              </li>
            );
          },
        )}
      </ul>
    </div>
  );
}

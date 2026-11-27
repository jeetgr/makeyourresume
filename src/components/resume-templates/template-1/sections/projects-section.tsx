import { Circle } from "lucide-react";

import { isDoubleHyphens } from "@/utils/is-double-hyphens";

import { useAppSelector } from "@/redux/hooks";

import { selectSkippedSection } from "@/redux/features/skipped-sections/skippedSectionSlice";
import { selectAccentColor } from "@/redux/features/custom-styles/customStyleSlice";
import { selectProjects } from "@/redux/features/resume-data/resumeDataSlice";

import Heading from "../components/heading";

import { dummyData } from "../../dummy-data";

export default function ProjectsSection() {
  const accentColor = useAppSelector((state) =>
    selectAccentColor(state, "template-1"),
  );
  const projects = useAppSelector(selectProjects);

  const shouldSkip = useAppSelector((state) =>
    selectSkippedSection(state, "projects"),
  );

  if (shouldSkip) return null;

  return (
    <div className="ml-[calc(var(--WIDTHPERCENTAGE)*24)]">
      <Heading bottomLine={true} mb={12}>
        Projects
      </Heading>

      <ul className="flex flex-col gap-[calc(var(--WIDTHPERCENTAGE)*9)] pr-[calc(var(--WIDTHPERCENTAGE)*25)]">
        {(projects.length === 0 ? dummyData.projects : projects).map(
          ({
            id,
            projectName,
            projectDescription,
            liveLink,
            sourceLink,
            tags,
          }) => (
            <li
              key={id}
              className="flex gap-[calc(var(--WIDTHPERCENTAGE)*10)] pl-[calc(var(--WIDTHPERCENTAGE)*9)]"
            >
              <Circle
                fill={accentColor}
                color={accentColor}
                className="mt-[calc(var(--WIDTHPERCENTAGE)*3.3)] h-[calc(var(--WIDTHPERCENTAGE)*6)] w-[calc(var(--WIDTHPERCENTAGE)*6)]"
              />
              <div className="grid flex-1">
                <div
                  className="flex items-center gap-[calc(var(--WIDTHPERCENTAGE)*1.5)] leading-[1.1]"
                  style={{
                    color: accentColor,
                  }}
                >
                  {!isDoubleHyphens(projectName) && (
                    <h3 className="text-[calc(var(--WIDTHPERCENTAGE)*12)] font-bold">
                      {projectName}
                    </h3>
                  )}

                  {!isDoubleHyphens(liveLink) && (
                    <p className="text-[calc(var(--WIDTHPERCENTAGE)*9)]">
                      ({liveLink})
                    </p>
                  )}
                </div>

                {!isDoubleHyphens(projectDescription) && (
                  <p className="text-[calc(var(--WIDTHPERCENTAGE)*9)] leading-snug">
                    {projectDescription}
                  </p>
                )}

                {!isDoubleHyphens(sourceLink) && (
                  <p className="text-[calc(var(--WIDTHPERCENTAGE)*9)] leading-snug">
                    <span className="font-semibold">Source Code: </span>
                    <span className="text-blue-500">{sourceLink}</span>
                  </p>
                )}

                {!isDoubleHyphens(tags) && (
                  <p
                    className="text-[calc(var(--WIDTHPERCENTAGE)*8)] italic leading-snug"
                    style={{
                      color: accentColor,
                    }}
                  >
                    {tags}
                  </p>
                )}
              </div>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

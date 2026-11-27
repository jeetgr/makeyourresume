import { Circle } from "lucide-react";

import { isDoubleHyphens } from "@/utils/is-double-hyphens";

import { useAppSelector } from "@/redux/hooks";

import { selectSkippedSection } from "@/redux/features/skipped-sections/skippedSectionSlice";
import { selectAccentColor } from "@/redux/features/custom-styles/customStyleSlice";
import { selectEducations } from "@/redux/features/resume-data/resumeDataSlice";

import Heading from "../components/heading";

import { dummyData } from "../../dummy-data";

export default function EducationSection() {
  const accentColor = useAppSelector((state) =>
    selectAccentColor(state, "template-1"),
  );
  const educations = useAppSelector(selectEducations);

  const shouldSkip = useAppSelector((state) =>
    selectSkippedSection(state, "educations"),
  );

  if (shouldSkip) return null;

  return (
    <div className="ml-[calc(var(--WIDTHPERCENTAGE)*24)]">
      <Heading bottomLine={true} mb={12}>
        Education
      </Heading>

      <ul className="flex flex-col gap-[calc(var(--WIDTHPERCENTAGE)*7)] pr-[calc(var(--WIDTHPERCENTAGE)*25)]">
        {(educations.length === 0 ? dummyData.educations : educations).map(
          ({ id, courseName, collegeName, from, to }) => (
            <li
              key={id}
              className="flex gap-[calc(var(--WIDTHPERCENTAGE)*10)] pl-[calc(var(--WIDTHPERCENTAGE)*9)]"
            >
              <Circle
                fill={accentColor}
                color={accentColor}
                className="mt-[calc(var(--WIDTHPERCENTAGE)*3.3)] h-[calc(var(--WIDTHPERCENTAGE)*6)] w-[calc(var(--WIDTHPERCENTAGE)*6)]"
              />
              <div>
                {!isDoubleHyphens(courseName) && (
                  <h3
                    className="text-[calc(var(--WIDTHPERCENTAGE)*12)] font-bold leading-[1.1]"
                    style={{
                      color: accentColor,
                    }}
                  >
                    {courseName}
                  </h3>
                )}

                {!isDoubleHyphens(collegeName) && (
                  <p className="text-[calc(var(--WIDTHPERCENTAGE)*9)] italic leading-snug">
                    {collegeName}
                  </p>
                )}

                {(!isDoubleHyphens(from) || !isDoubleHyphens(to)) && (
                  <p
                    className="text-[calc(var(--WIDTHPERCENTAGE)*7)] italic"
                    style={{ color: accentColor }}
                  >
                    {!isDoubleHyphens(from) && from}
                    {!isDoubleHyphens(from) && !isDoubleHyphens(to) && " - "}
                    {!isDoubleHyphens(to) && to}
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

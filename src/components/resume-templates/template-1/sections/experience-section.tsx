import { Circle, Square } from "lucide-react";

import { isDoubleHyphens } from "@/utils/is-double-hyphens";

import { useAppSelector } from "@/redux/hooks";

import { selectSkippedSection } from "@/redux/features/skipped-sections/skippedSectionSlice";
import { selectAccentColor } from "@/redux/features/custom-styles/customStyleSlice";
import { selectWorkExperiences } from "@/redux/features/resume-data/resumeDataSlice";

import Heading from "../components/heading";

import { dummyData } from "../../dummy-data";

export default function ExperienceSection() {
  const accentColor = useAppSelector((state) =>
    selectAccentColor(state, "template-1"),
  );
  const workExperiences = useAppSelector(selectWorkExperiences);

  const shouldSkip = useAppSelector((state) =>
    selectSkippedSection(state, "workExperiences"),
  );

  if (shouldSkip) return null;

  return (
    <div className="ml-[calc(var(--WIDTHPERCENTAGE)*24)]">
      <Heading bottomLine={true} mb={12}>
        Work Experience
      </Heading>

      <ul className="grid gap-[calc(var(--WIDTHPERCENTAGE)*9)] pr-[calc(var(--WIDTHPERCENTAGE)*25)]">
        {(workExperiences.length === 0
          ? dummyData.workExperiences
          : workExperiences
        ).map(
          ({
            id,
            jobTitle,
            companyName,
            joiningDate,
            leavingDate,
            location,
            workResponsibilities,
          }) => (
            <li
              key={id}
              className="flex gap-[calc(var(--WIDTHPERCENTAGE)*10)] pl-[calc(var(--WIDTHPERCENTAGE)*9)]"
            >
              <Circle
                color={accentColor}
                fill={accentColor}
                className="mt-[calc(var(--WIDTHPERCENTAGE)*3.3)] h-[calc(var(--WIDTHPERCENTAGE)*6)] w-[calc(var(--WIDTHPERCENTAGE)*6)]"
              />

              <div className="grid flex-1">
                {!isDoubleHyphens(jobTitle) && (
                  <h3
                    className="text-[calc(var(--WIDTHPERCENTAGE)*12)] font-bold leading-none"
                    style={{ color: accentColor }}
                  >
                    {jobTitle}
                  </h3>
                )}

                {!isDoubleHyphens(companyName) && (
                  <p className="text-[calc(var(--WIDTHPERCENTAGE)*10)] font-semibold leading-tight">
                    {companyName}
                  </p>
                )}

                <div className="flex justify-between">
                  {(!isDoubleHyphens(joiningDate) ||
                    !isDoubleHyphens(leavingDate)) && (
                    <p
                      className="text-[calc(var(--WIDTHPERCENTAGE)*8)] italic leading-tight"
                      style={{ color: accentColor }}
                    >
                      {!isDoubleHyphens(joiningDate) && joiningDate}
                      {!isDoubleHyphens(joiningDate) &&
                        !isDoubleHyphens(leavingDate) &&
                        " - "}
                      {!isDoubleHyphens(leavingDate) && leavingDate}
                    </p>
                  )}
                  {!isDoubleHyphens(location) && (
                    <p
                      className="text-[calc(var(--WIDTHPERCENTAGE)*8)] italic leading-tight"
                      style={{ color: accentColor }}
                    >
                      {location}
                    </p>
                  )}
                </div>

                <ul>
                  {workResponsibilities.map(
                    ({ id, responsibility }) =>
                      !isDoubleHyphens(responsibility) && (
                        <li
                          key={id}
                          className="flex gap-[calc(var(--WIDTHPERCENTAGE)*6)]"
                        >
                          <Square
                            color={accentColor}
                            className="mt-[calc(var(--WIDTHPERCENTAGE)*3.3)] h-[calc(var(--WIDTHPERCENTAGE)*7)] w-[calc(var(--WIDTHPERCENTAGE)*7)]"
                          />
                          <p className="text-[calc(var(--WIDTHPERCENTAGE)*9)]">
                            {responsibility}
                          </p>
                        </li>
                      ),
                  )}
                </ul>
              </div>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

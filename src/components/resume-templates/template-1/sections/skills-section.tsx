import { isDoubleHyphens } from "@/utils/is-double-hyphens";

import { useAppSelector } from "@/redux/hooks";

import { selectSkippedSection } from "@/redux/features/skipped-sections/skippedSectionSlice";
import { selectAccentColor } from "@/redux/features/custom-styles/customStyleSlice";
import { selectSkills } from "@/redux/features/resume-data/resumeDataSlice";

import Heading from "../components/heading";

import { dummyData } from "../../dummy-data";

export default function SkillsSection() {
  const accentColor = useAppSelector((state) =>
    selectAccentColor(state, "template-1"),
  );
  const skills = useAppSelector(selectSkills);

  const shouldSkip = useAppSelector((state) =>
    selectSkippedSection(state, "skills"),
  );

  if (shouldSkip) return null;

  return (
    <div>
      <Heading>Skills</Heading>
      <ul className="flex flex-wrap gap-[calc(var(--WIDTHPERCENTAGE)*6.5)]">
        {(skills.length === 0 ? dummyData.skills : skills).map(
          ({ id, name }) =>
            !isDoubleHyphens(name) && (
              <li
                key={id}
                className="rounded-[calc(var(--WIDTHPERCENTAGE)*3)] border-[calc(var(--WIDTHPERCENTAGE)*0.9562)] px-[calc(var(--WIDTHPERCENTAGE)*6)] py-[calc(var(--WIDTHPERCENTAGE)*1.2)] text-[calc(var(--WIDTHPERCENTAGE)*9)] uppercase"
                style={{
                  borderColor: accentColor + "80",
                  backgroundColor: accentColor + "10",
                }}
              >
                {name}
              </li>
            ),
        )}
      </ul>
    </div>
  );
}

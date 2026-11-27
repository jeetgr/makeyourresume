import { LucideIcon, Heart } from "lucide-react";

import { isDoubleHyphens } from "@/utils/is-double-hyphens";

import { useAppSelector } from "@/redux/hooks";

import { selectSkippedSection } from "@/redux/features/skipped-sections/skippedSectionSlice";
import { selectAccentColor } from "@/redux/features/custom-styles/customStyleSlice";
import { selectInterests } from "@/redux/features/resume-data/resumeDataSlice";

import Heading from "../components/heading";

import { dummyData } from "../../dummy-data";

export default function InterestsSection() {
  const shouldSkip = useAppSelector((state) =>
    selectSkippedSection(state, "interests"),
  );
  const interests = useAppSelector(selectInterests);

  if (shouldSkip) return null;

  return (
    <div>
      <Heading>Interests</Heading>
      <ul className="flex flex-col gap-[calc(var(--WIDTHPERCENTAGE)*6)]">
        {(interests.length === 0 ? dummyData.interests : interests).map(
          ({ id, name }) =>
            !isDoubleHyphens(name) && (
              <li key={id}>
                <InterestText text={name} />
              </li>
            ),
        )}
      </ul>
    </div>
  );
}

function InterestText({ text }: { Icon?: LucideIcon; text: string }) {
  const accentColor = useAppSelector((state) =>
    selectAccentColor(state, "template-1"),
  );
  return (
    <p className="flex items-center gap-[calc(var(--WIDTHPERCENTAGE)*6)]">
      <Heart
        className="h-[calc(var(--WIDTHPERCENTAGE)*15)] w-[calc(var(--WIDTHPERCENTAGE)*15)]"
        color={accentColor}
      />
      <span className="text-[calc(var(--WIDTHPERCENTAGE)*9)] leading-snug capitalize">
        {text}
      </span>
    </p>
  );
}

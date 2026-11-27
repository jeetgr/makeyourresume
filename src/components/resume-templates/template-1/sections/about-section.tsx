import { isDoubleHyphens } from "@/utils/is-double-hyphens";

import { useAppSelector } from "@/redux/hooks";

import { selectAccentColor } from "@/redux/features/custom-styles/customStyleSlice";
import { selectProfile } from "@/redux/features/resume-data/resumeDataSlice";

import { dummyData } from "../../dummy-data";

export default function AboutSection() {
  const accentColor = useAppSelector((state) =>
    selectAccentColor(state, "template-1"),
  );

  const { firstName, lastName, professionalTitle, about } =
    useAppSelector(selectProfile);

  return (
    <div
      className="px-[calc(var(--WIDTHPERCENTAGE)*15)] py-[calc(var(--WIDTHPERCENTAGE)*8)] text-white"
      style={{ backgroundColor: accentColor }}
    >
      {/* NAME */}
      {(!isDoubleHyphens(firstName) || !isDoubleHyphens(lastName)) && (
        <h1 className="text-[calc(var(--WIDTHPERCENTAGE)*22)] font-medium leading-none">
          {!isDoubleHyphens(firstName) && (
            <span>{firstName || dummyData.profile.firstName}</span>
          )}{" "}
          {!isDoubleHyphens(lastName) && (
            <span>{lastName || dummyData.profile.lastName}</span>
          )}
        </h1>
      )}

      {/* PROFESSIONAL TITLE */}
      {!isDoubleHyphens(professionalTitle) && (
        <p className="relative mb-[calc(var(--WIDTHPERCENTAGE)*3)] w-fit pr-[calc(var(--WIDTHPERCENTAGE)*6)] text-[calc(var(--WIDTHPERCENTAGE)*12)] leading-tight after:absolute after:left-0 after:top-[105%] after:h-[calc(var(--WIDTHPERCENTAGE)*0.789)] after:w-full after:bg-white">
          {professionalTitle || dummyData.profile.professionalTitle}
        </p>
      )}

      {/* ABOUT */}
      {!isDoubleHyphens(about) && (
        <p className="text-[calc(var(--WIDTHPERCENTAGE)*9)] leading-snug">
          {about || dummyData.profile.about}
        </p>
      )}
    </div>
  );
}

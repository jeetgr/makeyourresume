import { Circle } from "lucide-react";

import type { CustomSection as CustomSectionData } from "@/lib/resume/schema";

import { useShowSection, useTemplate } from "../../components/template-context";
import Heading from "../components/heading";

export default function CustomSections() {
  const { data } = useTemplate();

  return data.customSections.map((section) => (
    <CustomSection key={section.id} {...section} />
  ));
}

function CustomSection({ id, title, items }: CustomSectionData) {
  const accent = useTemplate().theme.accent;

  if (!useShowSection(`custom:${id}`, items.length)) return null;

  return (
    <div className="ml-[calc(var(--WIDTHPERCENTAGE)*24)]">
      <Heading bottomLine={true} mb={12}>
        {title}
      </Heading>

      <ul className="w-fit space-y-px pr-[calc(var(--WIDTHPERCENTAGE)*25)]">
        {items.map(({ id, title, description }) => (
          <li
            key={id}
            className="flex gap-[calc(var(--WIDTHPERCENTAGE)*12)] pl-[calc(var(--WIDTHPERCENTAGE)*9)]"
          >
            <Circle
              fill={accent}
              color={accent}
              className="mt-[calc(var(--WIDTHPERCENTAGE)*3.3)] h-[calc(var(--WIDTHPERCENTAGE)*6)] w-[calc(var(--WIDTHPERCENTAGE)*6)]"
            />
            <p className="grid w-full grid-cols-3">
              <span
                className="text-[calc(var(--WIDTHPERCENTAGE)*9)] font-semibold"
                style={{ color: accent }}
              >
                {title}
              </span>
              <span className="col-span-2 flex text-[calc(var(--WIDTHPERCENTAGE)*9)]">
                <span className="mx-[calc(var(--WIDTHPERCENTAGE)*4)] font-semibold">
                  :
                </span>
                {description}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

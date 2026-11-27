import { Heart } from "lucide-react";

import { useShowSection, useTemplate } from "../../components/template-context";
import Heading from "../components/heading";

export default function InterestsSection() {
  const { data, theme } = useTemplate();
  const interests = data.interests.filter((i) => i.name);

  if (!useShowSection("interests", interests.length)) return null;

  return (
    <div>
      <Heading>Interests</Heading>
      <ul className="flex flex-col gap-[calc(var(--WIDTHPERCENTAGE)*6)]">
        {interests.map(({ id, name }) => (
          <li
            key={id}
            className="flex items-center gap-[calc(var(--WIDTHPERCENTAGE)*6)]"
          >
            <Heart
              className="h-[calc(var(--WIDTHPERCENTAGE)*15)] w-[calc(var(--WIDTHPERCENTAGE)*15)]"
              color={theme.accent}
            />
            <span className="text-[calc(var(--WIDTHPERCENTAGE)*9)] leading-snug capitalize">
              {name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

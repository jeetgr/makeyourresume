import { useShowSection, useTemplate } from "../../components/template-context";
import Heading from "../components/heading";

export default function SkillsSection() {
  const { data, theme } = useTemplate();
  const skills = data.skills.filter((s) => s.name);

  if (!useShowSection("skills", skills.length)) return null;

  return (
    <div>
      <Heading>Skills</Heading>
      <ul className="flex flex-wrap gap-[calc(var(--WIDTHPERCENTAGE)*6.5)]">
        {skills.map(({ id, name }) => (
          <li
            key={id}
            className="rounded-[calc(var(--WIDTHPERCENTAGE)*3)] border-[calc(var(--WIDTHPERCENTAGE)*0.9562)] px-[calc(var(--WIDTHPERCENTAGE)*6)] py-[calc(var(--WIDTHPERCENTAGE)*1.2)] text-[calc(var(--WIDTHPERCENTAGE)*9)] uppercase"
            style={{
              borderColor: theme.accent + "80",
              backgroundColor: theme.accent + "10",
            }}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

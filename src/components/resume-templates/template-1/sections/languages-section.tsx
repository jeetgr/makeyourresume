import { useShowSection, useTemplate } from "../../components/template-context";
import Heading from "../components/heading";

export default function LanguagesSection() {
  const { data, theme } = useTemplate();
  const languages = data.languages.filter((l) => l.name);

  if (!useShowSection("languages", languages.length)) return null;

  return (
    <div>
      <Heading>Languages</Heading>
      <ul className="flex flex-col gap-[calc(var(--WIDTHPERCENTAGE)*4)]">
        {languages.map(({ id, name, proficiency }) => (
          <li
            key={id}
            className="text-[calc(var(--WIDTHPERCENTAGE)*9)] leading-snug"
          >
            <span className="font-semibold">{name}</span>
            {proficiency && (
              <span className="italic" style={{ color: theme.accent }}>
                {" "}
                · {proficiency}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useTemplate } from "../../components/template-context";

export default function AboutSection() {
  const { data, theme } = useTemplate();
  const { firstName, lastName, headline, summary } = data.profile;
  const name = [firstName, lastName].filter(Boolean).join(" ");
  const showSummary = summary && !data.layout.hidden.includes("summary");

  return (
    <div
      className="px-[calc(var(--WIDTHPERCENTAGE)*15)] py-[calc(var(--WIDTHPERCENTAGE)*8)] text-white"
      style={{ backgroundColor: theme.accent }}
    >
      {name && (
        <h1 className="text-[calc(var(--WIDTHPERCENTAGE)*22)] leading-none font-medium">
          {name}
        </h1>
      )}

      {headline && (
        <p className="relative mb-[calc(var(--WIDTHPERCENTAGE)*3)] w-fit pr-[calc(var(--WIDTHPERCENTAGE)*6)] text-[calc(var(--WIDTHPERCENTAGE)*12)] leading-tight after:absolute after:top-[105%] after:left-0 after:h-[calc(var(--WIDTHPERCENTAGE)*0.789)] after:w-full after:bg-white">
          {headline}
        </p>
      )}

      {showSummary && (
        <p className="text-[calc(var(--WIDTHPERCENTAGE)*9)] leading-snug">
          {summary}
        </p>
      )}
    </div>
  );
}

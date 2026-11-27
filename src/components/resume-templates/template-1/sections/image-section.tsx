import { Image } from "lucide-react";

import { useTemplate } from "../../components/template-context";

export default function ImageSection() {
  const { data, theme } = useTemplate();
  const { photo, firstName, lastName } = data.profile;
  const initials = (firstName[0] ?? "") + (lastName[0] ?? "");

  return (
    <div
      className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-[calc(var(--WIDTHPERCENTAGE)*3)]"
      style={{
        border: `calc(var(--WIDTHPERCENTAGE)*1) solid ${theme.accent}`,
      }}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} className="object-cover object-center" alt="" />
      ) : (
        <p
          className="text-[calc(var(--WIDTHPERCENTAGE)*62)] leading-none font-semibold"
          style={{ color: theme.accent }}
        >
          {initials || (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image className="h-[calc(var(--WIDTHPERCENTAGE)*50)] w-[calc(var(--WIDTHPERCENTAGE)*50)] stroke-[calc(var(--WIDTHPERCENTAGE)*1.2)]" />
          )}
        </p>
      )}
    </div>
  );
}

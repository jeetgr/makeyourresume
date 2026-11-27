import { ReactNode } from "react";

import { cn } from "@/utils/cn";

import { useTemplate } from "../../components/template-context";

export default function Heading({
  children,
  bottomLine = false,
  mb = 5,
  className,
}: {
  children: ReactNode;
  bottomLine?: boolean;
  mb?: number;
  className?: string;
}) {
  const accentColor = useTemplate().theme.accent;

  return (
    <h2
      className={cn(
        "text-[calc(var(--WIDTHPERCENTAGE)*14)] font-extrabold uppercase",
        bottomLine && "relative pl-[calc(var(--WIDTHPERCENTAGE)*9)]",
        className,
      )}
      style={{
        marginBottom: `calc(var(--WIDTHPERCENTAGE)*${mb})`,
        color: accentColor,
      }}
    >
      {children}
      {bottomLine && (
        <span
          className="absolute top-[105%] left-0 block h-[max(calc(var(--WIDTHPERCENTAGE)*1.1),.6pt)] w-full"
          style={{
            backgroundColor: accentColor,
          }}
        />
      )}
    </h2>
  );
}

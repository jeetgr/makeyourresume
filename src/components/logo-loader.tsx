import { cn } from "@/utils/cn";

import { LogoMark } from "./logo-mark";

export function LogoLoader({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-muted-foreground",
        className,
      )}
    >
      <LogoMark animated className="size-10 text-foreground" />
      <p className="font-mono text-xs tracking-widest uppercase">{label}</p>
    </div>
  );
}

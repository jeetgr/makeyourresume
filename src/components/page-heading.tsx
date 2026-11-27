import { cn } from "@/utils/cn";

export function PageHeading({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-x-8 gap-y-4",
        className,
      )}
    >
      <div className="space-y-2">
        {eyebrow && (
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-4xl tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-xl text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

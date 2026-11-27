"use client";

import { useState } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";

import { cn } from "@/utils/cn";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { useResumeDoc, useResumeOps } from "./resume-doc";

type SectionPanelProps = {
  title: string;
  /** Layout key; enables the visibility switch. */
  section?: string;
  count?: number;
  handle?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export function SectionPanel({
  title,
  section,
  count,
  handle,
  defaultOpen = false,
  children,
}: SectionPanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="rounded-xl border bg-card transition-shadow data-open:shadow-sm"
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        {handle}
        <CollapsibleTrigger className="flex flex-1 items-center gap-2 rounded-md text-left font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              !open && "-rotate-90",
            )}
          />
          <span className="line-clamp-1">{title}</span>
          {count !== undefined && (
            <span className="rounded-full bg-muted px-2 font-mono text-xs text-muted-foreground tabular-nums">
              {count}
            </span>
          )}
        </CollapsibleTrigger>
        {section && <VisibilitySwitch section={section} title={title} />}
      </div>
      <CollapsibleContent>
        <div className="border-t p-3">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function VisibilitySwitch({
  section,
  title,
}: {
  section: string;
  title: string;
}) {
  const hidden = useResumeDoc((s) => s.data.layout.hidden.includes(section));
  const { toggleSection } = useResumeOps();
  const Icon = hidden ? EyeOff : Eye;

  return (
    <label className="flex items-center gap-1.5 text-muted-foreground">
      <Icon className="size-4" />
      <Switch
        size="sm"
        checked={!hidden}
        onCheckedChange={(checked) => toggleSection(section, !checked)}
        aria-label={`Show ${title} on resume`}
      />
    </label>
  );
}

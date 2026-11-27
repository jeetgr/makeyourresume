"use client";

import { useState } from "react";
import { ChevronDown, Copy, Trash2 } from "lucide-react";

import { cn } from "@/utils/cn";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FieldRenderer } from "./fields/field-renderer";
import type { FieldDef } from "./sections";

type ItemCardProps<T> = {
  item: T;
  label: string;
  fields: FieldDef<Extract<keyof T, string>>[];
  handle: React.ReactNode;
  defaultOpen?: boolean;
  onChange: (patch: Partial<T>) => void;
  onDuplicate: () => void;
  onRemove: () => void;
};

/** Collapsible editor for one list item; fields come from config. */
export function ItemCard<T>({
  item,
  label,
  fields,
  handle,
  defaultOpen = false,
  onChange,
  onDuplicate,
  onRemove,
}: ItemCardProps<T>) {
  const [open, setOpen] = useState(defaultOpen);
  const name = label || "Untitled";

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="rounded-md border bg-background"
    >
      <div className="flex items-center gap-1.5 py-1 pr-1 pl-2">
        {handle}
        <CollapsibleTrigger className="flex flex-1 items-center gap-1.5 text-left text-sm">
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform",
              !open && "-rotate-90",
            )}
          />
          <span
            className={cn("line-clamp-1", !label && "text-muted-foreground")}
          >
            {name}
          </span>
        </CollapsibleTrigger>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Duplicate ${name}`}
          onClick={onDuplicate}
        >
          <Copy />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Remove ${name}`}
          className="text-destructive"
          onClick={onRemove}
        >
          <Trash2 />
        </Button>
      </div>
      <CollapsibleContent className="grid gap-3 border-t p-3 sm:grid-cols-2">
        {fields.map((field) => (
          <FieldRenderer
            key={field.name}
            field={field}
            value={item[field.name]}
            onChange={(value) =>
              onChange({ [field.name]: value } as Partial<T>)
            }
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

"use client";

import { useId } from "react";

import { capitalize } from "@/utils/capitalize";
import { cn } from "@/utils/cn";
import type { DateRange, MonthYear } from "@/lib/resume/schema";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FieldDef } from "../sections";
import { BulletsField } from "./bullets-field";
import { DateRangeField } from "./date-range-field";
import { MarkdownTextarea } from "./markdown-textarea";
import { MonthYearPicker } from "./month-year-picker";
import { TagsInput } from "./tags-input";

type FieldRendererProps = {
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
};

/** Labelled input for a `FieldDef`; spans both grid columns for long kinds or `span: 2`. */
export function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  const id = useId();
  const full =
    field.kind === "markdown" ||
    field.kind === "dateRange" ||
    field.kind === "tags" ||
    field.kind === "bullets" ||
    ("span" in field && field.span === 2);
  const fieldset = field.kind === "dateRange";

  return (
    <div className={cn("space-y-1.5", full && "col-span-full")}>
      {fieldset ? (
        <p className="text-sm font-medium">{field.label}</p>
      ) : (
        <Label htmlFor={id}>{field.label}</Label>
      )}
      <Control id={id} field={field} value={value} onChange={onChange} />
    </div>
  );
}

function Control({
  id,
  field,
  value,
  onChange,
}: FieldRendererProps & { id: string }) {
  switch (field.kind) {
    case "text":
    case "url":
    case "email":
    case "tel":
      return (
        <Input
          id={id}
          type={field.kind}
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "markdown":
      return (
        <MarkdownTextarea
          id={id}
          rows={field.rows}
          value={(value as string) ?? ""}
          onChange={onChange}
        />
      );
    case "dateRange":
      return (
        <DateRangeField
          value={value as DateRange | undefined}
          onChange={onChange}
        />
      );
    case "monthYear":
      return (
        <MonthYearPicker
          id={id}
          label={field.label}
          value={value as MonthYear | undefined}
          onChange={onChange}
        />
      );
    case "select": {
      const items = field.options.map((o) => ({
        value: o,
        label: capitalize(o),
      }));
      return (
        <Select
          items={items}
          value={value as string}
          onValueChange={(v) => v && onChange(v)}
        >
          <SelectTrigger id={id} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {items.map(({ value, label }) => {
              const Icon = field.icons?.[value];
              return (
                <SelectItem key={value} value={value}>
                  {Icon && <Icon />}
                  {label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      );
    }
    case "tags":
      return (
        <TagsInput
          id={id}
          value={(value as string[]) ?? []}
          onChange={onChange}
        />
      );
    case "bullets":
      return (
        <BulletsField
          id={id}
          value={(value as { id: string; text: string }[]) ?? []}
          onChange={onChange}
        />
      );
  }
}

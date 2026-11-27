"use client";

import type { MonthYear } from "@/lib/resume/schema";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = [
  { value: "0", label: "Month" },
  ...Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: new Date(2000, i).toLocaleString("en", { month: "short" }),
  })),
];

type MonthYearPickerProps = {
  id: string;
  value: MonthYear | undefined;
  onChange: (value: MonthYear | undefined) => void;
  disabled?: boolean;
  /** Accessible name prefix, e.g. "Start". */
  label: string;
};

/** Optional month + year; clearing the year clears the value. */
export function MonthYearPicker({
  id,
  value,
  onChange,
  disabled,
  label,
}: MonthYearPickerProps) {
  const setMonth = (month: string | null) => {
    if (!value) return;
    const m = Number(month);
    onChange({ year: value.year, ...(m ? { month: m } : {}) });
  };

  const setYear = (raw: string) => {
    const year = Number.parseInt(raw, 10);
    onChange(
      Number.isNaN(year)
        ? undefined
        : { year, ...(value?.month ? { month: value.month } : {}) },
    );
  };

  return (
    <div className="flex gap-2">
      <Select
        items={months}
        value={String(value?.month ?? 0)}
        onValueChange={setMonth}
        disabled={disabled || !value}
      >
        <SelectTrigger className="w-24" aria-label={`${label} month`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {months.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        min={1900}
        max={2100}
        placeholder="Year"
        aria-label={`${label} year`}
        className="w-24"
        value={value?.year ?? ""}
        onChange={(e) => setYear(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}

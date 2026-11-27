"use client";

import { useId } from "react";

import type { DateRange } from "@/lib/resume/schema";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MonthYearPicker } from "./month-year-picker";

type DateRangeFieldProps = {
  value: DateRange | undefined;
  onChange: (value: DateRange) => void;
};

export function DateRangeField({ value, onChange }: DateRangeFieldProps) {
  const id = useId();
  const range = value ?? { present: false };
  const set = (patch: Partial<DateRange>) => onChange({ ...range, ...patch });

  return (
    <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
      <div className="space-y-1">
        <Label htmlFor={`${id}-start`}>Start</Label>
        <MonthYearPicker
          id={`${id}-start`}
          label="Start"
          value={range.start}
          onChange={(start) => set({ start })}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${id}-end`}>End</Label>
        <MonthYearPicker
          id={`${id}-end`}
          label="End"
          value={range.end}
          onChange={(end) => set({ end })}
          disabled={range.present}
        />
      </div>
      <Label className="h-8 gap-2 font-normal">
        <Checkbox
          checked={range.present}
          onCheckedChange={(present) => set({ present })}
        />
        Present
      </Label>
    </div>
  );
}

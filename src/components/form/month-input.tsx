import { useId } from "react";

import { cn } from "@/utils/cn";
import type { MonthYear } from "@/lib/resume/schema";

import { Input } from "../ui/input";
import { Label } from "../ui/label";

const toValue = (date?: MonthYear) =>
  date ? `${date.year}-${String(date.month ?? 1).padStart(2, "0")}` : "";

const fromValue = (value: string): MonthYear | undefined => {
  const [year, month] = value.split("-").map(Number);
  return year ? { year, month } : undefined;
};

type MonthInputProps = {
  label: string;
  value?: MonthYear;
  onChange: (value: MonthYear | undefined) => void;
  disabled?: boolean;
  className?: string;
};

/** Temporary native month picker; replaced by month/year picker in P7. */
export function MonthInput({
  label,
  value,
  onChange,
  disabled,
  className,
}: MonthInputProps) {
  const id = useId();

  return (
    <div className={cn("space-y-1", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="month"
        value={toValue(value)}
        disabled={disabled}
        onChange={(e) => onChange(fromValue(e.target.value))}
      />
    </div>
  );
}

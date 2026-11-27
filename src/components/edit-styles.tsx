"use client";

import { cn } from "@/utils/cn";
import { capitalize } from "@/utils/capitalize";

import { DENSITIES, defaultTheme, type Density } from "@/lib/resume/theme";
import { setTheme, useTheme } from "@/stores/resume-store";

import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import EditAccentColors from "./edit-accent-colors";

const densityItems = DENSITIES.map((value) => ({
  value,
  label: capitalize(value),
}));

interface EditStylesProps {
  className?: string;
}

export default function EditStyles({ className }: EditStylesProps) {
  const { density } = useTheme();

  return (
    <div className={cn("flex flex-col gap-2 sm:gap-4", className)}>
      <EditAccentColors />

      <div className="space-y-2">
        <Label>Spacing</Label>
        <Select
          items={densityItems}
          value={density}
          onValueChange={(value) =>
            value && setTheme({ density: value as Density })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {densityItems.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        className="mt-2 ml-auto sm:mt-4"
        variant="accent"
        onClick={() => setTheme(defaultTheme)}
      >
        Reset Styles
      </Button>
    </div>
  );
}

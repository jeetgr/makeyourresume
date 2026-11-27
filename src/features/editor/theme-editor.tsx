"use client";

import { useId } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { Palette, RotateCcw } from "lucide-react";

import { cn } from "@/utils/cn";
import { DENSITIES, FONTS, type Theme } from "@/lib/resume/theme";
import { FONT_FAMILIES } from "@/pdf/fonts";
import { getTemplate, templateTheme } from "@/templates/registry";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useResumeDoc, useResumeOps } from "./resume-doc";

const ACCENTS = [
  "#cd6060",
  "#00856d",
  "#006e85",
  "#2b4c9b",
  "#730779",
  "#333333",
];

const fontItems = FONTS.map((value) => ({
  value,
  label: FONT_FAMILIES[value].label,
}));

const densityLabels: Record<Theme["density"], string> = {
  compact: "Compact",
  normal: "Normal",
  relaxed: "Relaxed",
};

export function ThemeEditor() {
  const theme = useResumeDoc((s) => s.theme);
  const templateId = useResumeDoc((s) => s.templateId);
  const { setTheme } = useResumeOps();
  const id = useId();

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        <Palette /> Design
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="max-h-(--available-height) w-80 gap-5 overflow-y-auto p-4"
      >
        <div className="space-y-2">
          <Label htmlFor={`${id}-accent`}>Accent color</Label>
          <div className="flex flex-wrap gap-2">
            {ACCENTS.map((color) => (
              <button
                key={color}
                type="button"
                className={cn(
                  "size-7 rounded-full ring-offset-2 ring-offset-background",
                  theme.accent.toLowerCase() === color && "ring-2 ring-ring",
                )}
                style={{ backgroundColor: color }}
                aria-label={`Accent ${color}`}
                aria-pressed={theme.accent.toLowerCase() === color}
                onClick={() => setTheme({ accent: color })}
              />
            ))}
          </div>
          <HexColorPicker
            color={theme.accent}
            onChange={(accent) => setTheme({ accent })}
            style={{ width: "100%", height: 120 }}
          />
          <HexColorInput
            id={`${id}-accent`}
            color={theme.accent}
            onChange={(accent) => setTheme({ accent })}
            prefixed
            className="h-9 w-full rounded-md border px-3 text-sm uppercase"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${id}-font`}>Font</Label>
          <Select
            items={fontItems}
            value={theme.font}
            onValueChange={(font) => font && setTheme({ font })}
          >
            <SelectTrigger id={`${id}-font`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontItems.map(({ value, label }) => (
                <SelectItem
                  key={value}
                  value={value}
                  style={{ fontFamily: `"pdf-${value}"` }}
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label id={`${id}-size`}>Font size</Label>
            <span className="text-sm text-muted-foreground">
              {theme.baseSize}pt
            </span>
          </div>
          <Slider
            aria-labelledby={`${id}-size`}
            min={8}
            max={12}
            step={0.5}
            value={theme.baseSize}
            onValueChange={(v) => setTheme({ baseSize: v as number })}
          />
        </div>

        <Segmented
          label="Spacing"
          value={theme.density}
          options={DENSITIES.map((d) => [d, densityLabels[d]])}
          onChange={(density) => setTheme({ density })}
        />

        <Segmented
          label="Page size"
          value={theme.pageSize}
          options={[
            ["A4", "A4"],
            ["LETTER", "Letter"],
          ]}
          onChange={(pageSize) => setTheme({ pageSize })}
        />

        <Button
          variant="ghost"
          size="sm"
          className="self-start"
          onClick={() => setTheme(templateTheme(getTemplate(templateId)))}
        >
          <RotateCcw /> Reset to template default
        </Button>
      </PopoverContent>
    </Popover>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: [T, string][];
  onChange: (value: T) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div
        role="group"
        aria-label={label}
        className="grid auto-cols-fr grid-flow-col rounded-md bg-muted p-1"
      >
        {options.map(([option, text]) => (
          <button
            key={option}
            type="button"
            aria-pressed={value === option}
            className={cn(
              "rounded px-2 py-1 text-sm text-muted-foreground",
              value === option && "bg-background text-foreground shadow-sm",
            )}
            onClick={() => onChange(option)}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

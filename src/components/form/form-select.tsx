import React, { Fragment } from "react";

import { capitalize } from "@/utils/capitalize";
import { cn } from "@/utils/cn";

import { NETWORKS } from "@/lib/resume/schema";

import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Label } from "../ui/label";

const items = NETWORKS.map((name) => ({
  value: name,
  label: capitalize(name),
}));

type FromSelectProps = {
  label: string;
  placeholder: string;
  defaultValue: string;
  onValueChange: (value: string) => void;
  className?: string;
};

export default function FormSelect({
  label,
  placeholder,
  defaultValue,
  onValueChange,
  className,
}: FromSelectProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <Label>{label}</Label>
      <Select
        items={items}
        defaultValue={defaultValue}
        onValueChange={(value) => value && onValueChange(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {NETWORKS.map((socialName) => (
            <Fragment key={socialName}>
              <SelectItem value={socialName}>
                {capitalize(socialName)}
              </SelectItem>
            </Fragment>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

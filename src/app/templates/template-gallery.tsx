"use client";

import { useState } from "react";

import { templateCatalog } from "@/templates/catalog";
import { cn } from "@/utils/cn";

import { TiltCard } from "@/components/fx/tilt-card";
import { TemplateThumbnail } from "@/components/template-thumbnail";
import { TemplateLink } from "./template-link";

const ALL = "All";
const tags = [ALL, ...new Set(templateCatalog.flatMap((t) => t.tags))];
const count = (tag: string) =>
  tag === ALL
    ? templateCatalog.length
    : templateCatalog.filter((t) => t.tags.includes(tag)).length;

export function TemplateGallery() {
  const [tag, setTag] = useState(ALL);
  const shown =
    tag === ALL
      ? templateCatalog
      : templateCatalog.filter((t) => t.tags.includes(tag));

  return (
    <div className="space-y-8">
      <div
        role="group"
        aria-label="Filter templates"
        className="flex flex-wrap gap-2"
      >
        {tags.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={tag === t}
            onClick={() => setTag(t)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              tag === t
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card hover:bg-accent",
            )}
          >
            {t}
            <span className="font-mono text-xs opacity-60">{count(t)}</span>
          </button>
        ))}
      </div>

      {/* keyed by tag → entrance replays on filter */}
      <ul
        key={tag}
        className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {shown.map((template, i) => (
          <li
            key={template.id}
            className="motion-safe:animate-blur-fade"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <TemplateLink
              templateId={template.id}
              className="group block space-y-3 rounded-xl focus-visible:outline-none"
            >
              <TiltCard>
                <div className="border-beam overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow duration-300 group-hover:shadow-xl group-focus-visible:ring-2 group-focus-visible:ring-ring before:z-10 before:opacity-0 before:transition-opacity group-hover:before:opacity-100 group-focus-visible:before:opacity-100">
                  <TemplateThumbnail templateId={template.id} eager={i < 4} />
                </div>
              </TiltCard>
              <div className="space-y-1">
                <p className="font-semibold">{template.name}</p>
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
                <ul className="flex flex-wrap gap-1 pt-1">
                  {template.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border px-2 py-0.5 font-mono text-[0.7rem] text-muted-foreground"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </TemplateLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

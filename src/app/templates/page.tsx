import type { Metadata } from "next";

import { templateCatalog } from "@/templates/catalog";

import { TemplateThumbnail } from "@/components/template-thumbnail";
import { TemplateLink } from "./template-link";

export const metadata: Metadata = {
  title: "Templates",
  description: `Free resume templates: ${templateCatalog.map((t) => t.name).join(", ")}. ATS-friendly, with a live PDF preview.`,
};

const TemplatesPage = () => {
  return (
    <section className="py-20">
      <div className="mb-6">
        <h2 className="font-display text-4xl/tight tracking-tight">
          Select a Template
        </h2>
        <p className="text-base">
          Pick a starting look. You can switch templates and adjust colors,
          fonts and spacing anytime.
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {templateCatalog.map((template, i) => (
          <li key={template.id}>
            <TemplateLink
              templateId={template.id}
              className="group block space-y-2 rounded focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <div className="overflow-hidden rounded border-2 shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-md">
                <TemplateThumbnail templateId={template.id} priority={i < 4} />
              </div>
              <div>
                <p className="font-semibold">{template.name}</p>
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
                <ul className="mt-1.5 flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </TemplateLink>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TemplatesPage;

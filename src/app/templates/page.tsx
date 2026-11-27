import { templateCatalog } from "@/templates/catalog";

import { TemplateThumbnail } from "@/components/template-thumbnail";
import { TemplateLink } from "./template-link";

const TemplatesPage = () => {
  return (
    <section className="py-20">
      <div className="mb-6">
        <h2 className="text-3xl/tight font-bold text-accent">
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
              </div>
            </TemplateLink>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TemplatesPage;

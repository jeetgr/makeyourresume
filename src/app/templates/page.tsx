import type { Metadata } from "next";

import { templateCatalog } from "@/templates/catalog";

import { PageHeading } from "@/components/page-heading";
import { TemplateGallery } from "./template-gallery";

export const metadata: Metadata = {
  title: "Templates",
  description: `Free resume templates: ${templateCatalog.map((t) => t.name).join(", ")}. ATS-friendly, with a live PDF preview.`,
};

export default function TemplatesPage() {
  return (
    <section className="space-y-8 pt-28 pb-20">
      <PageHeading
        title="Templates"
        description="Fonts, colors and spacing can be adjusted in the editor. Switching templates keeps your content."
      />
      <TemplateGallery />
    </section>
  );
}

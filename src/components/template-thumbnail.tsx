import Image from "next/image";

import { getTemplateMeta, thumbnailSrc } from "@/templates/catalog";

/** Static page-1 render of a template w/ sample data (`pnpm thumbnails`). */
export function TemplateThumbnail({
  templateId,
  priority,
}: {
  templateId: string;
  priority?: boolean;
}) {
  const { id, name } = getTemplateMeta(templateId);

  return (
    <Image
      src={thumbnailSrc(id)}
      alt={`${name} template preview`}
      width={600}
      height={849}
      priority={priority}
      className="h-auto w-full bg-white"
    />
  );
}

import Image from "next/image";

import { getTemplateMeta, thumbnailSrc } from "@/templates/catalog";

/** Static page-1 render of a template w/ sample data (`pnpm thumbnails`). */
export function TemplateThumbnail({
  templateId,
  eager,
}: {
  templateId: string;
  /** Above the fold. Several candidates for LCP, so `loading` not `preload`. */
  eager?: boolean;
}) {
  const { id, name } = getTemplateMeta(templateId);

  return (
    <Image
      src={thumbnailSrc(id)}
      alt={`${name} template preview`}
      width={600}
      height={849}
      loading={eager ? "eager" : undefined}
      className="h-auto w-full bg-white"
    />
  );
}

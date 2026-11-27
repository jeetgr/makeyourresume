import type { ListItem } from "@/lib/resume/schema";

type ProjectPreviewProps = Omit<ListItem<"projects">, "id">;

export const ProjectPreview = ({
  name,
  description,
  liveUrl,
  sourceUrl,
  tags,
}: ProjectPreviewProps) => {
  return (
    <div className="flex min-h-full flex-col justify-center text-sm font-medium text-accent">
      <div className="flex gap-2">
        <p>{name}</p>
        {tags.length > 0 && <span>|</span>}
        <p>{tags.join(",")}</p>
      </div>
      <div className="flex gap-2">
        <p className="break-all">{sourceUrl}</p>
        {liveUrl && <span>-</span>}
        <p className="break-all">{liveUrl}</p>
      </div>
      <p className="line-clamp-1 text-accent/60">{description}</p>
    </div>
  );
};

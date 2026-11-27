import type { ListItem } from "@/lib/resume/schema";

type SkillPreviewProps = Omit<ListItem<"skills">, "id">;

export const SkillPreview = ({ name }: SkillPreviewProps) => {
  return (
    <div className="flex min-h-full items-center gap-2 text-sm font-medium text-accent">
      <p className="text-sm uppercase">{name}</p>
    </div>
  );
};

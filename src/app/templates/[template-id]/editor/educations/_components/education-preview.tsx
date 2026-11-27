import { formatDateRange } from "@/lib/resume/format";
import type { ListItem } from "@/lib/resume/schema";

type EducationPreviewProps = Omit<ListItem<"education">, "id">;

export const EducationPreview = ({
  degree,
  institution,
  dates,
}: EducationPreviewProps) => {
  return (
    <div className="flex min-h-full flex-col justify-center text-sm font-medium text-accent">
      <div className="flex gap-2">
        <p>{degree}</p>
        {institution && <span>|</span>}
        <p>{institution}</p>
      </div>
      <p>{formatDateRange(dates)}</p>
    </div>
  );
};

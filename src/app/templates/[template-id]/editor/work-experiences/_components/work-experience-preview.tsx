import { formatDateRange } from "@/lib/resume/format";
import type { Experience } from "@/lib/resume/schema";

type WorkExperiencePreviewProps = Omit<Experience, "id" | "bullets">;

export const WorkExperiencePreview = ({
  company,
  role,
  location,
  dates,
}: WorkExperiencePreviewProps) => {
  return (
    <div className="flex min-h-full flex-col justify-center text-sm font-medium text-accent">
      <div className="flex gap-2">
        <p>{company}</p>
        {role && <span>|</span>}
        <p>{role}</p>
      </div>
      <p>{location}</p>
      <p>{formatDateRange(dates)}</p>
    </div>
  );
};

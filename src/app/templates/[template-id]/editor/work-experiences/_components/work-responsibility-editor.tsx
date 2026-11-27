import type { Experience } from "@/lib/resume/schema";

import DraggableItemWrapper from "@/components/form/draggable-item-wrapper";
import { Textarea } from "@/components/ui/textarea";

type WorkResponsibilityEditorProps = {
  bullet: Experience["bullets"][number];
  onChange: (text: string) => void;
  onRemove: () => void;
};

export const WorkResponsibilityEditor = ({
  bullet,
  onChange,
  onRemove,
}: WorkResponsibilityEditorProps) => {
  return (
    <DraggableItemWrapper
      id={bullet.id}
      preview={
        <div className="flex min-h-full items-center text-sm font-medium text-accent">
          <p>{bullet.text}</p>
        </div>
      }
      onRemoveClick={onRemove}
      removeSrOnlyLabel={`Remove ${bullet.text} from your resume`}
    >
      <Textarea
        placeholder="Enter your work responsibility"
        value={bullet.text}
        onChange={(e) => onChange(e.target.value)}
      />
    </DraggableItemWrapper>
  );
};

import { addItem, moveItem, useList } from "@/stores/resume-store";

import DNDContexts from "@/components/form/dnd-contexts";
import { WorkExperienceEditor } from "./work-experience-editor";
import { Button } from "@/components/ui/button";

export const WorkExperiences = () => {
  const workExperiences = useList("experience");

  const setItems = (oldIndex: number, newIndex: number) =>
    moveItem("experience", oldIndex, newIndex);

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        <DNDContexts
          items={workExperiences.map((workExperience) => ({
            id: workExperience.id,
          }))}
          setItems={setItems}
        >
          {workExperiences.map((workExperience) => (
            <WorkExperienceEditor {...workExperience} key={workExperience.id} />
          ))}
        </DNDContexts>
      </ul>

      <Button
        type="button"
        variant="accent"
        onClick={() =>
          addItem("experience", {
            bullets: [{ id: crypto.randomUUID(), text: "" }],
          })
        }
      >
        Add Work Experience
      </Button>
    </div>
  );
};

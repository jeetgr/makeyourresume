import { addItem, moveItem, useList } from "@/stores/resume-store";

import DNDContexts from "@/components/form/dnd-contexts";
import { EducationEditor } from "./education-editor";
import { Button } from "@/components/ui/button";

export const Educations = () => {
  const educations = useList("education");

  const setItems = (oldIndex: number, newIndex: number) =>
    moveItem("education", oldIndex, newIndex);

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        <DNDContexts
          items={educations.map((education) => ({ id: education.id }))}
          setItems={setItems}
        >
          {educations.map((education) => (
            <EducationEditor {...education} key={education.id} />
          ))}
        </DNDContexts>
      </ul>

      <Button
        type="button"
        variant="accent"
        onClick={() => addItem("education")}
      >
        Add Education
      </Button>
    </div>
  );
};

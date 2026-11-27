import { addItem, moveItem, useList } from "@/stores/resume-store";

import DNDContexts from "@/components/form/dnd-contexts";
import { SkillEditor } from "./skill-editor";
import { Button } from "@/components/ui/button";

export const Skills = () => {
  const skills = useList("skills");

  const setItems = (oldIndex: number, newIndex: number) =>
    moveItem("skills", oldIndex, newIndex);

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        <DNDContexts
          items={skills.map((skill) => ({ id: skill.id }))}
          setItems={setItems}
        >
          {skills.map((skill) => (
            <SkillEditor {...skill} key={skill.id} />
          ))}
        </DNDContexts>
      </ul>

      <Button type="button" variant="accent" onClick={() => addItem("skills")}>
        Add Skill
      </Button>
    </div>
  );
};

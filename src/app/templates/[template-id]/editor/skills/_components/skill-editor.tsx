import type { ListItem } from "@/lib/resume/schema";
import { removeItem, updateItem } from "@/stores/resume-store";

import DraggableItemWrapper from "@/components/form/draggable-item-wrapper";
import { TextInput } from "@/components/form/form-input";
import { SkillPreview } from "./skill-preview";

export const SkillEditor = ({ id, name }: ListItem<"skills">) => {
  return (
    <DraggableItemWrapper
      id={id}
      preview={<SkillPreview name={name} />}
      onRemoveClick={() => removeItem("skills", id)}
      removeSrOnlyLabel={`Remove ${name} skill`}
    >
      <TextInput
        label="Skill Name"
        placeholder="Enter your skill name"
        value={name}
        setValue={(value) => updateItem("skills", id, { name: value })}
      />
    </DraggableItemWrapper>
  );
};

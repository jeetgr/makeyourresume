import type { ListItem } from "@/lib/resume/schema";
import { removeItem, updateItem } from "@/stores/resume-store";

import DraggableItemWrapper from "@/components/form/draggable-item-wrapper";
import { TextInput } from "@/components/form/form-input";
import { InterestPreview } from "./interest-preview";

export const InterestEditor = ({ id, name }: ListItem<"interests">) => {
  return (
    <DraggableItemWrapper
      id={id}
      preview={<InterestPreview name={name} />}
      onRemoveClick={() => removeItem("interests", id)}
      removeSrOnlyLabel={`Remove ${name} interest`}
    >
      <div className="flex flex-wrap items-end gap-2">
        <TextInput
          label="Interest Name"
          placeholder="Enter your interest"
          value={name}
          setValue={(value) => updateItem("interests", id, { name: value })}
        />
      </div>
    </DraggableItemWrapper>
  );
};

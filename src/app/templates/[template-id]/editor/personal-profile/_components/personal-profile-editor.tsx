import type { CustomSection } from "@/lib/resume/schema";

import DraggableItemWrapper from "@/components/form/draggable-item-wrapper";
import { TextInput } from "@/components/form/form-input";
import { PersonalProfilePreview } from "./personal-profile-preview";

type Item = CustomSection["items"][number];

type PersonalProfileEditorProps = Item & {
  onChange: (patch: Partial<Item>) => void;
  onRemove: () => void;
};

export const PersonalProfileEditor = ({
  id,
  title,
  description,
  onChange,
  onRemove,
}: PersonalProfileEditorProps) => {
  return (
    <DraggableItemWrapper
      id={id}
      preview={
        <PersonalProfilePreview title={title} description={description} />
      }
      onRemoveClick={onRemove}
      removeSrOnlyLabel={`Remove field ${title} with value ${description}`}
    >
      <div className="flex flex-wrap items-end gap-2">
        <TextInput
          label="Field Name"
          placeholder="Enter the field name"
          value={title}
          setValue={(value) => onChange({ title: value })}
        />

        <TextInput
          label="Field Value"
          placeholder="Enter the field value"
          value={description}
          setValue={(value) => onChange({ description: value })}
        />
      </div>
    </DraggableItemWrapper>
  );
};

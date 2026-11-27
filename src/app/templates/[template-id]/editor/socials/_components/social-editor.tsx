import type { ListItem, Network } from "@/lib/resume/schema";
import { removeItem, updateItem } from "@/stores/resume-store";

import DraggableItemWrapper from "@/components/form/draggable-item-wrapper";
import { TextInput } from "@/components/form/form-input";
import FormSelect from "@/components/form/form-select";
import { SocialPreview } from "./social-preview";

export const SocialEditor = ({ id, network, url }: ListItem<"links">) => {
  return (
    <DraggableItemWrapper
      id={id}
      preview={<SocialPreview network={network} url={url} />}
      onRemoveClick={() => removeItem("links", id)}
      removeSrOnlyLabel={`Remove ${network} social with url ${url}`}
    >
      <div className="flex flex-wrap items-end gap-2">
        <FormSelect
          label="Social Name"
          placeholder="Select an Option"
          defaultValue={network}
          onValueChange={(value) =>
            updateItem("links", id, { network: value as Network })
          }
        />

        <TextInput
          label="Social URL"
          placeholder="Enter your social link"
          value={url}
          setValue={(value) => updateItem("links", id, { url: value })}
        />
      </div>
    </DraggableItemWrapper>
  );
};

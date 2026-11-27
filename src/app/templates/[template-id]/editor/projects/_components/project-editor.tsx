import type { ListItem } from "@/lib/resume/schema";
import { removeItem, updateItem } from "@/stores/resume-store";

import DraggableItemWrapper from "@/components/form/draggable-item-wrapper";
import { TextInput } from "@/components/form/form-input";
import { TextArea } from "@/components/form/form-textarea";
import { ProjectPreview } from "./project-preview";

export const ProjectEditor = (project: ListItem<"projects">) => {
  const { id } = project;
  const setProject = (patch: Partial<ListItem<"projects">>) =>
    updateItem("projects", id, patch);

  return (
    <DraggableItemWrapper
      id={id}
      preview={<ProjectPreview {...project} />}
      onRemoveClick={() => removeItem("projects", id)}
      removeSrOnlyLabel={`Remove ${project.name} project from your resume`}
    >
      <div className="grid items-end gap-2">
        <TextInput
          label="Project Name"
          placeholder="Enter your project name"
          value={project.name}
          setValue={(name) => setProject({ name })}
        />

        <TextArea
          label="Project Description"
          placeholder="Enter your project description"
          value={project.description}
          setValue={(description) => setProject({ description })}
          rows={5}
        />

        <div className="grid grid-cols-2 gap-2">
          <TextInput
            label="Source Code Link"
            placeholder="Enter your source code link"
            value={project.sourceUrl}
            setValue={(sourceUrl) => setProject({ sourceUrl })}
            className="col-span-2 sm:col-span-1"
          />

          <TextInput
            label="Live Demo Link"
            placeholder="Enter your live demo link"
            value={project.liveUrl}
            setValue={(liveUrl) => setProject({ liveUrl })}
            className="col-span-2 sm:col-span-1"
          />
        </div>

        <TextInput
          label="Tags"
          placeholder="Enter your project tags, eg: HTML, CSS, JS"
          value={project.tags.join(",")}
          setValue={(value) =>
            setProject({ tags: value ? value.split(",") : [] })
          }
          className="flex-1"
        />
      </div>
    </DraggableItemWrapper>
  );
};

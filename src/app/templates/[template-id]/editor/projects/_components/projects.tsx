import { addItem, moveItem, useList } from "@/stores/resume-store";

import DNDContexts from "@/components/form/dnd-contexts";
import { ProjectEditor } from "./project-editor";
import { Button } from "@/components/ui/button";

export const Projects = () => {
  const projects = useList("projects");

  const setItems = (oldIndex: number, newIndex: number) =>
    moveItem("projects", oldIndex, newIndex);

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        <DNDContexts
          items={projects.map((project) => ({ id: project.id }))}
          setItems={setItems}
        >
          {projects.map((project) => (
            <ProjectEditor {...project} key={project.id} />
          ))}
        </DNDContexts>
      </ul>

      <Button
        type="button"
        variant="accent"
        onClick={() => addItem("projects")}
      >
        Add Project
      </Button>
    </div>
  );
};

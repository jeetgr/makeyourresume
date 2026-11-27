import { addItem, moveItem, useList } from "@/stores/resume-store";

import DNDContexts from "@/components/form/dnd-contexts";
import { InterestEditor } from "./interest-editor";
import { Button } from "@/components/ui/button";

export const Interests = () => {
  const interests = useList("interests");

  const setItems = (oldIndex: number, newIndex: number) =>
    moveItem("interests", oldIndex, newIndex);

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        <DNDContexts
          items={interests.map((interest) => ({ id: interest.id }))}
          setItems={setItems}
        >
          {interests.map((interest) => (
            <InterestEditor {...interest} key={interest.id} />
          ))}
        </DNDContexts>
      </ul>
      <Button
        type="button"
        variant="accent"
        onClick={() => addItem("interests")}
      >
        Add Interest
      </Button>
    </div>
  );
};

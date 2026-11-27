import { addItem, moveItem, useList } from "@/stores/resume-store";

import DNDContexts from "@/components/form/dnd-contexts";
import { Button } from "@/components/ui/button";
import { SocialEditor } from "./social-editor";

export const Socials = () => {
  const socials = useList("links");

  const setItems = (oldIndex: number, newIndex: number) =>
    moveItem("links", oldIndex, newIndex);

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        <DNDContexts
          items={socials.map((social) => ({ id: social.id }))}
          setItems={setItems}
        >
          {socials.map((social) => (
            <SocialEditor {...social} key={social.id} />
          ))}
        </DNDContexts>
      </ul>

      <Button type="button" variant="accent" onClick={() => addItem("links")}>
        Add Social
      </Button>
    </div>
  );
};

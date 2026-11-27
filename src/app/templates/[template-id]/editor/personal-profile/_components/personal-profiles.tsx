import type { CustomSection } from "@/lib/resume/schema";
import { move } from "@/lib/resume/ops";
import { addItem, updateItem, useList } from "@/stores/resume-store";

import DNDContexts from "@/components/form/dnd-contexts";
import { Button } from "@/components/ui/button";
import { PersonalProfileEditor } from "./personal-profile-editor";

/** Wizard's "Personal Profile" step edits this fixed custom section. */
const SECTION_ID = "personal-profile";
export const PERSONAL_PROFILE_SECTION = `custom:${SECTION_ID}`;

export const usePersonalProfile = () =>
  useList("customSections").find((s) => s.id === SECTION_ID);

type Item = CustomSection["items"][number];

export const PersonalProfiles = () => {
  const section = usePersonalProfile();
  const items = section?.items ?? [];

  const setItems = (next: Item[]) => {
    if (section) updateItem("customSections", SECTION_ID, { items: next });
    else
      addItem("customSections", {
        id: SECTION_ID,
        title: "Personal Profile",
        items: next,
      });
  };

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        <DNDContexts
          items={items}
          setItems={(from, to) => setItems(move(items, from, to))}
        >
          {items.map((item) => (
            <PersonalProfileEditor
              key={item.id}
              {...item}
              onChange={(patch) =>
                setItems(
                  items.map((i) => (i.id === item.id ? { ...i, ...patch } : i)),
                )
              }
              onRemove={() => setItems(items.filter((i) => i.id !== item.id))}
            />
          ))}
        </DNDContexts>
      </ul>

      <Button
        type="button"
        variant="accent"
        onClick={() =>
          setItems([
            ...items,
            {
              id: crypto.randomUUID(),
              title: "",
              subtitle: "",
              description: "",
            },
          ])
        }
      >
        Add Personal Profile
      </Button>
    </div>
  );
};

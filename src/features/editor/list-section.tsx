"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import type { ListItem } from "@/lib/resume/schema";

import { Button } from "@/components/ui/button";
import { ItemCard } from "./item-card";
import { useResumeDoc, useResumeOps } from "./resume-doc";
import { SectionPanel } from "./section-panel";
import { sectionDefs, type ListSectionKey } from "./sections";
import { SortableItem, SortableList } from "./sortable";

type ListSectionProps = {
  sectionKey: ListSectionKey;
  handle: React.ReactNode;
};

export function ListSection({ sectionKey, handle }: ListSectionProps) {
  const def = sectionDefs[sectionKey];
  const ids = useResumeDoc((s) => s.data[sectionKey].map((i) => i.id));
  const { addItem, moveItem } = useResumeOps();
  const [added, setAdded] = useState<string | null>(null);

  const add = () => {
    const id = crypto.randomUUID();
    setAdded(id);
    addItem(sectionKey, { ...def.newItem?.(), id });
  };

  return (
    <SectionPanel
      title={def.title}
      section={sectionKey}
      count={ids.length}
      handle={handle}
    >
      <SortableList
        ids={ids}
        onMove={(from, to) => moveItem(sectionKey, from, to)}
        className="mb-3 space-y-2 empty:hidden"
      >
        {ids.map((id) => (
          <SortableItem key={id} id={id}>
            {(itemHandle) => (
              <ListItemEditor
                sectionKey={sectionKey}
                id={id}
                handle={itemHandle}
                defaultOpen={id === added}
              />
            )}
          </SortableItem>
        ))}
      </SortableList>
      <Button variant="outline" size="sm" onClick={add}>
        <Plus /> Add {def.itemName}
      </Button>
    </SectionPanel>
  );
}

function ListItemEditor<K extends ListSectionKey>({
  sectionKey,
  id,
  handle,
  defaultOpen,
}: {
  sectionKey: K;
  id: string;
  handle: React.ReactNode;
  defaultOpen: boolean;
}) {
  const def = sectionDefs[sectionKey];
  const item = useResumeDoc((s) =>
    (s.data[sectionKey] as ListItem<K>[]).find((i) => i.id === id),
  );
  const { updateItem, duplicateItem, removeItem } = useResumeOps();

  if (!item) return null;

  return (
    <ItemCard
      item={item}
      label={def.itemLabel(item)}
      fields={def.fields}
      handle={handle}
      defaultOpen={defaultOpen}
      onChange={(patch) => updateItem(sectionKey, id, patch)}
      onDuplicate={() => duplicateItem(sectionKey, id)}
      onRemove={() => removeItem(sectionKey, id)}
    />
  );
}

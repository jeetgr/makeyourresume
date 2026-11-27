"use client";

import { useId, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { move } from "@/lib/resume/ops";
import type { CustomSection } from "@/lib/resume/schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ItemCard } from "./item-card";
import { useResumeDoc, useResumeOps } from "./resume-doc";
import { SectionPanel } from "./section-panel";
import { customItemFields } from "./sections";
import { SortableItem, SortableList } from "./sortable";

type Item = CustomSection["items"][number];

type CustomSectionEditorProps = {
  id: string;
  handle: React.ReactNode;
  defaultOpen?: boolean;
};

export function CustomSectionEditor({
  id,
  handle,
  defaultOpen,
}: CustomSectionEditorProps) {
  const titleId = useId();
  const section = useResumeDoc((s) =>
    s.data.customSections.find((c) => c.id === id),
  );
  const { updateItem, removeItem } = useResumeOps();
  const [added, setAdded] = useState<string | null>(null);

  if (!section) return null;

  const setItems = (items: Item[]) =>
    updateItem("customSections", id, { items });

  const add = () => {
    const item = {
      id: crypto.randomUUID(),
      title: "",
      subtitle: "",
      description: "",
    };
    setAdded(item.id);
    setItems([...section.items, item]);
  };

  return (
    <SectionPanel
      title={section.title || "Untitled section"}
      section={`custom:${id}`}
      count={section.items.length}
      handle={handle}
      defaultOpen={defaultOpen}
    >
      <div className="mb-3 space-y-1.5">
        <Label htmlFor={titleId}>Section title</Label>
        <Input
          id={titleId}
          value={section.title}
          onChange={(e) =>
            updateItem("customSections", id, { title: e.target.value })
          }
        />
      </div>
      <SortableList
        ids={section.items.map((i) => i.id)}
        onMove={(from, to) => setItems(move(section.items, from, to))}
        className="mb-3 space-y-2 empty:hidden"
      >
        {section.items.map((item, index) => (
          <SortableItem key={item.id} id={item.id}>
            {(itemHandle) => (
              <ItemCard
                item={item}
                label={item.title}
                fields={customItemFields}
                handle={itemHandle}
                defaultOpen={item.id === added}
                onChange={(patch) =>
                  setItems(
                    section.items.map((i) =>
                      i.id === item.id ? { ...i, ...patch } : i,
                    ),
                  )
                }
                onDuplicate={() =>
                  setItems(
                    section.items.toSpliced(index + 1, 0, {
                      ...structuredClone(item),
                      id: crypto.randomUUID(),
                    }),
                  )
                }
                onRemove={() => setItems(section.items.toSpliced(index, 1))}
              />
            )}
          </SortableItem>
        ))}
      </SortableList>
      <div className="flex flex-wrap justify-between gap-2">
        <Button variant="outline" size="sm" onClick={add}>
          <Plus /> Add item
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive"
          onClick={() => removeItem("customSections", id)}
        >
          <Trash2 /> Delete section
        </Button>
      </div>
    </SectionPanel>
  );
}

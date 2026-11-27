"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CustomSectionEditor } from "./custom-section";
import { ListSection } from "./list-section";
import { SummaryPanel } from "./profile-panel";
import { useResumeDoc, useResumeOps } from "./resume-doc";
import { isListSection } from "./sections";
import { SortableItem, SortableList } from "./sortable";

const CUSTOM = "custom:";

/** Reorderable section panels in `layout.order`. */
export function SectionsList() {
  const order = useResumeDoc((s) => s.data.layout.order);
  const { moveSection, addItem } = useResumeOps();
  const [added, setAdded] = useState<string | null>(null);

  const addCustom = () => {
    const id = crypto.randomUUID();
    setAdded(id);
    addItem("customSections", { id, title: "Custom section" });
  };

  return (
    <>
      <SortableList ids={order} onMove={moveSection} className="space-y-3">
        {order.map((key) => (
          <SortableItem key={key} id={key}>
            {(handle) =>
              key === "summary" ? (
                <SummaryPanel handle={handle} />
              ) : key.startsWith(CUSTOM) ? (
                <CustomSectionEditor
                  id={key.slice(CUSTOM.length)}
                  handle={handle}
                  defaultOpen={key === CUSTOM + added}
                />
              ) : isListSection(key) ? (
                <ListSection sectionKey={key} handle={handle} />
              ) : null
            }
          </SortableItem>
        ))}
      </SortableList>
      <Button variant="outline" className="w-full" onClick={addCustom}>
        <Plus /> Add custom section
      </Button>
    </>
  );
}

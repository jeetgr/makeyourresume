"use client";

import { useRef } from "react";
import { Plus, X } from "lucide-react";

import { move } from "@/lib/resume/ops";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SortableItem, SortableList } from "../sortable";

type Bullet = { id: string; text: string };

type BulletsFieldProps = {
  id: string;
  value: Bullet[];
  onChange: (value: Bullet[]) => void;
};

/** Enter adds a bullet below, Backspace on an empty bullet removes it. */
export function BulletsField({ id, value, onChange }: BulletsFieldProps) {
  const focusId = useRef<string | null>(null);
  const inputs = useRef(new Map<string, HTMLInputElement>());

  const insertAfter = (index: number) => {
    const bullet = { id: crypto.randomUUID(), text: "" };
    focusId.current = bullet.id;
    onChange(value.toSpliced(index + 1, 0, bullet));
  };

  const remove = (index: number) => {
    const prev = value[index - 1];
    if (prev) inputs.current.get(prev.id)?.focus();
    onChange(value.toSpliced(index, 1));
  };

  return (
    <div className="space-y-2">
      <SortableList
        ids={value.map((b) => b.id)}
        onMove={(from, to) => onChange(move(value, from, to))}
        className="space-y-1.5"
      >
        {value.map((bullet, index) => (
          <SortableItem key={bullet.id} id={bullet.id}>
            {(handle) => (
              <div className="flex items-center gap-1.5">
                {handle}
                <Input
                  id={index === 0 ? id : undefined}
                  aria-label={`Highlight ${index + 1}`}
                  ref={(el) => {
                    if (!el) {
                      inputs.current.delete(bullet.id);
                      return;
                    }
                    inputs.current.set(bullet.id, el);
                    if (focusId.current === bullet.id) {
                      focusId.current = null;
                      el.focus();
                    }
                  }}
                  value={bullet.text}
                  onChange={(e) =>
                    onChange(
                      value.map((b) =>
                        b.id === bullet.id ? { ...b, text: e.target.value } : b,
                      ),
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      insertAfter(index);
                    } else if (e.key === "Backspace" && !bullet.text) {
                      e.preventDefault();
                      remove(index);
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove highlight ${index + 1}`}
                  onClick={() => onChange(value.toSpliced(index, 1))}
                >
                  <X />
                </Button>
              </div>
            )}
          </SortableItem>
        ))}
      </SortableList>
      <Button
        variant="outline"
        size="sm"
        onClick={() => insertAfter(value.length - 1)}
      >
        <Plus /> Add highlight
      </Button>
    </div>
  );
}

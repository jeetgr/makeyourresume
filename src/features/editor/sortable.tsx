"use client";

import { useId } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type Modifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { cn } from "@/utils/cn";

/** Vertical only, kept inside the list (collapsible panels clip overflow). */
const restrictToList: Modifier = ({
  transform,
  draggingNodeRect,
  containerNodeRect,
}) => {
  if (!draggingNodeRect || !containerNodeRect) return { ...transform, x: 0 };
  const minY = containerNodeRect.top - draggingNodeRect.top;
  const maxY = containerNodeRect.bottom - draggingNodeRect.bottom;
  return { ...transform, x: 0, y: Math.min(Math.max(transform.y, minY), maxY) };
};

type SortableListProps = {
  ids: string[];
  onMove: (from: number, to: number) => void;
  className?: string;
  children: React.ReactNode;
};

/** Vertical sortable `<ul>`; each list gets its own `DndContext` so nesting works. */
export function SortableList({
  ids,
  onMove,
  className,
  children,
}: SortableListProps) {
  const id = useId();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    onMove(ids.indexOf(String(active.id)), ids.indexOf(String(over.id)));
  };

  return (
    <DndContext
      id={id}
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToList]}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <ul className={className}>{children}</ul>
      </SortableContext>
    </DndContext>
  );
}

type SortableItemProps = {
  id: string;
  className?: string;
  /** Receives the drag handle to place. */
  children: (handle: React.ReactNode) => React.ReactNode;
};

export function SortableItem({ id, className, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const handle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      aria-label="Drag to reorder"
      className="cursor-grab touch-none rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-4" />
    </button>
  );

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        isDragging &&
          "relative z-10 scale-[1.015] rounded-xl shadow-xl ring-2 ring-highlight [&_*]:cursor-grabbing",
        "transition-[scale,box-shadow] duration-150 motion-reduce:transition-none",
        className,
      )}
    >
      {children(handle)}
    </li>
  );
}

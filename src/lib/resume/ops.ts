import { emptyItem } from "./empty";
import type { ListItem, ListKey, Profile, ResumeData } from "./schema";

const customKey = (id: string) => `custom:${id}`;

const list = <K extends ListKey>(d: ResumeData, key: K) =>
  d[key] as ListItem<K>[];

export function move<T>(items: readonly T[], from: number, to: number): T[] {
  const next = [...items];
  const [item] = next.splice(from, 1);
  if (item !== undefined) next.splice(to, 0, item);
  return next;
}

export function setProfile(d: ResumeData, patch: Partial<Profile>): ResumeData {
  return { ...d, profile: { ...d.profile, ...patch } };
}

export function addItem<K extends ListKey>(
  d: ResumeData,
  key: K,
  item?: Partial<ListItem<K>>,
): ResumeData {
  const newItem = { ...emptyItem(key), ...item };
  const next = { ...d, [key]: [...list(d, key), newItem] };
  if (key !== "customSections") return next;

  return {
    ...next,
    layout: { ...d.layout, order: [...d.layout.order, customKey(newItem.id)] },
  };
}

export function updateItem<K extends ListKey>(
  d: ResumeData,
  key: K,
  id: string,
  patch: Partial<ListItem<K>>,
): ResumeData {
  return {
    ...d,
    [key]: list(d, key).map((item) =>
      item.id === id ? { ...item, ...patch } : item,
    ),
  };
}

export function removeItem(
  d: ResumeData,
  key: ListKey,
  id: string,
): ResumeData {
  const next = { ...d, [key]: list(d, key).filter((item) => item.id !== id) };
  if (key !== "customSections") return next;

  const section = customKey(id);
  return {
    ...next,
    layout: {
      order: d.layout.order.filter((k) => k !== section),
      hidden: d.layout.hidden.filter((k) => k !== section),
    },
  };
}

export function moveItem(
  d: ResumeData,
  key: ListKey,
  from: number,
  to: number,
): ResumeData {
  return { ...d, [key]: move(list(d, key), from, to) };
}

/** Like `classList.toggle`: flips visibility, or sets it when `hidden` is given. */
export function toggleSection(
  d: ResumeData,
  section: string,
  hidden = !d.layout.hidden.includes(section),
): ResumeData {
  const rest = d.layout.hidden.filter((k) => k !== section);
  return {
    ...d,
    layout: { ...d.layout, hidden: hidden ? [...rest, section] : rest },
  };
}

export function moveSection(
  d: ResumeData,
  from: number,
  to: number,
): ResumeData {
  return {
    ...d,
    layout: { ...d.layout, order: move(d.layout.order, from, to) },
  };
}

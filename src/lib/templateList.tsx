import { ForwardRefExoticComponent, RefAttributes } from "react";

import Template1 from "@/components/resume-templates/template-1";

type TemplateList = {
  id: string;
  name: string;
  component: ForwardRefExoticComponent<RefAttributes<HTMLDivElement>>;
}[];

export const templatesList: TemplateList = [
  {
    id: "template-1",
    name: "Template 1",
    component: Template1,
  },
];

export const templateComponents: Partial<
  Record<string, TemplateList[number]["component"]>
> = Object.fromEntries(templatesList.map((t) => [t.id, t.component]));

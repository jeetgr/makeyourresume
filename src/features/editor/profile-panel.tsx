"use client";

import type { Profile } from "@/lib/resume/schema";

import ImageInput from "@/components/form/image-input";
import { FieldRenderer } from "./fields/field-renderer";
import { useResumeDoc, useResumeOps } from "./resume-doc";
import { SectionPanel } from "./section-panel";
import type { FieldDef } from "./sections";

const fields: FieldDef<keyof Profile>[] = [
  { name: "firstName", label: "First name", kind: "text" },
  { name: "lastName", label: "Last name", kind: "text" },
  {
    name: "headline",
    label: "Headline",
    kind: "text",
    placeholder: "Software Engineer",
    span: 2,
  },
  { name: "email", label: "Email", kind: "email" },
  { name: "phone", label: "Phone", kind: "tel" },
  { name: "location", label: "Location", kind: "text", span: 2 },
];

/** Fixed first panel; not reorderable or hideable. */
export function ProfilePanel() {
  const profile = useResumeDoc((s) => s.data.profile);
  const { setProfile } = useResumeOps();

  return (
    <SectionPanel title="Profile" defaultOpen>
      <div className="grid gap-3 sm:grid-cols-2">
        <ImageInput
          className="col-span-full"
          value={profile.photo}
          onChange={(photo) => setProfile({ photo })}
        />
        {fields.map((field) => (
          <FieldRenderer
            key={field.name}
            field={field}
            value={profile[field.name]}
            onChange={(value) => setProfile({ [field.name]: value })}
          />
        ))}
      </div>
    </SectionPanel>
  );
}

export function SummaryPanel({ handle }: { handle: React.ReactNode }) {
  const summary = useResumeDoc((s) => s.data.profile.summary);
  const { setProfile } = useResumeOps();

  return (
    <SectionPanel title="Summary" section="summary" handle={handle}>
      <FieldRenderer
        field={{ name: "summary", label: "Summary", kind: "markdown", rows: 5 }}
        value={summary}
        onChange={(value) => setProfile({ summary: value as string })}
      />
    </SectionPanel>
  );
}

import type { DateRange, ListItem } from "@/lib/resume/schema";
import { removeItem, updateItem } from "@/stores/resume-store";

import DraggableItemWrapper from "@/components/form/draggable-item-wrapper";
import { TextInput } from "@/components/form/form-input";
import { MonthInput } from "@/components/form/month-input";
import { EducationPreview } from "./education-preview";

export const EducationEditor = (education: ListItem<"education">) => {
  const { id, degree, institution, dates } = education;

  const setDates = (patch: Partial<DateRange>) =>
    updateItem("education", id, { dates: { ...dates, ...patch } });

  return (
    <DraggableItemWrapper
      id={id}
      preview={<EducationPreview {...education} />}
      onRemoveClick={() => removeItem("education", id)}
      removeSrOnlyLabel={`Remove ${degree} from your resume`}
    >
      <div className="grid items-end gap-2">
        <TextInput
          label="Degree / Course Name"
          placeholder="Enter your course name"
          value={degree}
          setValue={(value) => updateItem("education", id, { degree: value })}
        />

        <TextInput
          label="Institute / College Name"
          placeholder="Enter your college name"
          value={institution}
          setValue={(value) =>
            updateItem("education", id, { institution: value })
          }
        />

        <div className="flex flex-wrap items-end justify-between gap-2">
          <MonthInput
            label="Start Date"
            value={dates.start}
            onChange={(start) => setDates({ start })}
            className="min-w-40 flex-1"
          />

          <MonthInput
            label="End Date"
            value={dates.end}
            onChange={(end) => setDates({ end })}
            className="min-w-40 flex-1"
          />
        </div>
      </div>
    </DraggableItemWrapper>
  );
};

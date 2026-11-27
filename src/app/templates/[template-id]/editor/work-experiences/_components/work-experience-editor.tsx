import type { DateRange, Experience } from "@/lib/resume/schema";
import { move } from "@/lib/resume/ops";
import { removeItem, updateItem } from "@/stores/resume-store";

import DraggableItemWrapper from "@/components/form/draggable-item-wrapper";
import { TextInput } from "@/components/form/form-input";
import { MonthInput } from "@/components/form/month-input";
import DNDContexts from "@/components/form/dnd-contexts";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { WorkExperiencePreview } from "./work-experience-preview";
import { WorkResponsibilityEditor } from "./work-responsibility-editor";

export const WorkExperienceEditor = (experience: Experience) => {
  const { id, dates, bullets } = experience;

  const setExperience = (patch: Partial<Experience>) =>
    updateItem("experience", id, patch);

  const setDates = (patch: Partial<DateRange>) =>
    setExperience({ dates: { ...dates, ...patch } });

  const setBullets = (next: Experience["bullets"]) =>
    setExperience({ bullets: next });

  return (
    <DraggableItemWrapper
      id={id}
      preview={<WorkExperiencePreview {...experience} />}
      onRemoveClick={() => removeItem("experience", id)}
      removeSrOnlyLabel={`Remove ${experience.company} from your resume`}
    >
      <div className="grid items-end gap-2">
        <TextInput
          label="Company Name"
          placeholder="Enter your company name"
          value={experience.company}
          setValue={(company) => setExperience({ company })}
        />

        <div className="grid grid-cols-2 gap-2">
          <TextInput
            label="Job Title"
            placeholder="Enter your job title"
            value={experience.role}
            setValue={(role) => setExperience({ role })}
            className="col-span-2 sm:col-span-1"
          />

          <TextInput
            label="Location"
            placeholder="Enter the job location"
            value={experience.location}
            setValue={(location) => setExperience({ location })}
            className="col-span-2 sm:col-span-1"
          />
        </div>

        <div className="grid grid-cols-2 items-end gap-2">
          <MonthInput
            label="Joining Date"
            value={dates.start}
            onChange={(start) => setDates({ start })}
            className="col-span-2 sm:col-span-1"
          />

          <MonthInput
            label="Leaving Date"
            value={dates.end}
            onChange={(end) => setDates({ end })}
            disabled={dates.present}
            className="col-span-2 sm:col-span-1"
          />
        </div>

        <Label className="flex items-center gap-2">
          <Checkbox
            checked={dates.present}
            onCheckedChange={(present) => setDates({ present })}
          />
          I currently work here
        </Label>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Work Responsibilities</Label>
            <ul className="space-y-2">
              <DNDContexts
                items={bullets}
                setItems={(from, to) => setBullets(move(bullets, from, to))}
              >
                {bullets.map((bullet) => (
                  <WorkResponsibilityEditor
                    key={bullet.id}
                    bullet={bullet}
                    onChange={(text) =>
                      setBullets(
                        bullets.map((b) =>
                          b.id === bullet.id ? { ...b, text } : b,
                        ),
                      )
                    }
                    onRemove={() =>
                      setBullets(bullets.filter((b) => b.id !== bullet.id))
                    }
                  />
                ))}
              </DNDContexts>
            </ul>
          </div>

          <Button
            type="button"
            variant="accent"
            onClick={() =>
              setBullets([...bullets, { id: crypto.randomUUID(), text: "" }])
            }
          >
            Add Work Responsibility
          </Button>
        </div>
      </div>
    </DraggableItemWrapper>
  );
};

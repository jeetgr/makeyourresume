"use client";

import Link from "next/link";

import {
  usePersonalProfile,
  PERSONAL_PROFILE_SECTION,
} from "./_components/personal-profiles";

import { useTemplateIdParam } from "@/hooks/useTemplateIdParam";

import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/form/section-heading";
import SkipButton from "@/components/form/skip-button";
import NextButton from "@/components/form/next-button";
import { PersonalProfiles } from "./_components/personal-profiles";

const PersonalProfilePage = () => {
  const templateId = useTemplateIdParam();
  const isEmpty = (usePersonalProfile()?.items.length ?? 0) === 0;

  return (
    <div className="space-y-2 rounded border p-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          nativeButton={false}
          render={
            <Link href={`/templates/${templateId}/editor/work-experiences`} />
          }
        >
          Previous (Work Experiences)
        </Button>

        <div className="ml-auto flex flex-wrap justify-end gap-2">
          <SkipButton
            sectionName={PERSONAL_PROFILE_SECTION}
            href={`/templates/${templateId}/resume`}
          />

          <NextButton
            label="Download Resume"
            href={`/templates/${templateId}/resume`}
            isEmpty={isEmpty}
            sectionName={PERSONAL_PROFILE_SECTION}
          />
        </div>
      </div>

      <SectionHeading>Personal Profile</SectionHeading>

      <p className="text-sm">
        <span className="font-bold">Note:</span> Empty field will also be added
        to your resume. So remove the fields you don&apos;t want to show by
        clicking on the trash icon.
      </p>

      <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
        <p className="text-sm font-bold text-accent">
          Add your Personal Profile.
        </p>

        <PersonalProfiles />
      </form>
    </div>
  );
};

export default PersonalProfilePage;

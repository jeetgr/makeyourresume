"use client";

import Link from "next/link";

import { useList } from "@/stores/resume-store";

import { useTemplateIdParam } from "@/hooks/useTemplateIdParam";

import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/form/section-heading";
import SkipButton from "@/components/form/skip-button";
import NextButton from "@/components/form/next-button";
import { Projects } from "./_components/projects";

const ProjectsPage = () => {
  const templateId = useTemplateIdParam();
  const isEmpty = useList("projects").length === 0;

  return (
    <div className="space-y-2 rounded border p-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          nativeButton={false}
          render={<Link href={`/templates/${templateId}/editor/educations`} />}
        >
          Previous (Educations)
        </Button>

        <div className="ml-auto flex flex-wrap justify-end gap-2">
          <SkipButton
            sectionName="projects"
            href={`/templates/${templateId}/editor/work-experiences`}
          />

          <NextButton
            label="Next (Work Experiences)"
            href={`/templates/${templateId}/editor/work-experiences`}
            isEmpty={isEmpty}
            sectionName="projects"
          />
        </div>
      </div>

      <SectionHeading>Projects</SectionHeading>

      <p className="text-sm">
        <span className="font-bold">Note:</span> Empty field will also be added
        to your resume. So remove the fields you don&apos;t want to show by
        clicking on the trash icon.
      </p>

      <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
        <p className="text-sm font-bold text-accent">Add your Projects.</p>

        <Projects />
      </form>
    </div>
  );
};

export default ProjectsPage;

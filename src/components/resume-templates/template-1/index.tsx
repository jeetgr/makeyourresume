"use client";

import { Inter } from "next/font/google";

import type { Density } from "@/lib/resume/theme";

import TemplateWrapper from "@/components/resume-templates/components/template-wrapper";
import {
  TemplateProvider,
  type TemplateProps,
} from "@/components/resume-templates/components/template-context";
import ImageSection from "./sections/image-section";
import ContactAndSocialSection from "./sections/contacts-and-socials-section";
import SkillsSection from "./sections/skills-section";
import InterestsSection from "./sections/interests-section";
import AboutSection from "./sections/about-section";
import ExperienceSection from "./sections/experience-section";
import ProjectsSection from "./sections/projects-section";
import EducationSection from "./sections/education-section";
import CustomSectionById from "./sections/custom-sections";
import LanguagesSection from "./sections/languages-section";
import {
  AwardsSection,
  CertificationsSection,
} from "./sections/dated-list-section";

const inter = Inter({ subsets: ["latin"] });

const densityScale: Record<Density, number> = {
  compact: 0.7,
  normal: 1,
  relaxed: 1.4,
};

const leftSections: Partial<Record<string, React.ComponentType>> = {
  skills: SkillsSection,
  languages: LanguagesSection,
  interests: InterestsSection,
};

const rightSections: Partial<Record<string, React.ComponentType>> = {
  experience: ExperienceSection,
  projects: ProjectsSection,
  education: EducationSection,
  certifications: CertificationsSection,
  awards: AwardsSection,
};

/** Sections of one column in `layout.order`; custom sections go right. */
function OrderedSections({
  order,
  sections,
  custom = false,
}: {
  order: string[];
  sections: Partial<Record<string, React.ComponentType>>;
  custom?: boolean;
}) {
  return order.map((key) => {
    if (custom && key.startsWith("custom:")) {
      return <CustomSectionById key={key} id={key.slice(7)} />;
    }
    const Section = sections[key];
    return Section ? <Section key={key} /> : null;
  });
}

export default function Template1({ data, theme, ref }: TemplateProps) {
  const scale = densityScale[theme.density];

  return (
    <section className={`${inter.className} shadow-2xl`}>
      <TemplateProvider value={{ data, theme }}>
        <TemplateWrapper>
          <div
            ref={ref}
            className="[--WIDTHPERCENTAGE:calc(var(--WIDTH)/595.27584)] print:[--WIDTHPERCENTAGE:1pt]!"
          >
            <div className="flex aspect-[595.28/841.89] w-full gap-[calc(var(--WIDTHPERCENTAGE)*12)] bg-white py-[calc(var(--WIDTHPERCENTAGE)*21)] pl-[calc(var(--WIDTHPERCENTAGE)*15)] text-black">
              {/* LEFT COLUMN */}
              <div className="w-[calc(var(--WIDTHPERCENTAGE)*122)] space-y-[calc(var(--WIDTHPERCENTAGE)*15)]">
                <ImageSection />

                <div
                  className="grid"
                  style={{ gap: `calc(var(--WIDTHPERCENTAGE)*${15 * scale})` }}
                >
                  <ContactAndSocialSection />
                  <OrderedSections
                    order={data.layout.order}
                    sections={leftSections}
                  />
                </div>
              </div>
              {/* RIGHT COLUMN */}
              <div className="flex-1 space-y-[calc(var(--WIDTHPERCENTAGE)*15)]">
                <AboutSection />

                <div
                  className="grid"
                  style={{ gap: `calc(var(--WIDTHPERCENTAGE)*${17 * scale})` }}
                >
                  <OrderedSections
                    order={data.layout.order}
                    sections={rightSections}
                    custom
                  />
                </div>
              </div>
            </div>
          </div>
        </TemplateWrapper>
      </TemplateProvider>
    </section>
  );
}

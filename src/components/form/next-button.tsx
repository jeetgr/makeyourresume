import Link from "next/link";

import { useIsSectionHidden } from "@/stores/resume-store";

import { Button } from "../ui/button";
import SkipButton from "./skip-button";

type NextButtonProps = {
  label: string;
  /** `SectionKey` or `custom:${id}`. */
  sectionName: string;
  isEmpty: boolean;
  href: string;
};

export default function NextButton({
  label,
  sectionName,
  isEmpty,
  href,
}: NextButtonProps) {
  const isSkipped = useIsSectionHidden(sectionName);

  if (isEmpty && !isSkipped) {
    return (
      <SkipButton
        sectionName={sectionName}
        href={href}
        buttonLabel={label}
        buttonVariant="default"
      />
    );
  }

  return (
    <Button nativeButton={false} render={<Link href={href} />}>
      {label}
    </Button>
  );
}

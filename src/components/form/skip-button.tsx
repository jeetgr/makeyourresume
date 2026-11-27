import Link from "next/link";

import { toggleSection, useIsSectionHidden } from "@/stores/resume-store";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

type SkipButtonProps = {
  /** `SectionKey` or `custom:${id}`. */
  sectionName: string;
  href: string;
  buttonLabel?: string;
  buttonVariant?: "default" | "secondary" | "outline" | "accent";
};

export default function SkipButton({
  sectionName,
  href,
  buttonLabel = "Skip",
  buttonVariant = "outline",
}: SkipButtonProps) {
  const isSkipped = useIsSectionHidden(sectionName);

  const handleToggleSkippedSection = (value: boolean) =>
    toggleSection(sectionName, value);

  if (isSkipped) {
    return (
      <Button
        variant={buttonVariant}
        onClick={() => handleToggleSkippedSection(false)}
      >
        Add
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant={buttonVariant} />}>
        {buttonLabel}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          You have not added any data to this field. Are you sure you want to
          skip this field?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            nativeButton={false}
            render={
              <Link
                href={href}
                onClick={() => handleToggleSkippedSection(true)}
              />
            }
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

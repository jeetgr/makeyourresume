import Link from "next/link";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import {
  selectSkippedSection,
  toggleSkippedSection,
  type Section,
} from "@/redux/features/skipped-sections/skippedSectionSlice";

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
  sectionName: Section;
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
  const isSkipped = useAppSelector((state) =>
    selectSkippedSection(state, sectionName),
  );

  const dispatch = useAppDispatch();

  const handleToggleSkippedSection = (value: boolean) => {
    dispatch(toggleSkippedSection({ section: sectionName, value }));
  };

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

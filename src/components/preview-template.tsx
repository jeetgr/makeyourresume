import { Eye } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";

interface PreviewTemplateProps {
  className?: string;
  templateComponent: React.ReactNode;
}

export default function PreviewTemplate({
  className,
  templateComponent,
}: PreviewTemplateProps) {
  return (
    <Sheet>
      <SheetTrigger render={<Button className={className} variant="accent" />}>
        <Eye size="18" /> <span>Preview</span>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-xl">Your Resume</SheetTitle>
        </SheetHeader>
        <div className="overflow-hidden rounded border">
          {templateComponent}
        </div>
      </SheetContent>
    </Sheet>
  );
}

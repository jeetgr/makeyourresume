import Dropzone from "react-dropzone";
import { toast } from "sonner";

import { cn } from "@/utils/cn";
import { resizeImageToDataUrl } from "@/utils/resize-image";

import { setProfile, useProfile } from "@/stores/resume-store";

import { Label } from "../ui/label";
import { Button } from "../ui/button";

export default function ImageInput({ className }: { className?: string }) {
  const image = useProfile().photo;

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor="profile-image">Upload your profile picture</Label>
      <div className="flex items-end gap-4">
        <Dropzone
          accept={{
            "image/*": [".jpeg", ".png", ".jpg", ".webp"],
          }}
          multiple={false}
          onDrop={async (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (!file) return;

            try {
              setProfile({ photo: await resizeImageToDataUrl(file) });
            } catch {
              toast.error("Couldn't read that image. Try another file.");
            }
          }}
        >
          {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
            <div
              {...getRootProps()}
              className={cn(
                "h-28 w-28 cursor-pointer overflow-hidden rounded border-2 border-dashed border-primary/70 text-center text-xs",
                isDragActive && "bg-primary/10",
              )}
            >
              <input {...getInputProps()} id="profile-image" />
              {image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  className="h-full w-full object-cover object-center"
                  alt=""
                />
              )}

              <div className="flex h-full w-full items-center justify-center px-4">
                {!image &&
                  (isDragActive && !isDragReject ? (
                    <p>Drop the image here ...</p>
                  ) : (
                    <p>
                      Drag &#39;n&#39; drop image here, or click to select
                      image.
                    </p>
                  ))}
              </div>
            </div>
          )}
        </Dropzone>

        {image && (
          <div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setProfile({ photo: "" })}
            >
              Remove Image
            </Button>
            <p className="text-sm font-medium text-destructive">
              If you click the above button image will be removed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

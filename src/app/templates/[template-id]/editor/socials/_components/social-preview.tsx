import type { ListItem } from "@/lib/resume/schema";

type SocialPreviewProps = Pick<ListItem<"links">, "network" | "url">;

export const SocialPreview = ({ network, url }: SocialPreviewProps) => {
  return (
    <div className="flex min-h-full items-center gap-2 text-sm font-medium text-accent">
      <p className="capitalize">{network}</p>
      {url && <span>|</span>}
      <p className="break-all">{url}</p>
    </div>
  );
};

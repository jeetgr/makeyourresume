type PersonalProfilePreviewProps = { title: string; description: string };

export const PersonalProfilePreview = ({
  title,
  description,
}: PersonalProfilePreviewProps) => {
  return (
    <div className="flex min-h-full items-center gap-2 text-sm font-medium text-accent">
      <p>{title}</p>
      {description && <span>|</span>}
      <p>{description}</p>
    </div>
  );
};

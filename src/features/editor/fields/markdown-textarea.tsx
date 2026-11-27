import { Textarea } from "@/components/ui/textarea";

type MarkdownTextareaProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
};

export function MarkdownTextarea({
  id,
  value,
  onChange,
  rows = 4,
  placeholder,
}: MarkdownTextareaProps) {
  return (
    <div className="space-y-1">
      <Textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        aria-describedby={`${id}-hint`}
        onChange={(e) => onChange(e.target.value)}
      />
      <p id={`${id}-hint`} className="text-xs text-muted-foreground">
        Supports <code>**bold**</code>, <code>*italic*</code>,{" "}
        <code>[link](url)</code>
      </p>
    </div>
  );
}

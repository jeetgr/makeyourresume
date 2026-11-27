import { PageHeading } from "./page-heading";

export const CONTACT_EMAIL = "support@jeetgr.dev";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-2xl pt-28 pb-20">
      <PageHeading eyebrow={`Last updated · ${updated}`} title={title} />
      <div className="mt-10 border-t pt-2 text-[0.95rem] leading-relaxed text-foreground/85 [&_a]:text-link [&_a]:underline-offset-2 [&_a]:hover:underline [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:tracking-tight [&_h2]:text-foreground [&_li]:mt-1.5 [&_li]:marker:text-muted-foreground [&_p]:mt-3 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
        {children}
      </div>
    </article>
  );
}

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
    <article className="mx-auto max-w-3xl py-20 text-[0.95rem] leading-relaxed text-foreground/85 [&_a]:text-link [&_a]:hover:underline [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-secondary [&_li]:mt-1.5 [&_p]:mt-3 [&_strong]:text-foreground [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
      <h1 className="font-display text-4xl tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground">Last updated: {updated}</p>
      {children}
    </article>
  );
}

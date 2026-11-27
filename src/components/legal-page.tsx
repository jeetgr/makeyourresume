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
    <article className="mx-auto max-w-3xl py-20 text-[0.95rem] leading-relaxed text-neutral-700 [&_a]:text-blue-600 [&_a]:hover:underline [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-secondary [&_li]:mt-1.5 [&_p]:mt-3 [&_strong]:text-neutral-900 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
      <h1 className="text-3xl font-bold text-accent">{title}</h1>
      <p className="text-sm text-muted-foreground">Last updated: {updated}</p>
      {children}
    </article>
  );
}

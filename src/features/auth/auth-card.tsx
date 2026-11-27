export function AuthCard({
  title,
  description,
  footer,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-100 space-y-8 motion-safe:animate-blur-fade">
      <header className="space-y-2 text-center">
        <h1 className="font-display text-4xl tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </header>
      {children && <div className="space-y-6">{children}</div>}
      {footer && (
        <footer className="text-center text-sm text-muted-foreground">
          {footer}
        </footer>
      )}
    </section>
  );
}

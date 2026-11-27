import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-310 flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Make Your Resume</p>
        <nav className="flex gap-4">
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}

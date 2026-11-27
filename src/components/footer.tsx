import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

import { LogoMark } from "./logo-mark";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/templates", label: "Templates" },
      { href: "/resumes/local", label: "Editor" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Login" },
      { href: "/register", label: "Register" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-card/50">
      <div className="mx-auto grid max-w-310 grid-cols-3 gap-10 px-4 py-12 sm:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="col-span-3 space-y-3 sm:col-span-1">
          <Link
            href="/"
            className="flex w-fit items-center gap-2 font-medium tracking-tight"
          >
            <LogoMark className="size-7" />
            <span>
              make<b className="font-bold">your</b>resume
            </span>
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">
            Free resume builder with a live PDF preview. No watermark, no
            sign-up to start.
          </p>
        </div>

        {columns.map(({ title, links }) => (
          <nav key={title} aria-label={title} className="space-y-3 text-sm">
            <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              {title}
            </p>
            <ul className="space-y-2">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-foreground/80 hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto max-w-310 border-t px-4 py-5 text-xs text-muted-foreground">
        © {new Date().getFullYear()} {SITE_NAME}
      </div>
    </footer>
  );
}

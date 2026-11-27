"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  House,
  LayoutTemplate,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/utils/cn";

import { LogoMark } from "./logo-mark";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { signOut, UserMenu } from "./user-menu";

const navLinks = [
  { href: "/", label: "Home", icon: House },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
];

const accountLinks = [
  { href: "/resumes", label: "My resumes", icon: FileText },
  { href: "/profile", label: "Profile", icon: UserRound },
];

const menuRow =
  "flex items-center gap-3 rounded-xl px-2.5 py-2 text-[0.95rem] font-medium transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none";

export default function Header() {
  const path = usePathname();

  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const scrolled = useScrolled();

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <div
        className={cn(
          "mx-auto flex max-w-310 items-center justify-between rounded-full border bg-background/70 py-1 pr-2 pl-3 backdrop-blur-md transition-[max-width,box-shadow,background-color] duration-300 ease-out",
          scrolled &&
            "max-w-3xl bg-background/85 shadow-lg shadow-foreground/5",
        )}
      >
        <Link
          href="/"
          aria-label="Make Your Resume home"
          className="flex items-center gap-2 rounded-full py-1.5 pr-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden"
        >
          <LogoMark className="size-7" />

          <span className="text-base leading-tight font-medium tracking-tight">
            <span className="sm:hidden">MYR</span>
            <span className="hidden sm:inline">
              make<b className="font-bold">your</b>resume
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden gap-5 pr-1 md:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                href={href}
                key={href}
                className={cn(
                  "relative text-[0.93rem] font-medium text-muted-foreground hover:text-foreground",
                  {
                    "text-foreground": path === href,
                  },
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {isPending ? (
            <div className="size-8" />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <LoginAndSignUp />
          )}

          <MobileMenu
            path={path}
            user={!!user}
            pending={isPending}
            onSignOut={() => signOut(router)}
          />
        </div>
      </div>
    </header>
  );
}

/** Past the first few pixels of scroll; header shrinks into a pill. */
function useScrolled(offset = 24) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return scrolled;
}

function LoginAndSignUp() {
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        className="hidden rounded-full md:inline-flex"
        nativeButton={false}
        render={<Link href="/register" />}
      >
        Register
      </Button>
      <Button
        className="rounded-full px-4"
        nativeButton={false}
        render={<Link href="/login" />}
      >
        Login
      </Button>
    </div>
  );
}

/** Phone nav: compact card under the pill (few links, so no full-height sheet). */
function MobileMenu({
  path,
  user,
  pending,
  onSignOut,
}: {
  path: string;
  user: boolean;
  pending: boolean;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const links = user ? [...navLinks, ...accountLinks] : navLinks;
  const close = () => setOpen(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={open ? "Close menu" : "Menu"}
        className="grid size-9 place-items-center rounded-full hover:bg-muted md:hidden"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={14}
        alignOffset={-9}
        className="w-[calc(100vw-1.5rem)] max-w-sm gap-1 rounded-2xl p-2 shadow-xl md:hidden"
      >
        <nav className="grid gap-0.5">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              aria-current={path === href ? "page" : undefined}
              className={cn(menuRow, path === href && "bg-muted")}
            >
              <span className="grid size-8 place-items-center rounded-lg border bg-background">
                <Icon className="size-4" />
              </span>
              {label}
              {path === href && (
                <span
                  aria-hidden
                  className="ml-auto size-1.5 rounded-full bg-highlight"
                />
              )}
            </Link>
          ))}
        </nav>

        {!pending && (
          <div className="mt-1 border-t px-0.5 pt-2">
            {user ? (
              <button
                type="button"
                onClick={() => {
                  close();
                  onSignOut();
                }}
                className={cn(menuRow, "w-full text-muted-foreground")}
              >
                <span className="grid size-8 place-items-center">
                  <LogOut className="size-4" />
                </span>
                Log out
              </button>
            ) : (
              <Button
                variant="outline"
                className="w-full rounded-xl"
                nativeButton={false}
                render={<Link href="/register" onClick={close} />}
              >
                Create an account
              </Button>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/utils/cn";

import { LogoMark } from "./logo-mark";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./ui/sheet";
import { signOut, UserMenu } from "./user-menu";

const navLinks = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/templates",
    label: "Templates",
  },
];

const accountLinks = [
  { href: "/resumes", label: "My resumes" },
  { href: "/profile", label: "Profile" },
];

const mobileLink =
  "text-[0.93rem] font-medium text-muted-foreground hover:text-foreground";

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

          {/* Hamburger Menu */}
          <Sheet>
            <SheetTrigger
              aria-label="Menu"
              className="grid size-9 place-items-center rounded-full hover:bg-muted md:hidden"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent>
              <nav className="grid gap-4 py-10 pl-4">
                {navLinks.map(({ href, label }) => (
                  <SheetClose
                    key={href}
                    nativeButton={false}
                    render={
                      <Link
                        href={href}
                        className={cn(
                          "relative text-[0.93rem] font-medium text-muted-foreground hover:text-foreground",
                          {
                            "text-foreground": path === href,
                          },
                        )}
                      />
                    }
                  >
                    {label}
                  </SheetClose>
                ))}

                {user ? (
                  <>
                    {accountLinks.map(({ href, label }) => (
                      <SheetClose
                        key={href}
                        nativeButton={false}
                        render={<Link href={href} className={mobileLink} />}
                      >
                        {label}
                      </SheetClose>
                    ))}
                    <SheetClose
                      className={cn(mobileLink, "text-left")}
                      onClick={() => signOut(router)}
                    >
                      Log out
                    </SheetClose>
                  </>
                ) : (
                  !isPending && (
                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href="/register"
                          className="text-[0.93rem] font-medium text-foreground/80 hover:text-foreground"
                        />
                      }
                    >
                      Register
                    </SheetClose>
                  )
                )}
              </nav>
            </SheetContent>
          </Sheet>
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

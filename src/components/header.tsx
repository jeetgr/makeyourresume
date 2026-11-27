"use client";

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

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b bg-background/30 backdrop-blur-sm">
      <div className="mx-auto flex max-w-310 items-center justify-between px-4 py-2 pr-6">
        <Link
          href="/"
          aria-label="Make Your Resume home"
          className="flex items-center gap-2 py-1.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden"
        >
          <LogoMark className="size-8" />

          <span className="text-lg leading-tight font-medium tracking-tight">
            <span className="sm:hidden">MYR</span>
            <span className="hidden sm:inline">
              make<b className="font-bold">your</b>resume
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden gap-4 md:flex">
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
            <SheetTrigger className="md:hidden">
              <Menu size={28} />
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

function LoginAndSignUp() {
  return (
    <div className="space-x-5">
      <Button
        variant="outline"
        className="hidden md:inline-flex"
        nativeButton={false}
        render={<Link href="/register" />}
      >
        Register
      </Button>
      <Button nativeButton={false} render={<Link href="/login" />}>
        Login
      </Button>
    </div>
  );
}

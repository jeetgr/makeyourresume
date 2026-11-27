"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/utils/cn";

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
  "text-[0.93rem] font-medium text-neutral-400 hover:text-secondary";

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
          className="-ml-1 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-hidden"
        >
          <svg
            width="50"
            height="50"
            viewBox="0 0 70 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24.0212 13.6247C29.6649 6.62089 40.3351 6.62089 45.9788 13.6247V13.6247C47.5462 15.5699 49.6022 17.0636 51.9365 17.9532V17.9532C60.3415 21.1564 63.6388 31.3044 58.7217 38.8361V38.8361C57.3561 40.9279 56.5708 43.3449 56.4461 45.8398V45.8398C55.997 54.8233 47.3646 61.0951 38.6821 58.7461V58.7461C36.2707 58.0938 33.7293 58.0938 31.3179 58.7461V58.7461C22.6354 61.0951 14.003 54.8233 13.5539 45.8398V45.8398C13.4292 43.3449 12.6439 40.9279 11.2783 38.8361V38.8361C6.36123 31.3044 9.6585 21.1564 18.0635 17.9532V17.9532C20.3978 17.0636 22.4538 15.5699 24.0212 13.6247V13.6247Z"
              fill="#FFB400"
            />
            <path
              d="M35 32.2778C38.0069 32.2778 40.4444 29.8402 40.4444 26.8333C40.4444 23.8264 38.0069 21.3889 35 21.3889C31.9931 21.3889 29.5555 23.8264 29.5555 26.8333C29.5555 29.8402 31.9931 32.2778 35 32.2778Z"
              fill="#FFF8E6"
            />
            <path
              d="M46.2778 41.125C46.2778 44.5078 46.2778 47.25 35.3889 47.25C24.5 47.25 24.5 44.5078 24.5 41.125C24.5 37.7422 29.3751 35 35.3889 35C41.4027 35 46.2778 37.7422 46.2778 41.125Z"
              fill="#FEE6AD"
            />
          </svg>

          <span className="inline-block text-lg leading-tight font-bold text-accent uppercase">
            Make Your Resume
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden gap-4 md:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                href={href}
                key={href}
                className={cn(
                  "relative text-[0.93rem] font-medium text-neutral-400 hover:text-secondary",
                  {
                    "text-secondary": path === href,
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
                          "relative text-[0.93rem] font-medium text-neutral-400 hover:text-secondary",
                          {
                            "text-secondary": path === href,
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
                          className="text-[0.93rem] font-medium text-accent/80 hover:text-accent"
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

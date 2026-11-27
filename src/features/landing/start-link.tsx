"use client";

import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

/** Signed in → dashboard; guest → local editor. */
export function StartLink({
  children = "Start building",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "render" | "nativeButton">) {
  const { data: session } = authClient.useSession();

  return (
    <Button
      size="xl"
      {...props}
      nativeButton={false}
      render={<Link href={session ? "/resumes" : "/resumes/local"} />}
    >
      {children}
    </Button>
  );
}

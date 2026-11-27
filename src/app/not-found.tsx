import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/logo-mark";
import { StartLink } from "@/features/landing/start-link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center gap-6 py-24 text-center">
      <LogoMark className="size-16" />
      <div className="space-y-3">
        <p
          aria-hidden
          className="font-display text-[7rem] leading-none tracking-tight text-muted-dark"
        >
          404
        </p>
        <h1 className="font-display text-4xl tracking-tight">Page not found</h1>
        <p className="text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or was moved.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg" nativeButton={false} render={<Link href="/" />}>
          Go home
        </Button>
        <StartLink size="lg" variant="outline" />
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/logo-mark";
import { StartLink } from "@/features/landing/start-link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center gap-6 py-24 text-center">
      <div aria-hidden className="absolute inset-0 -z-10 bg-dot-grid" />
      <LogoMark animated className="size-16" />
      <div className="space-y-3">
        <p
          aria-hidden
          className="font-display text-[7rem] leading-none tracking-tight text-muted-dark"
        >
          404
          <span className="ml-1 inline-block h-[0.8em] w-1.5 translate-y-1 bg-highlight motion-safe:animate-caret" />
        </p>
        <h1
          className="font-display text-4xl tracking-tight motion-safe:animate-blur-fade"
          style={{ animationDelay: "150ms" }}
        >
          Page not found
        </h1>
        <p
          className="text-muted-foreground motion-safe:animate-blur-fade"
          style={{ animationDelay: "300ms" }}
        >
          This page doesn&apos;t exist or has moved.
        </p>
      </div>
      <div
        className="flex flex-wrap justify-center gap-3 motion-safe:animate-blur-fade"
        style={{ animationDelay: "450ms" }}
      >
        <Button size="lg" nativeButton={false} render={<Link href="/" />}>
          Go home
        </Button>
        <StartLink size="lg" variant="outline" />
      </div>
    </section>
  );
}

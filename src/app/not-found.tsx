import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-svh w-full flex-col items-center justify-center">
      <Image
        src="/illustrations/404.svg"
        width={500}
        height={500}
        alt=""
        className="h-auto w-full max-w-xl"
      />

      <a href="https://storyset.com/online" target="_blank">
        Online illustrations by{" "}
        <span className="font-bold text-accent">Storyset</span>
      </a>

      <div className="mt-4">
        <Button nativeButton={false} render={<Link href="/" />}>
          Go to Homepage
        </Button>
      </div>
    </section>
  );
}

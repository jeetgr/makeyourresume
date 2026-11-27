import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="flex min-h-svh flex-col gap-8 py-20 sm:flex-row sm:items-center">
      <div className="flex-1 space-y-6">
        <h1 className="text-5xl leading-[1.1] font-bold text-accent">
          Build Your Resume for&nbsp;<span className="text-primary">Free!</span>
        </h1>
        <p className="text-base font-medium tracking-wide">
          Elevate your professional presence with our user-friendly &quot;Resume
          Builder&quot;. Craft a polished, standout document that effectively
          showcases your skills. Start building your impactful resume now!
        </p>

        <Button
          size="xl"
          className="mx-auto w-fit md:text-base"
          nativeButton={false}
          render={<Link href="/templates" />}
        >
          Build Your Resume
        </Button>
      </div>
      <div className="flex-1">
        <Image
          src="/illustrations/hero.svg"
          width={614}
          height={491}
          alt=""
          priority
          className="h-auto w-full"
        />
      </div>
    </section>
  );
}

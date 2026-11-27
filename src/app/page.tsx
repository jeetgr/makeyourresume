import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Eye,
  FileJson,
  Files,
  Palette,
  ScanText,
} from "lucide-react";

import { SITE_DESCRIPTION } from "@/lib/site";
import { templateCatalog } from "@/templates/catalog";
import { cn } from "@/utils/cn";

import { Button } from "@/components/ui/button";
import { TemplateThumbnail } from "@/components/template-thumbnail";
import { StartLink } from "@/features/landing/start-link";
import { TemplateLink } from "./templates/template-link";

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const features = [
  {
    icon: Eye,
    title: "Live PDF preview",
    text: "See the exact PDF you'll download, updated as you type.",
  },
  {
    icon: ScanText,
    title: "ATS-friendly",
    text: "Real, selectable text in a clean reading order that parsers understand.",
  },
  {
    icon: Palette,
    title: "Templates & theming",
    text: "Five templates. Tune the font, accent color, size and spacing.",
  },
  {
    icon: Files,
    title: "Multiple resumes",
    text: "Sign in to keep a resume per role, saved and synced.",
  },
  {
    icon: FileJson,
    title: "Import & export",
    text: "Your data stays portable: own JSON or the JSON Resume standard.",
  },
  {
    icon: BadgeCheck,
    title: "Free, no watermark",
    text: "No paywall on downloads. No account needed to start.",
  },
];

const steps = [
  { title: "Pick a template", text: "Start from any look; switch anytime." },
  {
    title: "Fill in your sections",
    text: "Experience, skills, projects, and your own custom sections.",
  },
  { title: "Download the PDF", text: "One click, ready to send." },
];

const faqs = [
  {
    q: "Is it really free?",
    a: "Yes. Every template, theme option and PDF download is free, with no watermark.",
  },
  {
    q: "Do I need an account?",
    a: "No. Start right away and your resume is kept in this browser. Create an account to save several resumes and open them on any device.",
  },
  {
    q: "Where is my data stored?",
    a: (
      <>
        As a guest, only in your browser. With an account, in our database so
        you can access it anywhere. See the{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          privacy policy
        </Link>
        .
      </>
    ),
  },
  {
    q: "Will applicant tracking systems read it?",
    a: "The PDFs contain real text in a logical order, with standard section headings. Classic is the safest choice for strict systems.",
  },
  {
    q: "Can I move my resume elsewhere?",
    a: "Export it as JSON (lossless, re-importable) or as JSON Resume to use with other tools. You can import both too.",
  },
];

const hero = ["sidebar", "modern", "classic"];

export default function Home() {
  return (
    <div className="space-y-24 pt-28 pb-24 sm:space-y-32 sm:pt-36">
      <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
          <p className="w-fit rounded-full border bg-primary/10 px-3 py-1 text-sm font-medium text-accent">
            Free · No sign-up required
          </p>
          <h1 className="text-5xl leading-[1.05] font-bold tracking-tight text-balance text-accent">
            Make a resume that{" "}
            <span className="underline decoration-primary decoration-[0.12em] underline-offset-[0.12em]">
              gets read
            </span>
            .
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            ATS-friendly templates, a live PDF preview and export anytime. Start
            in seconds, right in your browser.
          </p>
          <div className="flex flex-wrap gap-3">
            <StartLink>
              Start building <ArrowRight />
            </StartLink>
            <Button
              size="xl"
              variant="outline"
              nativeButton={false}
              render={<Link href="/templates" />}
            >
              Browse templates
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            <Link href="/register" className="underline underline-offset-2">
              Create an account
            </Link>{" "}
            to save multiple resumes.
          </p>
        </div>

        <div
          aria-hidden
          className="relative mx-auto aspect-[5/4] w-full max-w-lg"
        >
          {hero.map((id, i) => (
            <div
              key={id}
              className={cn(
                "absolute top-1/2 left-1/2 w-[46%] overflow-hidden rounded-md border bg-white shadow-xl",
                [
                  "-translate-x-full -translate-y-[47%] -rotate-6",
                  "translate-x-0 -translate-y-[47%] rotate-6",
                  "-translate-x-1/2 -translate-y-1/2 shadow-2xl",
                ][i],
              )}
            >
              <TemplateThumbnail templateId={id} priority={i === 2} />
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="features" className="space-y-10">
        <SectionHeading id="features" eyebrow="Why MYR">
          Everything you need, nothing in the way
        </SectionHeading>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-xl border bg-card p-6">
              <span className="mb-4 grid size-10 place-items-center rounded-lg bg-primary/15 text-accent">
                <Icon className="size-5" />
              </span>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="templates" className="space-y-10">
        <SectionHeading id="templates" eyebrow="Templates">
          Pick a look, change it anytime
        </SectionHeading>
        <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
          {templateCatalog.map(({ id, name }) => (
            <li key={id} className="w-44 shrink-0 snap-start md:w-auto">
              <TemplateLink
                templateId={id}
                className="group block space-y-2 rounded focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <div className="overflow-hidden rounded border shadow-sm transition group-hover:shadow-md motion-safe:group-hover:-translate-y-1">
                  <TemplateThumbnail templateId={id} />
                </div>
                <p className="text-sm font-semibold">{name}</p>
              </TemplateLink>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how" className="space-y-10">
        <SectionHeading id="how" eyebrow="How it works">
          Three steps to a finished PDF
        </SectionHeading>
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map(({ title, text }, i) => (
            <li key={title} className="flex gap-4 rounded-xl border p-6">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent font-bold text-accent-foreground">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="faq" className="mx-auto max-w-3xl space-y-10">
        <SectionHeading id="faq" eyebrow="FAQ">
          Questions, answered
        </SectionHeading>
        <div className="divide-y rounded-xl border">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium [&::-webkit-details-marker]:hidden">
                {q}
                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition group-open:rotate-180" />
              </summary>
              <p className="pb-5 text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-accent px-6 py-14 text-center text-accent-foreground sm:px-12">
        <h2 className="text-3xl font-bold text-balance">
          Your next resume is a few minutes away
        </h2>
        <p className="mt-3 text-accent-foreground/75">
          Free, private by default, and yours to export.
        </p>
        <StartLink className="mt-8">
          Start building <ArrowRight />
        </StartLink>
      </section>
    </div>
  );
}

function SectionHeading({
  id,
  eyebrow,
  children,
}: {
  id: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 text-center">
      <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
        {eyebrow}
      </p>
      <h2 id={id} className="text-3xl font-bold text-balance text-accent">
        {children}
      </h2>
    </div>
  );
}

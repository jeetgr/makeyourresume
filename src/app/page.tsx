import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Eye,
  FileJson,
  FileText,
  Files,
  Palette,
  ScanText,
} from "lucide-react";

import { SITE_DESCRIPTION } from "@/lib/site";
import { templateCatalog } from "@/templates/catalog";
import { cn } from "@/utils/cn";

import { Button } from "@/components/ui/button";
import { ContainerScroll } from "@/components/fx/container-scroll";
import { Marquee } from "@/components/fx/marquee";
import { RotatingWord } from "@/components/fx/rotating-word";
import { SpotlightCard } from "@/components/fx/spotlight-card";
import { TracingBeam } from "@/components/fx/tracing-beam";
import { LogoMark } from "@/components/logo-mark";
import { TemplateThumbnail } from "@/components/template-thumbnail";
import { LiveDemo } from "@/features/landing/live-demo";
import { StartLink } from "@/features/landing/start-link";
import { TemplateLink } from "./templates/template-link";

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const steps = [
  {
    title: "Choose a template",
    text: "You can switch later without retyping.",
  },
  {
    title: "Fill in your sections",
    text: "Experience, education, skills, projects and custom sections.",
  },
  { title: "Download the PDF", text: "A4 or US Letter, with selectable text." },
];

const faqs = [
  {
    q: "Is it free?",
    a: "Yes. All templates, theme options and PDF downloads are free, and the PDF has no watermark.",
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

export default function Home() {
  return (
    <div className="space-y-28 overflow-x-clip pt-28 pb-24 sm:space-y-36 sm:pt-36">
      <section className="relative isolate grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-4 -top-40 -bottom-20 -z-10 bg-dot-grid"
        />
        <div className="space-y-6">
          <p className="w-fit rounded-full border bg-card px-3 py-1 font-mono text-xs tracking-wide text-muted-foreground uppercase">
            Free · No sign-up required
          </p>
          <h1 className="font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl">
            A resume written for <br className="hidden sm:inline" />
            <RotatingWord
              words={["recruiters.", "hiring managers.", "ATS software."]}
              className="mark italic"
            />
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Fill in a form and the PDF updates as you type. Download it when
            it&apos;s ready, no account required.
          </p>
          <div className="flex flex-wrap gap-3">
            <StartLink className="sheen">
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
          <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
            {templateCatalog.length} templates · 6 fonts · No watermark
          </p>
        </div>

        <LiveDemo />
      </section>

      <section aria-labelledby="editor" className="space-y-12">
        <SectionHeading id="editor" eyebrow="The editor">
          Form on the left, PDF on the right
        </SectionHeading>
        <ContainerScroll className="mx-auto max-w-5xl">
          <div className="rounded-2xl border bg-card p-1.5 shadow-2xl shadow-foreground/10 sm:p-2.5">
            <Image
              src="/landing/editor.webp"
              alt="The editor: form sections on the left, live PDF preview on the right"
              width={2560}
              height={1450}
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="h-auto w-full rounded-xl border"
            />
          </div>
        </ContainerScroll>
      </section>

      <section aria-labelledby="features" className="space-y-12">
        <SectionHeading id="features" eyebrow="Features">
          What&apos;s included
        </SectionHeading>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Feature
            icon={Eye}
            title="Live PDF preview"
            text="The preview is the PDF you download, re-rendered as you type."
            className="md:col-span-2"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-40 hidden w-48 rotate-6 overflow-hidden rounded-md border shadow-xl transition-transform duration-500 group-hover/spot:-translate-y-3 sm:right-6 sm:block"
            >
              <TemplateThumbnail templateId="modern" />
            </div>
          </Feature>
          <Feature
            icon={ScanText}
            title="ATS-readable"
            text="Selectable text in a single reading order, with standard section headings."
          >
            <div
              aria-hidden
              className="mt-5 space-y-1 rounded-lg border bg-background p-3 font-mono text-[0.68rem] text-muted-foreground"
            >
              <p className="text-foreground">EXPERIENCE</p>
              <p>
                <span className="bg-link/15 text-foreground">
                  Software Engineer, Acme
                </span>
              </p>
              <p>2022 – Present</p>
            </div>
          </Feature>
          <Feature
            icon={Palette}
            title="Templates & theming"
            text={`${templateCatalog.length} templates. Adjust font, accent color, text size and spacing.`}
          >
            <div aria-hidden className="mt-5 flex items-center gap-1.5">
              {templateCatalog.map(({ id, defaultTheme }) => (
                <span
                  key={id}
                  className="size-6 rounded-full border-2 border-card shadow-sm transition-transform group-hover/spot:scale-110"
                  style={{ backgroundColor: defaultTheme.accent }}
                />
              ))}
              <span className="ml-auto font-display text-2xl">Aa</span>
            </div>
          </Feature>
          <Feature
            icon={FileJson}
            title="Import & export"
            text="Export to JSON or the JSON Resume format, and import either."
            className="md:col-span-2"
          >
            <IoBeam />
          </Feature>
          <Feature
            icon={Files}
            title="Multiple resumes"
            text="With an account, keep a version per role, synced across devices."
          >
            <div aria-hidden className="mt-6 space-y-1.5">
              {["Frontend role", "Design role", "Startup role"].map((r, i) => (
                <div
                  key={r}
                  className="flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-xs transition-transform group-hover/spot:translate-x-1"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <FileText className="size-3.5 text-muted-foreground" />
                  {r}
                </div>
              ))}
            </div>
          </Feature>
          <Feature
            icon={BadgeCheck}
            title="Free, no watermark"
            text="Every template and download is free. No watermark on the PDF."
          >
            <p aria-hidden className="mt-6 font-display text-6xl leading-none">
              <span className="mark">$0</span>
            </p>
          </Feature>
        </ul>
      </section>

      <section aria-labelledby="templates" className="space-y-12">
        <SectionHeading id="templates" eyebrow="Templates">
          Switch layouts without retyping
        </SectionHeading>
        <Marquee className="-mx-4 py-3">
          {templateCatalog.map(({ id, name }) => (
            <li key={id} className="w-44 shrink-0 sm:w-52">
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
        </Marquee>
      </section>

      <section aria-labelledby="how" className="space-y-12">
        <SectionHeading id="how" eyebrow="How it works">
          Three steps
        </SectionHeading>
        <TracingBeam className="mx-auto max-w-xl">
          <ol className="space-y-12">
            {steps.map(({ title, text }, i) => (
              <li key={title} className="flex gap-6">
                <span className="relative grid size-9 shrink-0 place-items-center rounded-full border-2 border-foreground bg-background font-mono text-sm">
                  {i + 1}
                </span>
                <div className="pt-1">
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-1 text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </TracingBeam>
      </section>

      <section aria-labelledby="faq" className="mx-auto max-w-3xl space-y-12">
        <SectionHeading id="faq" eyebrow="FAQ">
          Common questions
        </SectionHeading>
        <div className="divide-y rounded-2xl border bg-card">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group details-animate px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium [&::-webkit-details-marker]:hidden">
                {q}
                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition group-open:rotate-180" />
              </summary>
              <p className="pb-5 text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="border-beam relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-dot-grid opacity-40 [--foreground:var(--primary-foreground)]"
        />
        <div className="relative">
          <h2 className="font-display text-5xl tracking-tight text-balance">
            Start your resume
          </h2>
          <p className="mt-3 text-primary-foreground/75">
            No account needed. Drafts are saved in this browser until you sign
            in.
          </p>
          <StartLink variant="highlight" className="sheen mt-8">
            Start building <ArrowRight />
          </StartLink>
        </div>
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
      <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
        {eyebrow}
      </p>
      <h2 id={id} className="font-display text-4xl tracking-tight text-balance">
        {children}
      </h2>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
  className,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <li className={className}>
      <SpotlightCard className="h-full p-6 md:min-h-56">
        <span className="mb-4 grid size-10 place-items-center rounded-lg bg-highlight/25 text-foreground">
          <Icon className="size-5" />
        </span>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
        {children}
      </SpotlightCard>
    </li>
  );
}

/** JSON in → MYR → PDF / JSON out, joined by flowing dashed lines. */
function IoBeam() {
  const nodes = [
    { icon: <FileJson className="size-5" />, label: "JSON Resume" },
    { icon: <LogoMark className="size-6" />, label: "MYR", main: true },
    { icon: <FileText className="size-5" />, label: "PDF" },
  ];

  return (
    <div aria-hidden className="mt-6 flex items-start">
      {nodes.map(({ icon, label, main }, i) => (
        <div key={label} className="contents">
          {i > 0 && (
            <svg className="mt-5.5 h-1 min-w-6 flex-1 overflow-visible">
              <line
                x1="0"
                y1="2"
                x2="100%"
                y2="2"
                strokeWidth="2"
                strokeDasharray="6 6"
                strokeLinecap="round"
                className="stroke-highlight-dark motion-safe:animate-dash"
              />
            </svg>
          )}
          <div className="flex w-20 flex-col items-center gap-1.5">
            <span
              className={cn(
                "grid size-12 place-items-center rounded-xl border bg-background shadow-sm",
                main && "border-foreground",
              )}
            >
              {icon}
            </span>
            <span className="font-mono text-[0.65rem] tracking-wide text-muted-foreground uppercase">
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

import { redirect } from "next/navigation";

import { templateCatalog } from "@/templates/catalog";
import { getSession } from "@/server/session";

import { Marquee } from "@/components/fx/marquee";
import { LogoMark } from "@/components/logo-mark";
import { TemplateThumbnail } from "@/components/template-thumbnail";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (await getSession()) redirect("/resumes");

  return (
    <div className="grid min-h-svh items-center gap-10 pt-24 pb-12 lg:grid-cols-2">
      <AuthAside />
      {children}
    </div>
  );
}

const columns = [templateCatalog, [...templateCatalog].reverse()];

function AuthAside() {
  return (
    <aside className="relative hidden h-[min(42rem,calc(100svh-9rem))] overflow-hidden rounded-3xl bg-primary text-primary-foreground lg:block">
      <div
        aria-hidden
        className="absolute inset-0 grid -rotate-6 grid-cols-2 gap-6 [mask-image:linear-gradient(to_bottom,#000_30%,transparent_80%)] px-10 opacity-35"
      >
        {columns.map((col, i) => (
          <Marquee
            key={i}
            vertical
            className={i ? "-mt-40 [&>div]:[animation-direction:reverse]" : ""}
          >
            {col.map((t) => (
              <li key={t.id} className="overflow-hidden rounded-lg">
                <TemplateThumbnail templateId={t.id} />
              </li>
            ))}
          </Marquee>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 space-y-4 p-10">
        <LogoMark className="size-10" />
        <p className="font-display text-4xl/tight tracking-tight text-balance">
          Text-based PDFs that{" "}
          <span className="text-highlight italic">
            applicant tracking systems
          </span>{" "}
          can read.
        </p>
        <p className="font-mono text-xs tracking-widest text-primary-foreground/60 uppercase">
          {templateCatalog.length} templates · 6 fonts · JSON Resume import
        </p>
      </div>
    </aside>
  );
}

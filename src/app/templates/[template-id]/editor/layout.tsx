import PreviewTemplate from "@/components/preview-template";
import { LocalTemplate } from "@/components/local-template";

type ResumeFormLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ "template-id": string }>;
};

const ResumeFormLayout = async ({
  children,
  params,
}: ResumeFormLayoutProps) => {
  const { "template-id": templateId } = await params;

  return (
    <section className="relative min-h-svh py-20">
      <h1 className="text-4xl leading-[1.1] font-bold">
        Let<span className="text-primary">&apos;</span>s Start
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 lg:col-span-1">{children}</div>
        <div className="hidden aspect-[595.28/841.89] overflow-hidden rounded border lg:block">
          <LocalTemplate templateId={templateId} />
        </div>
        <PreviewTemplate
          className="fixed right-4 bottom-4 space-x-1 px-4 py-2.5 lg:hidden"
          templateComponent=<LocalTemplate templateId={templateId} />
        />
      </div>
    </section>
  );
};

export default ResumeFormLayout;

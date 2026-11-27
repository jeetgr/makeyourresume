import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AuthCard({
  title,
  description,
  footer,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="py-20">
      <Card className="mx-auto mt-8 max-w-110">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-secondary">
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        {children && (
          <CardContent className="space-y-6">{children}</CardContent>
        )}
        {footer && (
          <CardFooter className="justify-center text-sm">{footer}</CardFooter>
        )}
      </Card>
    </section>
  );
}

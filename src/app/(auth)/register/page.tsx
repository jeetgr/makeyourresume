"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const registerFormSchema = z.object({
  name: z
    .string()
    .min(3, "Name length must be between 3 and 255 characters.")
    .max(255, "Name length must be between 3 and 255 characters."),
  email: z.email("Invalid email!"),
  password: z
    .string("Password is required!")
    .min(8, "Password length must be between 8 and 255 characters.")
    .max(255, "Password length must be between 8 and 255 characters."),
});

export default function RegisterPage() {
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerFormSchema>) => {
    startTransition(async () => {
      try {
        const data = await api("/api/auth/register", {
          body: values,
        });
        toast.success(data.message);

        router.push("/login");
      } catch (error) {
        toast.error((error as Error).message);
      }
    });
  };

  return (
    <section className="py-20">
      <Card className="mx-auto mt-8 max-w-120">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-secondary">
            Register
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      placeholder="john@doe.com"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <PasswordInput
                      id="password"
                      placeholder="********"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button disabled={isLoading} type="submit" className="w-full">
                Register
              </Button>
            </FieldGroup>
          </form>

          <div className="flex items-center gap-2">
            <div className="h-px flex-1 rounded-full bg-primary/60"></div>
            <p>Or</p>
            <div className="h-px flex-1 rounded-full bg-primary/60"></div>
          </div>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

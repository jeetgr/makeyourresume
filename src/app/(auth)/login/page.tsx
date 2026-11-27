"use client";

import { setUser, type User } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
import { api } from "@/lib/api";

const loginFormSchema = z.object({
  email: z.email("Invalid email!"),
  password: z
    .string("Password is required!")
    .min(8, "Password length must be between 8 and 255 characters.")
    .max(255, "Password length must be between 8 and 255 characters."),
});

export default function RegisterPage() {
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginFormSchema>) => {
    startTransition(async () => {
      try {
        const data = await api<{ message: string; user: User }>(
          "/api/auth/login",
          {
            body: values,
          },
        );
        toast.success(data.message);
        router.push("/");
        setUser(data.user);
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
            Login
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
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
                Login
              </Button>
            </FieldGroup>
          </form>

          <div className="flex items-center gap-2">
            <div className="h-px flex-1 rounded-full bg-primary/60"></div>
            <p>Or</p>
            <div className="h-px flex-1 rounded-full bg-primary/60"></div>
          </div>

          <p className="text-center text-sm">
            Don&#39;t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              register here
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

import { FormInput } from "./form-input";
import { GoogleButton } from "./google-button";
import { AFTER_AUTH_URL, emailField, passwordField } from "./schemas";

const schema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(100),
  email: emailField,
  password: passwordField,
});

export function RegisterForm({ google }: { google: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    setPending(true);
    const { error } = await authClient.signUp.email({
      ...values,
      callbackURL: AFTER_AUTH_URL,
    });
    if (error) {
      setPending(false);
      toast.error(error.message ?? "Registration failed");
      return;
    }
    router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormInput
          control={form.control}
          name="name"
          label="Name"
          autoComplete="name"
          placeholder="John Doe"
        />
        <FormInput
          control={form.control}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="john@doe.com"
        />
        <FormInput
          control={form.control}
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
        />
        <Button disabled={pending} type="submit" className="w-full">
          Create account
        </Button>
        {google && <GoogleButton />}
      </FieldGroup>
    </form>
  );
}

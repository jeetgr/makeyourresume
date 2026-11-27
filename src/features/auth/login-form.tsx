"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

import { FormInput } from "./form-input";
import { GoogleButton } from "./google-button";
import { emailField } from "./schemas";

const schema = z.object({
  email: emailField,
  password: z.string().min(1, "Enter your password"),
});

export function LoginForm({ next, google }: { next: string; google: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    setPending(true);
    const { error } = await authClient.signIn.email({
      ...values,
      callbackURL: next,
    });
    if (!error) {
      router.replace(next);
      router.refresh();
      return;
    }
    setPending(false);
    if (error.code === "EMAIL_NOT_VERIFIED") {
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
      toast.info("Verify your email first. We sent you a new link.");
    } else {
      toast.error(error.message ?? "Login failed");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormInput
          control={form.control}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="john@doe.com"
        />
        <div className="space-y-1">
          <FormInput
            control={form.control}
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
          />
          <Link
            href="/forgot-password"
            className="block text-right text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Button disabled={pending} type="submit" className="w-full">
          Login
        </Button>
        {google && <GoogleButton next={next} />}
      </FieldGroup>
    </form>
  );
}

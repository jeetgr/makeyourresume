"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

import { FormInput } from "./form-input";
import { passwordField } from "./schemas";

const schema = z
  .object({ password: passwordField, confirm: z.string() })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Passwords don't match",
  });

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  });

  async function onSubmit({ password }: z.infer<typeof schema>) {
    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    });
    if (error) {
      toast.error(error.message ?? "Reset failed");
      return;
    }
    toast.success("Password updated. Log in with your new password.");
    router.push("/login");
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormInput
          control={form.control}
          name="password"
          label="New password"
          type="password"
          autoComplete="new-password"
        />
        <FormInput
          control={form.control}
          name="confirm"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
        />
        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="w-full"
        >
          Set password
        </Button>
      </FieldGroup>
    </form>
  );
}

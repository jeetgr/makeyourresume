"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { FormInput } from "@/features/auth/form-input";
import { passwordField } from "@/features/auth/schemas";

import { ProfileCard } from "./profile-card";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: passwordField,
    confirm: z.string(),
  })
  .refine((v) => v.newPassword === v.confirm, {
    path: ["confirm"],
    message: "Passwords don't match",
  });

export function PasswordSection({
  hasPassword,
  email,
}: {
  hasPassword: boolean;
  email: string;
}) {
  return (
    <ProfileCard
      title="Password"
      description={
        hasPassword
          ? "Changing it signs you out on other devices."
          : "You sign in with Google. Set a password to also log in with email."
      }
    >
      {hasPassword ? <ChangePasswordForm /> : <SetPassword email={email} />}
    </ProfileCard>
  );
}

function ChangePasswordForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: "", newPassword: "", confirm: "" },
  });

  async function onSubmit({
    currentPassword,
    newPassword,
  }: z.infer<typeof schema>) {
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    if (error) return toast.error(error.message ?? "Couldn't change password");
    toast.success("Password changed");
    form.reset();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormInput
          control={form.control}
          name="currentPassword"
          label="Current password"
          type="password"
          autoComplete="current-password"
        />
        <FormInput
          control={form.control}
          name="newPassword"
          label="New password"
          type="password"
          autoComplete="new-password"
        />
        <FormInput
          control={form.control}
          name="confirm"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
        />
        <Button
          type="submit"
          className="self-start"
          disabled={form.formState.isSubmitting}
        >
          Change password
        </Button>
      </FieldGroup>
    </form>
  );
}

function SetPassword({ email }: { email: string }) {
  const [pending, setPending] = useState(false);

  async function send() {
    setPending(true);
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });
    setPending(false);
    if (error) toast.error(error.message ?? "Couldn't send email");
    else toast.success(`We emailed a link to ${email}`);
  }

  return (
    <Button variant="outline" disabled={pending} onClick={send}>
      Email me a link to set a password
    </Button>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { initials } from "@/components/user-menu";
import { FormInput } from "@/features/auth/form-input";

import { ProfileCard } from "./profile-card";

const schema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(100),
});

export function AccountSection({
  user,
}: {
  user: { name: string; email: string; image?: string | null };
}) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: user.name },
  });

  async function onSubmit({ name }: z.infer<typeof schema>) {
    const { error } = await authClient.updateUser({ name });
    if (error) return toast.error(error.message ?? "Update failed");
    toast.success("Saved");
    form.reset({ name });
    router.refresh();
  }

  return (
    <ProfileCard title="Account">
      <div className="flex flex-col gap-6 sm:flex-row">
        <Avatar className="size-16 text-xl">
          <AvatarImage src={user.image ?? undefined} alt="" />
          <AvatarFallback>{initials(user.name)}</AvatarFallback>
        </Avatar>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
          <FieldGroup>
            <FormInput
              control={form.control}
              name="name"
              label="Name"
              autoComplete="name"
            />
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" value={user.email} disabled />
            </Field>
            <Button
              type="submit"
              className="self-start"
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
            >
              Save
            </Button>
          </FieldGroup>
        </form>
      </div>
    </ProfileCard>
  );
}

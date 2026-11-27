"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";

import { ProfileCard } from "./profile-card";

export function DeleteAccount({ hasPassword }: { hasPassword: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  /** Without a password, Better Auth requires a fresh session (signed in within a day). */
  async function remove() {
    setPending(true);
    const { error } = await authClient.deleteUser(
      hasPassword ? { password } : {},
    );
    setPending(false);
    if (error) return toast.error(error.message ?? "Couldn't delete account");
    toast.success("Account deleted");
    router.push("/");
    router.refresh();
  }

  return (
    <ProfileCard
      title="Delete account"
      description="Permanently deletes your account and all saved resumes."
      className="ring-destructive/30"
    >
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="destructive" />}>
          Delete account
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              All your resumes will be deleted. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {hasPassword && (
            <PasswordInput
              aria-label="Password"
              placeholder="Your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={pending || (hasPassword && !password)}
              onClick={remove}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProfileCard>
  );
}

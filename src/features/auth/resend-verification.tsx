"use client";

import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

import { AFTER_AUTH_URL } from "./schemas";

export function ResendVerification({ email }: { email: string }) {
  const [pending, setPending] = useState(false);

  async function resend() {
    setPending(true);
    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: AFTER_AUTH_URL,
    });
    setPending(false);
    if (error) toast.error(error.message ?? "Couldn't send email");
    else toast.success("Verification email sent");
  }

  return (
    <Button
      variant="outline"
      className="w-full"
      disabled={pending}
      onClick={resend}
    >
      Resend verification email
    </Button>
  );
}

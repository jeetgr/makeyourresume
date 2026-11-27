"use client";

import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { FieldSeparator } from "@/components/ui/field";

import { AFTER_AUTH_URL } from "./schemas";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.2 14.6 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12s4.4 9.8 9.8 9.8c5.7 0 9.4-4 9.4-9.6 0-.6-.1-1.1-.2-1.6H12z"
      />
    </svg>
  );
}

/** "Or" separator + Google sign-in; rendered only when the provider is configured. */
export function GoogleButton({ next = AFTER_AUTH_URL }: { next?: string }) {
  const [pending, setPending] = useState(false);

  async function signIn() {
    setPending(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: next,
      errorCallbackURL: "/login",
    });
    if (error) {
      toast.error(error.message ?? "Google sign-in failed");
      setPending(false);
    }
  }

  return (
    <>
      <FieldSeparator>Or</FieldSeparator>
      <Button
        variant="outline"
        className="w-full"
        disabled={pending}
        onClick={signIn}
      >
        <GoogleIcon />
        Continue with Google
      </Button>
    </>
  );
}

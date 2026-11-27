"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

import { ProfileCard } from "./profile-card";

export function ConnectedAccounts({
  googleAccountId,
  canUnlink,
}: {
  googleAccountId: string | null;
  canUnlink: boolean;
}) {
  const google = googleAccountId !== null;
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function toggle() {
    setPending(true);
    const { error } = google
      ? await authClient.unlinkAccount({ accountId: googleAccountId })
      : await authClient.linkSocial({
          provider: "google",
          callbackURL: "/profile",
        });
    setPending(false);
    if (error) return toast.error(error.message ?? "Something went wrong");
    if (google) router.refresh();
  }

  return (
    <ProfileCard title="Connected accounts">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-medium">Google</p>
          <p className="text-sm text-muted-foreground">
            {google ? "Connected" : "Not connected"}
          </p>
        </div>
        <Button
          variant="outline"
          disabled={pending || (google && !canUnlink)}
          title={
            google && !canUnlink
              ? "Set a password before disconnecting"
              : undefined
          }
          onClick={toggle}
        >
          {google ? "Disconnect" : "Connect"}
        </Button>
      </div>
    </ProfileCard>
  );
}

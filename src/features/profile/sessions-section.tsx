"use client";

import { useRouter } from "next/navigation";
import { Monitor, Smartphone } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

import { ProfileCard } from "./profile-card";

type SessionRow = {
  token: string;
  userAgent: string | null;
  createdAt: string;
};

function describe(ua: string | null) {
  if (!ua) return "Unknown device";
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /Firefox\//.test(ua)
      ? "Firefox"
      : /Chrome\//.test(ua)
        ? "Chrome"
        : /Safari\//.test(ua)
          ? "Safari"
          : "Browser";
  const os = /Windows/.test(ua)
    ? "Windows"
    : /Android/.test(ua)
      ? "Android"
      : /iPhone|iPad/.test(ua)
        ? "iOS"
        : /Mac OS/.test(ua)
          ? "macOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "";
  return [browser, os].filter(Boolean).join(" on ");
}

export function SessionsSection({
  sessions,
  currentToken,
}: {
  sessions: SessionRow[];
  currentToken?: string;
}) {
  const router = useRouter();

  async function revoke(token: string) {
    const { error } = await authClient.revokeSession({ token });
    if (error) return toast.error(error.message ?? "Couldn't sign out session");
    router.refresh();
  }

  return (
    <ProfileCard
      title="Sessions"
      description="Devices signed in to your account."
    >
      <ul className="divide-y">
        {sessions.map((s) => {
          const Icon = /Mobile|Android|iPhone/.test(s.userAgent ?? "")
            ? Smartphone
            : Monitor;
          const current = s.token === currentToken;
          return (
            <li key={s.token} className="flex items-center gap-3 py-3">
              <Icon className="size-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {describe(s.userAgent)}
                  {current && (
                    <span className="ml-2 rounded bg-highlight/40 px-1.5 py-0.5 font-mono text-[0.7rem]">
                      This device
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Signed in {new Date(s.createdAt).toLocaleDateString()}
                </p>
              </div>
              {!current && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => revoke(s.token)}
                >
                  Sign out
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </ProfileCard>
  );
}

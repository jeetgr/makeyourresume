import type { Metadata } from "next";
import { headers } from "next/headers";

import { googleEnabled } from "@/env";
import { auth } from "@/lib/auth";
import { getSession, requireUser } from "@/server/session";
import { AccountSection } from "@/features/profile/account-section";
import { ConnectedAccounts } from "@/features/profile/connected-accounts";
import { DeleteAccount } from "@/features/profile/delete-account";
import { PasswordSection } from "@/features/profile/password-section";
import { SessionsSection } from "@/features/profile/sessions-section";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false },
};

export default async function ProfilePage() {
  const user = await requireUser();
  const reqHeaders = await headers();
  const [accounts, sessions, current] = await Promise.all([
    auth.api.listUserAccounts({ headers: reqHeaders }),
    auth.api.listSessions({ headers: reqHeaders }),
    getSession(),
  ]);
  const providers = accounts.map((a) => a.providerId);
  const hasPassword = providers.includes("credential");

  return (
    <section className="mx-auto max-w-2xl space-y-6 pt-28 pb-20">
      <PageHeading title="Profile" className="pb-2" />
      <AccountSection user={user} />
      <PasswordSection hasPassword={hasPassword} email={user.email} />
      {googleEnabled && (
        <ConnectedAccounts
          googleAccountId={
            accounts.find((a) => a.providerId === "google")?.accountId ?? null
          }
          canUnlink={providers.length > 1}
        />
      )}
      <SessionsSection
        currentToken={current?.session.token}
        sessions={sessions.map((s) => ({
          token: s.token,
          userAgent: s.userAgent ?? null,
          createdAt: s.createdAt.toISOString(),
        }))}
      />
      <DeleteAccount hasPassword={hasPassword} />
    </section>
  );
}

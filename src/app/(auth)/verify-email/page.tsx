import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/features/auth/auth-card";
import { ResendVerification } from "@/features/auth/resend-verification";

export const metadata: Metadata = {
  title: "Verify email",
  robots: { index: false },
};

/** Shown after signup / unverified login, and as Better Auth's error landing for bad links. */
export default async function VerifyEmailPage({
  searchParams,
}: PageProps<"/verify-email">) {
  const { email, error } = await searchParams;

  return (
    <AuthCard
      title={error ? "Link expired" : "Check your inbox"}
      description={
        error ? (
          "This verification link is invalid or has expired. Log in to get a new one."
        ) : (
          <>
            We sent a verification link to{" "}
            <strong>{typeof email === "string" ? email : "your email"}</strong>.
          </>
        )
      }
      footer={
        <Link href="/login" className="text-link hover:underline">
          Back to login
        </Link>
      }
    >
      {typeof email === "string" && !error && (
        <ResendVerification email={email} />
      )}
    </AuthCard>
  );
}

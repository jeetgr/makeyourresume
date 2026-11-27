import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/features/auth/auth-card";
import { ResetPasswordForm } from "@/features/auth/reset-password-form";

export const metadata: Metadata = { title: "Reset password" };

export default async function ResetPasswordPage({
  searchParams,
}: PageProps<"/reset-password">) {
  const { token, error } = await searchParams;

  if (typeof token !== "string" || error) {
    return (
      <AuthCard
        title="Link expired"
        description="This reset link is invalid or has expired."
        footer={
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Request a new link
          </Link>
        }
      />
    );
  }

  return (
    <AuthCard title="Reset password">
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}

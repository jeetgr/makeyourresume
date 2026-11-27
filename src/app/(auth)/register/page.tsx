import type { Metadata } from "next";
import Link from "next/link";

import { googleEnabled } from "@/env";
import { AuthCard } from "@/features/auth/auth-card";
import { RegisterForm } from "@/features/auth/register-form";

export const metadata: Metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create account"
      description="Save multiple resumes and access them anywhere."
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      }
    >
      <RegisterForm google={googleEnabled} />
      <p className="text-center text-xs text-muted-foreground">
        By creating an account you agree to the{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthCard>
  );
}

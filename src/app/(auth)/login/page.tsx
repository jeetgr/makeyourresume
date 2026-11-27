import type { Metadata } from "next";
import Link from "next/link";

import { googleEnabled } from "@/env";
import { AuthCard } from "@/features/auth/auth-card";
import { LoginForm } from "@/features/auth/login-form";
import { safeNext } from "@/features/auth/schemas";

export const metadata: Metadata = { title: "Login" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;

  return (
    <AuthCard
      title="Login"
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-link hover:underline">
            Register
          </Link>
        </p>
      }
    >
      <LoginForm
        next={safeNext(typeof next === "string" ? next : undefined)}
        google={googleEnabled}
      />
    </AuthCard>
  );
}

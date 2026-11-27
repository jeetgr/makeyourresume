"use client";

import { useUser } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <>
      {user ? (
        children
      ) : (
        <div className="loader fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      )}
    </>
  );
}

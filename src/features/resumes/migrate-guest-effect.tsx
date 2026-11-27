"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { migrateGuestResume } from "@/features/auth/migrate-guest";

/** Runs on `/resumes?migrate=1` (post sign-in landing): opens the moved resume, or just drops the flag. */
export function MigrateGuestEffect() {
  const router = useRouter();

  useEffect(() => {
    migrateGuestResume()
      .then((id) => {
        if (id) {
          toast.success("Your resume was saved to your account");
          router.replace(`/resumes/${id}`);
        } else {
          router.replace("/resumes");
        }
      })
      .catch(() => {
        toast.error(
          "Couldn't save your local resume. It's still on this device.",
        );
        router.replace("/resumes");
      });
  }, [router]);

  return null;
}

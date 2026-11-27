"use client";

import { setUser, type User } from "@/stores/auth-store";
import { useEffect } from "react";
import { api } from "@/lib/api";

export const RefreshUser = () => {
  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      try {
        const data = await api<{ user: User }>("/api/auth/refresh-tokens", {
          signal: abortController.signal,
        });

        setUser(data.user);
      } catch (error) {
        if (abortController.signal.aborted) return;
        setUser(null);
        console.log(error);
      }
    })();

    return () => {
      abortController.abort();
    };
  }, []);

  return null;
};

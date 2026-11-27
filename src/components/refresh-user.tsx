"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { api } from "@/lib/api";
import type { User } from "@/redux/features/auth/authSlice";

export const RefreshUser = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      try {
        const data = await api<{ user: User }>("/api/auth/refresh-tokens", {
          signal: abortController.signal,
        });

        dispatch(setUser(data.user));
      } catch (error) {
        if (abortController.signal.aborted) return;
        dispatch(setUser(null));
        console.log(error);
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [dispatch]);

  return null;
};

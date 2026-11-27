import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type User = {
  id: string;
  name: string;
  email: string;
  resumes: string[];
};

type AuthState = {
  user: User | null;
};

/** Temporary; replaced by Better Auth session in P9. */
const useAuthStore = create<AuthState>()(immer(() => ({ user: null })));

export const useUser = () => useAuthStore((s) => s.user);

export const setUser = (user: User | null) => useAuthStore.setState({ user });

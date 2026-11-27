import { z } from "zod";

export const emailField = z.email("Enter a valid email");

export const passwordField = z
  .string()
  .min(8, "At least 8 characters")
  .max(128, "At most 128 characters");

/** Post-auth landing; `migrate=1` moves a non-empty guest resume into the account (Q22). */
export const AFTER_AUTH_URL = "/resumes?migrate=1";

/** Only same-origin paths, to avoid open redirects. */
export const safeNext = (next: string | undefined) =>
  next?.startsWith("/") && !next.startsWith("//") ? next : AFTER_AUTH_URL;

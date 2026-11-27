import "server-only";

import { z } from "zod";

const optional = z
  .string()
  .optional()
  .transform((v) => v || undefined);

export const env = z
  .object({
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: optional,
    VERCEL_URL: optional,
    VERCEL_BRANCH_URL: optional,
    GOOGLE_CLIENT_ID: optional,
    GOOGLE_CLIENT_SECRET: optional,
    RESEND_API_KEY: optional,
    EMAIL_FROM: z.string().default("MYR <noreply@jeetgr.dev>"),
  })
  .parse(process.env);

export const googleEnabled = Boolean(
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET,
);

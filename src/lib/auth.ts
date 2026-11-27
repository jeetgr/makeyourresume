import "server-only";

import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { env, googleEnabled } from "@/env";
import { sendResetPasswordEmail, sendVerificationEmail } from "@/lib/email";

const vercelOrigins = [env.VERCEL_BRANCH_URL, env.VERCEL_URL]
  .filter(Boolean)
  .map((host) => `https://${host}`);

/** Prod sets `BETTER_AUTH_URL`; previews derive it from Vercel's branch URL. */
const baseURL =
  env.BETTER_AUTH_URL ?? vercelOrigins[0] ?? "http://localhost:3000";

export const auth = betterAuth({
  appName: "Make Your Resume",
  baseURL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [baseURL, ...vercelOrigins],
  database: drizzleAdapter(db, { provider: "pg", schema }),
  advanced: { database: { joins: true } },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: ({ user, url }) =>
      sendResetPasswordEmail(user.email, url),
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: ({ user, url }) =>
      sendVerificationEmail(user.email, url),
  },
  socialProviders: googleEnabled
    ? {
        google: {
          clientId: env.GOOGLE_CLIENT_ID!,
          clientSecret: env.GOOGLE_CLIENT_SECRET!,
        },
      }
    : {},
  account: { accountLinking: { trustedProviders: ["google"] } },
  user: { deleteUser: { enabled: true } },
  plugins: [nextCookies()],
});

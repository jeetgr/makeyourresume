import "server-only";

import { Resend } from "resend";

import { env } from "@/env";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const escape = (s: string) =>
  s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

function layout({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta: { label: string; url: string };
}) {
  return `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto;padding:24px;color:#1f2937">
<h2 style="margin:0 0 16px">${escape(title)}</h2>
<p style="line-height:1.5">${escape(body)}</p>
<p style="margin:24px 0"><a href="${escape(cta.url)}" style="background:#ffb400;color:#1f2937;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:600">${escape(cta.label)}</a></p>
<p style="font-size:12px;color:#6b7280">If you didn't request this, ignore this email.<br/>Make Your Resume</p>
</div>`;
}

/** Sends via Resend; without `RESEND_API_KEY` (dev) the link is logged instead. */
async function send(to: string, subject: string, html: string, url: string) {
  if (!resend) {
    console.info(`[email] ${subject} → ${to}\n${url}`);
    return;
  }
  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });
  if (error) throw new Error(error.message);
}

export const sendVerificationEmail = (to: string, url: string) =>
  send(
    to,
    "Verify your email",
    layout({
      title: "Verify your email",
      body: "Confirm your email address to finish creating your Make Your Resume account.",
      cta: { label: "Verify email", url },
    }),
    url,
  );

export const sendResetPasswordEmail = (to: string, url: string) =>
  send(
    to,
    "Reset your password",
    layout({
      title: "Reset your password",
      body: "Use the button below to choose a new password. The link expires in 1 hour.",
      cta: { label: "Reset password", url },
    }),
    url,
  );

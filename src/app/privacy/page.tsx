import type { Metadata } from "next";
import Link from "next/link";

import { CONTACT_EMAIL, LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Make Your Resume collects, uses and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="November 27, 2026">
      <p>
        Make Your Resume (&ldquo;MYR&rdquo;, &ldquo;we&rdquo;) is a free resume
        builder at <strong>myr.jeetgr.dev</strong>. This policy explains what
        data we collect, why, and the choices you have.
      </p>

      <h2>Data we collect</h2>
      <ul>
        <li>
          <strong>Account data:</strong> your name, email address and a securely
          hashed password. If you sign in with Google, we receive your name,
          email address and profile picture from Google.
        </li>
        <li>
          <strong>Resume content:</strong> the information you enter into your
          resumes (for example work history, education, contact details and an
          optional photo). If you use MYR without an account, this stays in your
          browser&apos;s local storage and is never sent to our servers.
        </li>
        <li>
          <strong>Session data:</strong> when you sign in, we store a session
          record with your IP address and browser user agent so you can see and
          sign out of your active sessions.
        </li>
      </ul>
      <p>
        We do not use analytics, advertising or tracking cookies. PDFs are
        generated in your browser.
      </p>

      <h2>How we use your data</h2>
      <ul>
        <li>To create and secure your account and keep you signed in.</li>
        <li>To store, display and let you edit your saved resumes.</li>
        <li>
          To send account emails: email verification and password reset. We
          don&apos;t send marketing emails.
        </li>
      </ul>
      <p>We do not sell, rent or share your data for advertising.</p>

      <h2>Google user data</h2>
      <p>
        If you choose &ldquo;Continue with Google&rdquo;, we request only the
        basic <code>openid</code>, <code>email</code> and <code>profile</code>{" "}
        scopes. We use this data solely to sign you in and to show your name and
        picture in your account. We do not access your Gmail, Drive, contacts or
        any other Google data, and we do not transfer Google user data to third
        parties except as needed to provide the service (see below). Our use of
        information received from Google APIs adheres to the{" "}
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements.
      </p>

      <h2>Service providers</h2>
      <p>We rely on these providers to run MYR:</p>
      <ul>
        <li>
          <strong>Vercel</strong>: website hosting.
        </li>
        <li>
          <strong>Neon</strong>: database hosting for accounts and saved
          resumes.
        </li>
        <li>
          <strong>Resend</strong>: delivery of verification and password reset
          emails.
        </li>
        <li>
          <strong>Google</strong>: sign-in, only if you choose it.
        </li>
      </ul>

      <h2>Cookies</h2>
      <p>
        We use a single essential cookie to keep you signed in. Without an
        account, the app uses your browser&apos;s local storage to keep your
        resume on your device.
      </p>

      <h2>Retention and deletion</h2>
      <p>
        We keep your account and resumes until you delete them. You can delete
        individual resumes from <Link href="/resumes">My resumes</Link>, and
        delete your entire account (including all resumes) from{" "}
        <Link href="/profile">Profile → Delete account</Link>. Deletion is
        immediate and permanent. Sessions expire automatically.
      </p>

      <h2>Security</h2>
      <p>
        Data is transmitted over HTTPS, passwords are hashed, and access to your
        resumes is limited to your account. No system is perfectly secure, but
        we take reasonable measures to protect your data.
      </p>

      <h2>Children</h2>
      <p>
        MYR is not intended for children under 13, and we do not knowingly
        collect their data.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy. The date at the top shows the latest
        revision.
      </p>

      <h2>Contact</h2>
      <p>
        Questions or requests about your data:{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  );
}

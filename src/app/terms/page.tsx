import type { Metadata } from "next";
import Link from "next/link";

import { CONTACT_EMAIL, LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using Make Your Resume.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="November 27, 2026">
      <p>
        These terms apply to your use of Make Your Resume (&ldquo;MYR&rdquo;,
        &ldquo;we&rdquo;) at <strong>myr.jeetgr.dev</strong>. By using MYR you
        agree to them.
      </p>

      <h2>The service</h2>
      <p>
        MYR is a free tool for creating resumes and exporting them as PDFs. You
        can use it without an account, or create one to save resumes. We may
        change, add or remove features at any time.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>Provide accurate information and keep your password secure.</li>
        <li>You are responsible for activity under your account.</li>
        <li>
          You can delete your account at any time from{" "}
          <Link href="/profile">Profile</Link>.
        </li>
      </ul>

      <h2>Your content</h2>
      <p>
        You own the content you put in your resumes. You give us permission to
        store and process it only as needed to provide the service to you. You
        are responsible for making sure your content is accurate and that you
        have the right to use it, including any photo you upload.
      </p>

      <h2>Acceptable use</h2>
      <p>Don&apos;t use MYR to:</p>
      <ul>
        <li>break the law or infringe others&apos; rights;</li>
        <li>impersonate others or create misleading documents;</li>
        <li>
          attempt to access other users&apos; data, disrupt the service, or
          abuse it with automated requests.
        </li>
      </ul>
      <p>We may suspend accounts that violate these terms.</p>

      <h2>No warranty</h2>
      <p>
        MYR is provided &ldquo;as is&rdquo; without warranties of any kind. We
        don&apos;t guarantee the service will be uninterrupted or error-free, or
        that resumes will lead to any particular outcome. Keep your own copy of
        important documents (for example, by downloading the PDF).
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by law, we are not liable for any indirect,
        incidental or consequential damages, or for loss of data, arising from
        your use of MYR.
      </p>

      <h2>Privacy</h2>
      <p>
        Our <Link href="/privacy">Privacy Policy</Link> explains how we handle
        your data.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. Continued use after changes means you accept
        the updated terms.
      </p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </LegalPage>
  );
}

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import NextJSTopLoader from "nextjs-toploader";

import "./globals.css";

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

import { Footer } from "@/components/footer";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { ResumeStoreHydrator } from "@/components/resume-store-hydrator";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · Free resume builder`,
    template: "%s · MYR",
  },
  description: SITE_DESCRIPTION,
  openGraph: { siteName: SITE_NAME, type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="relative">
        <NextJSTopLoader color="#ffb300" showSpinner={false} />
        <Header />
        <main className="mx-auto max-w-310 px-4">
          {children}
          <Toaster richColors position="top-right" />
        </main>
        <Footer />
        <ResumeStoreHydrator />
      </body>
    </html>
  );
}

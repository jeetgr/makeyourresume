import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import NextJSTopLoader from "nextjs-toploader";

import "./globals.css";

import Header from "@/components/header";
import { StoreProvider } from "@/redux/store-provider";
import { Toaster } from "@/components/ui/sonner";
import { RefreshUser } from "@/components/refresh-user";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://myr.jeetgr.dev"),
  title: {
    default: "Make Your Resume",
    template: "%s · MYR",
  },
  description: "Make your resume in seconds with our free resume builder.",
  openGraph: {
    siteName: "Make Your Resume",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="relative">
        <StoreProvider>
          <NextJSTopLoader color="#ffb300" showSpinner={false} />
          <Header />
          <main className="mx-auto max-w-310 px-4">
            {children}
            <Toaster richColors position="top-right" />
          </main>
          <RefreshUser />
        </StoreProvider>
      </body>
    </html>
  );
}

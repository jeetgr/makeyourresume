import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  redirects: async () => [
    {
      source: "/templates/:id/editor/:path*",
      destination: "/resumes/local",
      permanent: true,
    },
    {
      source: "/templates/:id/resume",
      destination: "/resumes/local",
      permanent: true,
    },
    {
      source: "/resumes/local/print",
      destination: "/resumes/local",
      permanent: true,
    },
  ],
};

export default nextConfig;

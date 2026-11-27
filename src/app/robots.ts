import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/resumes",
        "/profile",
        "/reset-password",
        "/verify-email",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

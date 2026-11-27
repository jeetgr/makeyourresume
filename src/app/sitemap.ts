import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

const routes = ["", "/templates", "/login", "/register", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly",
    priority: path ? 0.5 : 1,
  }));
}

import type { MetadataRoute } from "next";
import { getSiteUrl, isProductionSite } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const allowIndexing = isProductionSite(siteUrl);

  if (!allowIndexing) {
    return {
      rules: {
        userAgent: "*",
        disallow: ["/", "/admin"],
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${siteUrl.toString()}sitemap.xml`,
  };
}

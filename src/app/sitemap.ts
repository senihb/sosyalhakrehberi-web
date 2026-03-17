import type { MetadataRoute } from "next";
import { getSiteUrl, isProductionSite } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  if (!isProductionSite(siteUrl)) {
    return [];
  }

  const routes = ["/", "/evde-bakim-maasi", "/evde-bakim-maasi/hesaplama"];

  return routes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
    changeFrequency: route === "/" ? "weekly" : "daily",
    priority: route === "/" ? 1 : 0.8,
  }));
}

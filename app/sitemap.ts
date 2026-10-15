import type { MetadataRoute } from "next";
import { servicePages, guidePages } from "@/lib/marketing-content";

const baseUrl = "https://om-car-inspection-software.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const corePaths = [
    "/", "/services", "/guides", "/masterclass", "/about", "/contact", "/faq", "/privacy"
  ];
  const servicePaths = servicePages.map((page) => "/services/" + page.slug);
  const guidePaths = guidePages.map((page) => "/guides/" + page.slug);

  return [...new Set([...corePaths, ...servicePaths, ...guidePaths])].map((path): MetadataRoute.Sitemap[number] => ({
    url: baseUrl + path,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : (path === "/services" || path === "/guides" || path === "/masterclass" ? 0.85 : 0.65)
  }));
}

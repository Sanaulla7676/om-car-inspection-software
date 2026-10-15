import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/dashboard",
        "/login",
        "/signup",
        "/onboarding",
        "/api/",
        "/inspections",
        "/reports",
        "/vehicles",
        "/customers",
        "/inspectors",
        "/settings"
      ]
    }],
    sitemap: "https://om-car-inspection-software.vercel.app/sitemap.xml",
    host: "https://om-car-inspection-software.vercel.app"
  };
}

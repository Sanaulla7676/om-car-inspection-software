import type { Metadata } from "next";
import { MarketingIndexPage } from "@/components/marketing-index";
import { guidePages } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Car Inspection Guides and Checklists",
  description: "Browse practical car inspection guides covering used-car checklists, PDI, tyres, paint, engine-bay observations, diagnostics, photos, scoring and reports.",
  alternates: { canonical: "/guides" }
};

export default function GuidesPage() {
  return <MarketingIndexPage kind="guide" pages={guidePages} />;
}

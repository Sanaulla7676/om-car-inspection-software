import type { Metadata } from "next";
import { MarketingIndexPage } from "@/components/marketing-index";
import { servicePages } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Vehicle Inspection Services",
  description: "Explore separate pages for used-car inspection, new-car PDI, used-vehicle PDI, diagnostics, reports, fleet checks and dealer support.",
  alternates: { canonical: "/services" }
};

export default function ServicesPage() {
  return <MarketingIndexPage kind="service" pages={servicePages} />;
}

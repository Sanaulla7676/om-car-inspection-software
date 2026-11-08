import type { Metadata } from "next";
import { MarketingIndexPage } from "@/components/marketing-index";
import { servicePages } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Car Inspection Services",
  description: "Explore separate pages for used-car inspection, new-car PDI, used-car PDI, diagnostics, reports, fleet checks and dealer support.",
  alternates: { canonical: "/services" }
};

export default function ServicesPage() {
  return <MarketingIndexPage kind="service" pages={servicePages} />;
}

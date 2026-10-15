import type { Metadata } from "next";
import { MarketingPage } from "@/components/marketing-page";
import { aboutContent } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: aboutContent.metaTitle,
  description: aboutContent.metaDescription,
  alternates: { canonical: "/about" }
};

export default function AboutPage() {
  return <MarketingPage content={aboutContent} />;
}

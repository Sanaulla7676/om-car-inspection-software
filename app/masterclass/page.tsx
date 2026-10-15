import type { Metadata } from "next";
import { MarketingPage } from "@/components/marketing-page";
import { masterclassContent } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: masterclassContent.metaTitle,
  description: masterclassContent.metaDescription,
  alternates: { canonical: "/masterclass" },
  openGraph: { title: masterclassContent.metaTitle, description: masterclassContent.metaDescription, url: "/masterclass", type: "website" },
  twitter: { card: "summary_large_image", title: masterclassContent.metaTitle, description: masterclassContent.metaDescription }
};

export default function MasterclassPage() {
  return <MarketingPage content={masterclassContent} />;
}

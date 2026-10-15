import type { Metadata } from "next";
import { MarketingPage } from "@/components/marketing-page";
import { faqContent } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: faqContent.metaTitle,
  description: faqContent.metaDescription,
  alternates: { canonical: "/faq" }
};

export default function FAQPage() {
  return <MarketingPage content={faqContent} />;
}

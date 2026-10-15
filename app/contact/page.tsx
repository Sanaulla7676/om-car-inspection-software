import type { Metadata } from "next";
import { MarketingPage } from "@/components/marketing-page";
import { contactContent } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: contactContent.metaTitle,
  description: contactContent.metaDescription,
  alternates: { canonical: "/contact" }
};

export default function ContactPage() {
  return <MarketingPage content={contactContent} />;
}

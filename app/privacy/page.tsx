import type { Metadata } from "next";
import Link from "next/link";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteEffects } from "@/components/site-effects";

export const metadata: Metadata = {
  title: "Privacy and Enquiry Information",
  description: "Read how the OM Car Inspection public website handles booking enquiries and links to the existing inspection application.",
  alternates: { canonical: "/privacy" }
};

export default function PrivacyPage() {
  return <div className="marketing-site page-fade-in"><SiteEffects/><SiteNavigation/><main className="marketing-main-section"><div className="site-container-v2 privacy-page-content"><p className="eyebrow"><span className="eyebrow-live-dot"/> PRIVACY INFORMATION</p><h1>Privacy and enquiry information</h1><p>The public booking forms prepare a message and open WhatsApp. The form values are not submitted to a new website database by this marketing page.</p><p>When you choose WhatsApp, the information you send is handled by WhatsApp according to its own terms and privacy policy. Share only information needed for your enquiry.</p><p>The existing inspection software has its own authenticated application routes and data-handling requirements. The public mock-up is not used as a substitute for the real application.</p><p>Questions about the service or a booking should be raised through the <Link href="/contact">contact and booking page</Link>. This page is general website information and not legal advice.</p></div></main><SiteFooter/></div>;
}

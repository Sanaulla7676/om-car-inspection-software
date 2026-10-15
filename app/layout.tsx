import type { Metadata } from "next";
import "./globals.css";
import "./marketing.css";
import "./animation-effects.css";
import { QueryProvider } from "@/components/query-provider";
import { PwaRegister } from "@/components/pwa-register";

const siteUrl = "https://om-car-inspection-software.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OM Car Inspection | Vehicle Inspection and Practical Training",
    template: "%s | OM Car Inspection"
  },
  description: "Explore used-car inspection, new-car PDI, evidence-led condition reports and the six-day practical vehicle inspection masterclass.",
  applicationName: "OM Car Inspection",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "OM Car Inspection",
    title: "OM Car Inspection | Vehicle Inspection and Practical Training",
    description: "Structured vehicle condition reviews, evidence-led reporting and practical inspection learning."
  },
  twitter: {
    card: "summary_large_image",
    title: "OM Car Inspection | Vehicle Inspection and Practical Training",
    description: "Structured vehicle condition reviews, evidence-led reporting and practical inspection learning."
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" /></head><body><QueryProvider>{children}<PwaRegister/></QueryProvider></body></html>;
}

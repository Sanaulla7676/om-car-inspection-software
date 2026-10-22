import type { Metadata } from "next";
import "./globals.css";
import "./marketing.css";
import "./animation-effects.css";
import "./homepage-sections.css";
import { QueryProvider } from "@/components/query-provider";
import { PwaRegister } from "@/components/pwa-register";
import { Geist } from "next/font/google";


const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const siteUrl = "https://om-car-inspection-software.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OMCAR Car Inspection & PDI Training | Book an Inspection or Learn PDI",
    template: "%s | OMCAR Car Inspection"
  },
  description: "Book a new-car PDI or pre-owned vehicle inspection, or explore six-day practical PDI training in vehicle checks, evidence capture and reporting.",
  applicationName: "OMCAR Car Inspection",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "OMCAR Car Inspection",
    title: "OMCAR Car Inspection & PDI Training | Book an Inspection or Learn PDI",
    description: "Vehicle PDI and pre-owned inspections, evidence-led reports, and practical PDI training for aspiring inspectors."
  },
  twitter: {
    card: "summary_large_image",
    title: "OMCAR Car Inspection & PDI Training | Book an Inspection or Learn PDI",
    description: "Structured vehicle condition reviews, evidence-led reporting and practical inspection learning."
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en" className={"font-sans " + geist.variable}><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@400;500;600;700;800;900&family=Caveat:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" /></head><body><QueryProvider>{children}<PwaRegister/></QueryProvider></body></html>;
}

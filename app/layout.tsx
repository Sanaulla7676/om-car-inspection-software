import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/query-provider";
import { PwaRegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  title: "OM Car Inspection | Vehicle Inspection & 6-Day Masterclass",
  description: "Book used-car inspections and new-car PDI, or request a place in the six-day practical car inspection masterclass.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body><QueryProvider>{children}<PwaRegister/></QueryProvider></body></html>;
}

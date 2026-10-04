import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/query-provider";
import { PwaRegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  title: "OM Car Inspection",
  description: "Offline-first vehicle inspection operations platform.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body><QueryProvider>{children}<PwaRegister/></QueryProvider></body></html>;
}

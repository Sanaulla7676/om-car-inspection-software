import type { Metadata } from "next";
import { SoftwareAccess } from "@/components/software-access";

export const metadata: Metadata = {
  title: "Inspection Software",
  description: "Access the OMKAR vehicle inspection workspace online from desktop, tablet or mobile.",
  alternates: { canonical: "/software" },
};

export default function SoftwarePage() {
  return <SoftwareAccess />;
}

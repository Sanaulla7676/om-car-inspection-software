import type { Metadata } from "next";
import "./admin.css";
import { AdminPortal } from "@/components/admin-portal";

export const metadata: Metadata = {
  title: "Admin Console | OMCAR Inspection",
  description: "Secure OMCAR Inspection administrator console.",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return <AdminPortal />;
}

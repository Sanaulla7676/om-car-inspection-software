import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getStaffContext } from "@/lib/supabase/authorization";

export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const context = await getStaffContext();
  if (!context.ok) {
    redirect(context.status === 503 ? "/login?reason=configuration" : "/login?reason=access");
  }
  return children;
}

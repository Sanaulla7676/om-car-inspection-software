import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getWorkspaceAccess } from "@/lib/admin/workspace-access";
import { SoftwareWorkspace } from "@/components/software-workspace";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "OMCAR Inspection Workspace",
  description: "Secure OMCAR vehicle inspection workspace.",
  robots: { index: false, follow: false },
};

export default async function SoftwarePage() {
  const access = await getWorkspaceAccess();
  if (!access) redirect("/login?next=%2Fsoftware" as never);
  return <SoftwareWorkspace loginId={access.loginId} accessType={access.kind} />;
}

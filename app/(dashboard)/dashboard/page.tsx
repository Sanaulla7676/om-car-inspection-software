import { AppShell } from "@/components/app-shell";
import { ProfessionalDashboard } from "@/components/professional-dashboard";

export default function DashboardPage() {
  return (
    <AppShell module="dashboard">
      <ProfessionalDashboard />
    </AppShell>
  );
}

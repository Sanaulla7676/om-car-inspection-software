import { AppShell } from "@/components/app-shell";

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  return <AppShell module={module} />;
}

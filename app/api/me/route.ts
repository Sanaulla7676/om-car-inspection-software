import { NextResponse } from "next/server";
import { getStaffContext } from "@/lib/supabase/authorization";

export async function GET() {
  const context = await getStaffContext();
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status });

  const { supabase, user, organizationId, role } = context;
  const { data: memberships, error: membershipError } = await supabase
    .from("memberships")
    .select("organization_id,role")
    .eq("user_id", user.id)
    .eq("status", "active")
    .in("role", ["SUPER_ADMIN", "ORG_ADMIN", "REVIEWER", "INSPECTOR"])
    .order("created_at", { ascending: true });

  if (membershipError) return NextResponse.json({ error: "Workspace memberships could not be loaded." }, { status: 503 });
  const organizationIds = [...new Set((memberships ?? []).map(item => item.organization_id))];
  const { data: organizations, error: organizationError } = organizationIds.length
    ? await supabase.from("organizations").select("id,name,logo_url,timezone").in("id", organizationIds)
    : { data: [], error: null };

  if (organizationError) return NextResponse.json({ error: "Workspace details could not be loaded." }, { status: 503 });
  const roleByOrganization = new Map((memberships ?? []).map(item => [item.organization_id, item.role]));
  const organizationOptions = (organizations ?? []).map(org => ({
    ...org,
    role: roleByOrganization.get(org.id) ?? role,
  }));

  return NextResponse.json({
    user: { id: user.id, name: user.user_metadata?.full_name ?? user.email ?? "User", email: user.email },
    organization: organizationOptions.find(org => org.id === organizationId) ?? null,
    organizationId,
    organizations: organizationOptions,
    role,
    demo: false,
  });
}

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const STAFF_ROLES = ["SUPER_ADMIN", "ORG_ADMIN", "REVIEWER", "INSPECTOR"] as const;

export async function getStaffContext() {
  const supabase = await createClient();
  if (!supabase) {
    return { ok: false as const, status: 503, error: "Staff authentication is not configured." };
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { ok: false as const, status: 401, error: "Please sign in to continue." };
  }

  const cookieStore = await cookies();
  const requestedOrganizationId = cookieStore.get("om_active_org")?.value;
  let membershipQuery = supabase
    .from("memberships")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .eq("status", "active")
    .in("role", [...STAFF_ROLES])
    .order("created_at", { ascending: true })
    .limit(1);

  if (requestedOrganizationId) membershipQuery = membershipQuery.eq("organization_id", requestedOrganizationId);
  let { data: membership, error: membershipError } = await membershipQuery.maybeSingle();

  // A stale/invalid workspace cookie must not lock a legitimate staff user out.
  if (!membership && !membershipError && requestedOrganizationId) {
    const fallback = await supabase
      .from("memberships")
      .select("organization_id, role")
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", [...STAFF_ROLES])
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    membership = fallback.data;
    membershipError = fallback.error;
  }

  if (membershipError) {
    return { ok: false as const, status: 503, error: "Workspace access could not be verified." };
  }

  if (!membership?.organization_id) {
    return { ok: false as const, status: 403, error: "This account is not authorised for the staff workspace." };
  }

  return {
    ok: true as const,
    supabase,
    user,
    userId: user.id,
    organizationId: membership.organization_id as string,
    role: membership.role as string,
    membership,
  };
}

export async function getAdminContext() {
  const context = await getStaffContext();
  if (!context.ok) return context;
  if (context.role !== "SUPER_ADMIN" && context.role !== "ORG_ADMIN") {
    return { ok: false as const, status: 403, error: "Administrator access is required." };
  }
  return context;
}

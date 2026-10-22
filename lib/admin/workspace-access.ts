import "server-only";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_SESSION_COOKIE, adminRpc, hashSessionToken } from "@/lib/admin/admin-portal";

export type WorkspaceAccess =
  | { kind: "admin"; loginId: string }
  | { kind: "staff"; loginId: string };

const STAFF_ROLES = ["SUPER_ADMIN", "ORG_ADMIN", "REVIEWER", "INSPECTOR"];

export async function getWorkspaceAccess(): Promise<WorkspaceAccess | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (token) {
    try {
      const session = await adminRpc<{ ok?: boolean; login_id?: string }>(
        "session",
        { session_hash: hashSessionToken(token) },
      );
      if (session.ok && session.login_id) return { kind: "admin", loginId: session.login_id };
    } catch {
      // A verified staff session can still grant workspace access.
    }
  }

  try {
    const supabase = await createClient();
    if (!supabase) return null;

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return null;

    const { data: membership, error: membershipError } = await supabase
      .from("memberships")
      .select("organization_id, role")
      .eq("user_id", user.id)
      .eq("status", "active")
      .in("role", STAFF_ROLES)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (membershipError || !membership?.organization_id) return null;
    return { kind: "staff", loginId: user.email || "Staff workspace" };
  } catch {
    return null;
  }
}

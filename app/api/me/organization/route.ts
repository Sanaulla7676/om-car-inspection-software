import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const STAFF_ROLES = ["SUPER_ADMIN", "ORG_ADMIN", "REVIEWER", "INSPECTOR"];

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Staff authentication is not configured." }, { status: 503 });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const organizationId = typeof body?.organizationId === "string" ? body.organizationId : "";
  if (!organizationId) return NextResponse.json({ error: "Choose a workspace." }, { status: 400 });

  const { data: membership, error } = await supabase
    .from("memberships")
    .select("organization_id")
    .eq("organization_id", organizationId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .in("role", STAFF_ROLES)
    .maybeSingle();

  if (error) return NextResponse.json({ error: "Workspace access could not be verified." }, { status: 503 });
  if (!membership) return NextResponse.json({ error: "You do not have access to that workspace." }, { status: 403 });

  const cookieStore = await cookies();
  cookieStore.set("om_active_org", organizationId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return NextResponse.json({ ok: true });
}

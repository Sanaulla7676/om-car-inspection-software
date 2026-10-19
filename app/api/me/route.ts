import { NextResponse } from "next/server";
import { getStaffContext } from "@/lib/supabase/authorization";

export async function GET() {
  const context = await getStaffContext();
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status });

  const { supabase, user, organizationId, role } = context;
  const { data: organization, error } = await supabase
    .from("organizations")
    .select("id,name,logo_url,timezone")
    .eq("id", organizationId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: "Workspace could not be loaded." }, { status: 503 });

  return NextResponse.json({
    user: { id: user.id, name: user.user_metadata?.full_name ?? user.email ?? "User", email: user.email },
    organization,
    role,
    demo: false,
  });
}

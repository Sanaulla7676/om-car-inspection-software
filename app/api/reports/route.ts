import { NextResponse } from "next/server";
import { getStaffContext } from "@/lib/supabase/authorization";

export async function GET() {
  const context = await getStaffContext();
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status });

  const { data, error } = await context.supabase
    .from("reports")
    .select("id,inspection_id,current_version,status,share_count,created_at,updated_at,verification_expires_at,verification_revoked_at,inspections(inspection_number,inspection_type,vehicles(make,model,registration_number),customers(name))")
    .eq("organization_id", context.organizationId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: "Reports could not be loaded." }, { status: 503 });
  return NextResponse.json(data ?? []);
}

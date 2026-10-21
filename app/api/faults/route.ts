import { NextResponse } from "next/server";
import { getStaffContext } from "@/lib/supabase/authorization";

export async function GET() {
  const context = await getStaffContext();
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status });
  const { data, error } = await context.supabase
    .from("faults")
    .select("id,code,system,name,severity,default_description,recommendation,photo_required,active,organization_id")
    .eq("active", true)
    .or("organization_id.is.null,organization_id.eq." + context.organizationId)
    .order("system", { ascending: true })
    .order("name", { ascending: true })
    .limit(500);
  if (error) return NextResponse.json({ error: "Fault library could not be loaded." }, { status: 503 });
  return NextResponse.json(data ?? []);
}

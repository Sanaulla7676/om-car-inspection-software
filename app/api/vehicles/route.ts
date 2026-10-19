import { NextResponse } from "next/server";
import { getStaffContext } from "@/lib/supabase/authorization";

export async function GET() {
  const context = await getStaffContext();
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status });
  const { data, error } = await context.supabase
    .from("vehicles")
    .select("id,registration_number,vin,make,model,variant,manufacturing_year,fuel_type,transmission,color,odometer,created_at")
    .eq("organization_id", context.organizationId)
    .order("created_at", { ascending: false })
    .limit(250);
  if (error) return NextResponse.json({ error: "Vehicle records could not be loaded." }, { status: 503 });
  return NextResponse.json(data ?? []);
}

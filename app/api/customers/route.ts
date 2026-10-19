import { NextResponse } from "next/server";
import { getStaffContext } from "@/lib/supabase/authorization";

export async function GET() {
  const context = await getStaffContext();
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status });
  const { data, error } = await context.supabase
    .from("customers")
    .select("id,name,phone,email,customer_type,address,created_at,updated_at")
    .eq("organization_id", context.organizationId)
    .order("created_at", { ascending: false })
    .limit(250);
  if (error) return NextResponse.json({ error: "Customer records could not be loaded." }, { status: 503 });
  return NextResponse.json(data ?? []);
}

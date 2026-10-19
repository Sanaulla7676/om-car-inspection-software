import { NextResponse } from "next/server";
import { getStaffContext } from "@/lib/supabase/authorization";

export async function GET() {
  const context = await getStaffContext();
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status });
  const { supabase, organizationId } = context;
  if(!organizationId) return NextResponse.json({error:"No active organization."},{status:409});
  const {data,error}=await supabase.from("inspections").select("*,vehicles(make,model,registration_number),customers(name),inspection_scores(overall_score)").eq("organization_id",organizationId).order("created_at",{ascending:false}).limit(100);
  if(error) return NextResponse.json({error:error.message},{status:500});
  return NextResponse.json(data??[]);
}

export async function POST(req: Request) {
  const context = await getStaffContext();
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status });
  const { supabase, userId, organizationId } = context;

  const contentLength = Number(req.headers.get("content-length") || "0");
  if (contentLength > 1_000_000) return NextResponse.json({ error: "Inspection draft is too large." }, { status: 413 });
  const body = await req.json().catch(() => null);
  const draft = body && typeof body === "object" && !Array.isArray(body) ? body.draft : null;
  if (!draft || typeof draft !== "object" || Array.isArray(draft)) {
    return NextResponse.json({ error: "Inspection draft is missing." }, { status: 400 });
  }
  if (!draft.vehicle || typeof draft.vehicle !== "object" || Array.isArray(draft.vehicle)) {
    return NextResponse.json({ error: "Vehicle details are required." }, { status: 400 });
  }
  const registration = typeof draft.vehicle.registration === "string" ? draft.vehicle.registration.trim() : "";
  if (registration.length < 4 || registration.length > 24) {
    return NextResponse.json({ error: "Enter a valid vehicle registration number." }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("create_inspection", {
    p_organization_id: organizationId,
    p_user_id: userId,
    p_draft: draft,
  });

  if (error) {
    if (error.code === "22023") return NextResponse.json({ error: "Check the vehicle and customer details, then try again." }, { status: 400 });
    if (error.code === "42501") return NextResponse.json({ error: "You are not authorised to create inspections in this workspace." }, { status: 403 });
    return NextResponse.json({ error: "Inspection could not be created. No partial vehicle/customer/inspection record was saved." }, { status: 503 });
  }

  const created = Array.isArray(data) ? data[0] : data;
  if (!created?.id) return NextResponse.json({ error: "Inspection creation did not return a record ID." }, { status: 503 });
  return NextResponse.json({ id: created.id, inspectionNumber: created.inspection_number }, { status: 201 });
}

import { NextResponse } from "next/server";
import { getStaffContext } from "@/lib/supabase/authorization";
import { readJsonRequestLimited } from "@/lib/request-body";

export async function GET() {
  const context = await getStaffContext();
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status });
  const { supabase, organizationId } = context;
  if(!organizationId) return NextResponse.json({error:"No active organization."},{status:409});
  const {data,error}=await supabase.from("inspections").select("*,vehicles(make,model,registration_number),customers(name),inspection_scores(overall_score)").eq("organization_id",organizationId).order("created_at",{ascending:false}).limit(100);
  if(error) return NextResponse.json({error:"Inspection records could not be loaded."},{status:503,headers:{"Cache-Control":"private, no-store, max-age=0"}});
  return NextResponse.json(data??[]);
}

export async function POST(req: Request) {
  const context = await getStaffContext();
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status });
  const { supabase, userId, organizationId } = context;

  const parsedBody = await readJsonRequestLimited(req, 1_000_000);
  if (!parsedBody.ok) {
    return NextResponse.json(
      { error: parsedBody.tooLarge ? "Inspection draft is too large." : "Send a valid JSON inspection draft." },
      { status: parsedBody.tooLarge ? 413 : 400 },
    );
  }
  const bodyValue = parsedBody.value;
  const draftValue = bodyValue && typeof bodyValue === "object" && !Array.isArray(bodyValue)
    ? (bodyValue as Record<string, unknown>).draft
    : null;
  if (!draftValue || typeof draftValue !== "object" || Array.isArray(draftValue)) {
    return NextResponse.json({ error: "Inspection draft is missing." }, { status: 400 });
  }
  const draft = draftValue as Record<string, unknown>;
  const vehicleValue = draft.vehicle;
  if (!vehicleValue || typeof vehicleValue !== "object" || Array.isArray(vehicleValue)) {
    return NextResponse.json({ error: "Vehicle details are required." }, { status: 400 });
  }
  const vehicle = vehicleValue as Record<string, unknown>;
  const registration = typeof vehicle.registration === "string" ? vehicle.registration.trim() : "";
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

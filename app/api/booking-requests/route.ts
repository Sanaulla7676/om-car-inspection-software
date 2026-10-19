import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminContext } from "@/lib/supabase/authorization";

const STATUSES = ["NEW", "CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;

export async function GET() {
  const context = await getAdminContext();
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status });
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Admin data access is not configured." }, { status: 503 });

  const { data, error } = await admin
    .from("booking_requests")
    .select("id,request_type,full_name,mobile,email,vehicle_make_model,model_year,inspection_type,preferred_date,vehicle_location,notes,experience_level,learning_goals,status,source,created_at,updated_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ error: "Booking requests could not be loaded." }, { status: 503 });
  return NextResponse.json(data ?? []);
}

export async function PATCH(request: Request) {
  const context = await getAdminContext();
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status });
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Admin data access is not configured." }, { status: 503 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== "string" || !STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Provide a request ID and a valid status." }, { status: 400 });
  }

  const { data, error } = await admin
    .from("booking_requests")
    .update({ status: body.status, updated_at: new Date().toISOString() })
    .eq("id", body.id)
    .select("id,status,updated_at")
    .maybeSingle();

  if (error) return NextResponse.json({ error: "Request status could not be updated." }, { status: 503 });
  if (!data) return NextResponse.json({ error: "Booking request not found." }, { status: 404 });
  return NextResponse.json({ ok: true, request: data });
}

import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/supabase/authorization";

const STATUSES = ["NEW", "CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;

export async function GET() {
  const context = await getAdminContext();
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status });
  const { data, error } = await context.supabase.rpc("admin_list_booking_requests");
  if (error) {
    const status = error.code === "42501" ? 403 : 503;
    return NextResponse.json({ error: status === 403 ? "Administrator access is required." : "Booking requests could not be loaded." }, { status });
  }
  return NextResponse.json(data ?? []);
}

export async function PATCH(request: Request) {
  const context = await getAdminContext();
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status });
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== "string" || !STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Provide a request ID and a valid status." }, { status: 400 });
  }

  const { data, error } = await context.supabase.rpc("admin_update_booking_request_status", {
    p_id: body.id,
    p_status: body.status,
  });
  if (error) {
    if (error.code === "P0002") return NextResponse.json({ error: "Booking request not found." }, { status: 404 });
    const status = error.code === "42501" ? 403 : error.code === "22023" ? 400 : 503;
    return NextResponse.json({ error: status === 403 ? "Administrator access is required." : status === 400 ? "Invalid request status." : "Request status could not be updated." }, { status });
  }
  const updated = Array.isArray(data) ? data[0] : data;
  if (!updated) return NextResponse.json({ error: "Booking request not found." }, { status: 404 });
  return NextResponse.json({ ok: true, request: updated });
}

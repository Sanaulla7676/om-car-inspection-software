import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/supabase/authorization";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const context = await getAdminContext();
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status });

  const { data, error } = await context.supabase.rpc("admin_revoke_public_report", { p_report_id: id });
  if (error) {
    if (error.code === "P0002") return NextResponse.json({ error: "Report not found." }, { status: 404 });
    if (error.code === "42501") return NextResponse.json({ error: "Administrator access is required." }, { status: 403 });
    return NextResponse.json({ error: "The public report link could not be revoked." }, { status: 503 });
  }
  const result = Array.isArray(data) ? data[0] : data;
  if (!result) return NextResponse.json({ error: "Report not found." }, { status: 404 });
  return NextResponse.json({ ok: true, report: result });
}

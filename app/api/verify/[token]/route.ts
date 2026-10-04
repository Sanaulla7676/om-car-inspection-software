import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "Public verification is not configured." }, { status: 503 });

  const hash = createHash("sha256").update(token).digest("hex");
  const { data, error } = await supabase
    .from("reports")
    .select("id,current_version,status,created_at,organizations(name),inspections(inspection_number,inspection_type,vehicles(make,model,registration_number))")
    .eq("verification_token_hash", hash)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ verified: false }, { status: 404 });

  const report = data as any;
  return NextResponse.json({
    verified: true,
    reportId: report.id,
    status: report.status,
    version: report.current_version,
    createdAt: report.created_at,
    organization: report.organizations,
    inspection: report.inspections,
  });
}

import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { createClient } from "@/lib/supabase/server";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Public verification is not configured." }, { status: 503 });

  const hash = createHash("sha256").update(token).digest("hex");
  const { data, error } = await supabase.rpc("get_public_report_by_token_hash", { p_token_hash: hash });

  if (error) return NextResponse.json({ error: "Report verification is temporarily unavailable." }, { status: 503 });
  if (!data) return NextResponse.json({ verified: false }, { status: 404 });

  const report = data as any;

  return NextResponse.json({
    verified: true,
    reportId: report.reportId,
    status: report.status,
    version: report.version,
    createdAt: report.createdAt,
    expiresAt: report.expiresAt,
    organization: report.organization,
    inspection: report.inspection,
  });
}

import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createAdminClient } from "@/lib/supabase/admin";

function wrap(text: string, max = 88) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > max) {
      if (line) lines.push(line);
      line = word;
    } else {
      line += (line ? " " : "") + word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = createAdminClient();
  if (!supabase) return new NextResponse("Public PDF is not configured.", { status: 503 });

  const hash = createHash("sha256").update(token).digest("hex");
  const { data: report } = await supabase
    .from("reports")
    .select("id,current_version,report_versions(snapshot_json)")
    .eq("verification_token_hash", hash)
    .maybeSingle();

  if (!report) return new NextResponse("Report not found", { status: 404 });

  const versions: any = (report as any).report_versions;
  const snapshot = Array.isArray(versions) ? versions[0]?.snapshot_json : versions?.snapshot_json;

  const pdf = await PDFDocument.create();
  const normal = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page = pdf.addPage([595, 842]);
  let y = 790;

  const add = (text: string, size = 10, strong = false) => {
    if (y < 55) {
      page = pdf.addPage([595, 842]);
      y = 790;
    }
    page.drawText(text, {
      x: 42,
      y,
      size,
      font: strong ? bold : normal,
      color: rgb(0.09, 0.13, 0.20),
    });
    y -= size + 8;
  };

  page.drawRectangle({ x: 0, y: 780, width: 595, height: 62, color: rgb(0.06, 0.09, 0.15) });
  page.drawText("OM Car Inspection", { x: 42, y: 805, size: 22, font: bold, color: rgb(0.94, 0.80, 0.50) });
  page.drawText("Verified Vehicle Inspection Report", { x: 42, y: 787, size: 11, font: normal, color: rgb(1, 1, 1) });
  y = 755;

  add(`Inspection ${snapshot?.inspection?.number ?? ""}`, 16, true);
  add(`Vehicle: ${[snapshot?.vehicle?.make, snapshot?.vehicle?.model, snapshot?.vehicle?.variant].filter(Boolean).join(" ") || "—"}`, 11, true);
  add(`Registration: ${snapshot?.vehicle?.registration || "—"}    VIN: ${snapshot?.vehicle?.vin || "—"}`);
  add(`Score: ${snapshot?.score?.overall ?? "—"}/100    Recommendation: ${snapshot?.recommendation ?? "—"}`, 11, true);

  add("Key findings", 13, true);
  for (const finding of snapshot?.findings ?? []) {
    add(`• ${finding.name} • ${finding.severity}`);
    for (const line of wrap(finding.default_description || "")) add(line);
  }

  add("Summary", 13, true);
  for (const line of wrap(snapshot?.summary || "No summary supplied.")) add(line);

  const bytes = await pdf.save();
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${snapshot?.inspection?.number ?? "inspection"}.pdf"`,
    },
  });
}

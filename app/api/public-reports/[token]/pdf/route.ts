import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createClient } from "@/lib/supabase/server";

function safePdfText(text: string) { return text.replace(/•/g,"-").replace(/·/g,"|").replace(/[–—]/g,"-").replace(/₹/g,"INR ").replace(/…/g,"...").replace(/[^\\x20-\\x7E\\xA0-\\xFF]/g," "); }

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
  const supabase = await createClient();
  if (!supabase) return new NextResponse("Public PDF is not configured.", { status: 503 });

  const hash = createHash("sha256").update(token).digest("hex");
  const { data: publicReport, error } = await supabase.rpc("get_public_report_by_token_hash", { p_token_hash: hash });
  if (error) return new NextResponse("Report verification is temporarily unavailable.", { status: 503 });
  if (!publicReport) return new NextResponse("Report not found", { status: 404 });
  const snapshot = (publicReport as any).snapshot;
  if (!snapshot) return new NextResponse("Report snapshot not found", { status: 404 });

  const safeFilename = String((snapshot as any)?.inspection?.number ?? "inspection").replace(/[^A-Za-z0-9_-]/g, "_");
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
    page.drawText(safePdfText(text), {
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


  const val = snapshot?.valuation, vt = snapshot?.valuationTotals;
  if(val){
    add("Valuation sheet and legacy inspection details",14,true);
    add("PO name: "+(val.header?.poName||"—")+" · Enquiry date: "+(val.header?.enquiryDate||"—")+" · Valuation date: "+(val.header?.valuationDate||"—"),9);
    add("Source: "+(val.source?.sourceType||"—")+" · Branch: "+(val.source?.branchType||"—")+" · Customer: "+(val.customer?.name||"—")+" · Phone: "+(val.customer?.mobile||val.customer?.phone||"—"),9);
    add("Registration: "+(val.vehicle?.registration||"—")+" · Make: "+(val.vehicle?.manufacturer||"—")+" · Model: "+(val.vehicle?.modelSuffix||"—")+" · Chassis/VIN: "+(val.vehicle?.chassis||"—"),9);
    add("Engine: "+(val.vehicle?.engine||"—")+" · Year: "+(val.vehicle?.monthYear||"—")+" · Colour: "+(val.vehicle?.color||"—")+" · KM run: "+(val.vehicle?.kmRun||"—"),9);
    add("RC book: "+(val.documents?.rcBookType||"—")+" · Insurance: "+(val.insurance?.type||"—")+" · Expiry: "+(val.insurance?.expiryDate||"—")+" · IDV: "+(val.insurance?.idvValue||"—"),9);
    add("Exterior Defect Details [W]",10,true);
    for(const row of val.exteriorRows||[])if(row.part||row.damageType||row.rfCost)add("W / "+(row.part||"Exterior part")+" · Qty "+(row.quantity||"—")+" · "+(row.damageType||"—")+" · Level "+row.damageLevel+" · RF INR "+(row.rfCost||"0"),8);
    for(const [part,row] of Object.entries(val.exteriorOtherDamage||{}) as [string,any][])if(row.left||row.right||row.rfCost)add(part+" · L "+row.left+" · R "+row.right+" · RF INR "+(row.rfCost||"0"),8);
    add("Interior Defect Details [X]",10,true);
    for(const [label,checked] of Object.entries(val.interiorOverall||{}))if(checked)add("Interior overall / "+label,8);
    for(const row of val.interiorRows||[])if(row.part||row.damageType||row.rfCost)add("X / "+(row.part||"Interior part")+" · Qty "+(row.quantity||"—")+" · "+(row.damageType||"—")+" · Level "+row.damageLevel+" · RF INR "+(row.rfCost||"0"),8);
    add("Function Defect Details [Y]",10,true);
    for(const [label,row] of Object.entries(val.functionItems||{}) as [string,any][])if(row.severity||row.details||row.rfCost)add("Y / "+label+" · "+(row.severity==="Small"?"S":row.severity==="Large"?"L":"—")+" · "+(row.details||"No details")+" · RF INR "+(row.rfCost||"0"),8);
    add("Frame Defect Details [Z]",10,true);
    for(const [label,row] of Object.entries(val.frameItems||{}) as [string,any][])if(row.dent||row.repair||row.replaced||row.size||row.rfCost)add("Z / "+label+" · Dent "+(row.dent?"Yes":"No")+" · Repair "+(row.repair?"Yes":"No")+" · Replaced "+(row.replaced?"Yes":"No")+" · "+(row.size||"—")+" · RF INR "+(row.rfCost||"0"),8);
    add("Exterior rating [A]: "+String(vt?.exteriorRating??"—")+"/5 · Interior [B]: "+String(vt?.interiorRating??"—")+"/5 · Function [C]: "+String(vt?.functionRating??"—")+"/5 · Frame [D]: "+String(vt?.frameFactor??"—"),9,true);
    add("Total RF cost [W+X+Y+Z]: INR "+String(vt?.totalRf??0)+" · Final score: "+String(vt?.finalScore??"—")+" · Level: "+String(vt?.finalLevel??"—"),10,true);
    add("Net Buying Price = A + B − C − D − E: INR "+String(vt?.netBuyingPrice??0),10,true);
    for(const row of val.followUps||[])if(row.date||row.status||row.details||row.nextActionDate)add("Follow-up · "+(row.date||"—")+" · "+(row.status||"—")+" · "+(row.details||"")+" · TL: "+(row.tlComment||"")+" · Next: "+(row.nextActionDate||"—"),8);
    if(val.dropReason)add("Drop reason: "+val.dropReason,9);
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

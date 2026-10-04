import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { createClient } from "@/lib/supabase/server";

const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024;

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "PDF merge is not configured." }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: membership } = await supabase
    .from("memberships")
    .select("organization_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at")
    .limit(1)
    .maybeSingle();

  if (!membership?.organization_id) return NextResponse.json({ error: "No active organization." }, { status: 409 });

  const { data: report } = await supabase
    .from("reports")
    .select("id, inspection_id, current_version")
    .eq("id", id)
    .eq("organization_id", membership.organization_id)
    .maybeSingle();

  if (!report) return NextResponse.json({ error: "Report not found." }, { status: 404 });

  const form = await req.formData();
  const basePdf = form.get("basePdf");
  const attachment = form.get("attachment");

  if (!(basePdf instanceof File) || !(attachment instanceof File)) {
    return NextResponse.json({ error: "basePdf and attachment are required." }, { status: 400 });
  }
  if (attachment.type !== "application/pdf" && !attachment.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "The attachment must be a PDF." }, { status: 415 });
  }
  if (attachment.size > MAX_ATTACHMENT_BYTES) {
    return NextResponse.json({ error: "The attachment is too large. Maximum size is 25 MB." }, { status: 413 });
  }

  try {
    const merged = await PDFDocument.create();
    const reportDocument = await PDFDocument.load(await basePdf.arrayBuffer());
    const attachmentDocument = await PDFDocument.load(await attachment.arrayBuffer());

    const reportPages = await merged.copyPages(reportDocument, reportDocument.getPageIndices());
    reportPages.forEach((page) => merged.addPage(page));

    const attachmentPages = await merged.copyPages(attachmentDocument, attachmentDocument.getPageIndices());
    attachmentPages.forEach((page) => merged.addPage(page));

    const bytes = await merged.save();
    const filename = `OM-Car-Inspection-${id}-v${report.current_version}-merged.pdf`;

    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="${filename}"`,
        "cache-control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "One of the PDFs is invalid or could not be merged." }, { status: 422 });
  }
}

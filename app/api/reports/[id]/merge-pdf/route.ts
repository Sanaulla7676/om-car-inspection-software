import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { createClient } from "@/lib/supabase/server";

const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024;
const MAX_TOTAL_ATTACHMENT_BYTES = 100 * 1024 * 1024;
const MAX_ATTACHMENTS = 10;

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
  const legacyAttachment = form.get("attachment");
  const uploadedAttachments = form.getAll("attachments").filter((entry): entry is File => entry instanceof File);
  // Keep compatibility with the old single-attachment client while supporting multiple PDFs.
  const attachments = uploadedAttachments.length
    ? uploadedAttachments
    : legacyAttachment instanceof File
      ? [legacyAttachment]
      : [];

  if (!(basePdf instanceof File)) {
    return NextResponse.json({ error: "The generated base PDF is required." }, { status: 400 });
  }
  if (!attachments.length) {
    return NextResponse.json({ error: "Select at least one supporting PDF." }, { status: 400 });
  }
  if (attachments.length > MAX_ATTACHMENTS) {
    return NextResponse.json({ error: "Attach up to 10 supporting PDFs at a time." }, { status: 413 });
  }

  const totalBytes = attachments.reduce((sum, file) => sum + file.size, 0);
  if (totalBytes > MAX_TOTAL_ATTACHMENT_BYTES) {
    return NextResponse.json({ error: "The combined supporting PDFs exceed 100 MB." }, { status: 413 });
  }
  for (const attachment of attachments) {
    if (attachment.type !== "application/pdf" && !attachment.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: attachment.name + " is not a PDF." }, { status: 415 });
    }
    if (attachment.size > MAX_ATTACHMENT_BYTES) {
      return NextResponse.json({ error: attachment.name + " exceeds the 25 MB per-file limit." }, { status: 413 });
    }
  }

  try {
    const merged = await PDFDocument.create();
    const reportDocument = await PDFDocument.load(await basePdf.arrayBuffer());
    const reportPages = await merged.copyPages(reportDocument, reportDocument.getPageIndices());
    reportPages.forEach((page) => merged.addPage(page));

    for (const attachment of attachments) {
      const attachmentDocument = await PDFDocument.load(await attachment.arrayBuffer());
      const pages = await merged.copyPages(attachmentDocument, attachmentDocument.getPageIndices());
      pages.forEach((page) => merged.addPage(page));
    }

    const bytes = await merged.save();
    const filename = `OM-Car-Inspection-${id}-v${report.current_version}-complete-package.pdf`;

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

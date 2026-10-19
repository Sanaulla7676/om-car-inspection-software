import { NextResponse } from "next/server";
import { createHash, randomUUID } from "crypto";
import { getStaffContext } from "@/lib/supabase/authorization";
import { calculateScore, recommendationForScore } from "@/lib/scoring";
import { calculateValuation } from "@/lib/valuation";
import type { Severity } from "@/lib/types";

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

const VALID_SEVERITIES = new Set<Severity>(["Cosmetic", "Minor", "Moderate", "Major", "Critical"]);
const clean = (value: unknown, max = 2000) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const context = await getStaffContext();
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status });
  const { supabase, userId, organizationId } = context;

  const contentLength = Number(req.headers.get("content-length") || "0");
  if (contentLength > 1_000_000) return NextResponse.json({ error: "Inspection payload is too large." }, { status: 413 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid inspection request." }, { status: 400 });
  }
  const payload = body.payload;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Inspection data is missing." }, { status: 400 });
  }

  const { data: inspection, error: inspectionError } = await supabase
    .from("inspections")
    .select("id,organization_id,inspection_number,vehicle_id,customer_id,inspection_type,status")
    .eq("id", id)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (inspectionError) return NextResponse.json({ error: "Inspection could not be loaded." }, { status: 503 });
  if (!inspection) return NextResponse.json({ error: "Inspection not found." }, { status: 404 });

  if (body.action === "draft") {
    if (inspection.status === "COMPLETED") {
      return NextResponse.json({ error: "This inspection is finalised. Create a new inspection for a revised assessment." }, { status: 409 });
    }

    const { data: existing, error: draftReadError } = await supabase
      .from("inspection_drafts")
      .select("version")
      .eq("organization_id", organizationId)
      .eq("inspection_id", id)
      .maybeSingle();
    if (draftReadError) return NextResponse.json({ error: "Draft version could not be checked." }, { status: 503 });

    const version = (existing?.version ?? 0) + 1;
    const { error: draftError } = await supabase.from("inspection_drafts").upsert({
      organization_id: organizationId,
      inspection_id: id,
      version,
      payload,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    }, { onConflict: "inspection_id" });
    if (draftError) return NextResponse.json({ error: "Inspection draft could not be saved." }, { status: 503 });

    const { error: updateError } = await supabase.from("inspections")
      .update({ draft_payload: payload, status: "IN_PROGRESS", updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("organization_id", organizationId);
    if (updateError) return NextResponse.json({ error: "Inspection status could not be updated." }, { status: 503 });
    return NextResponse.json({ ok: true, version });
  }

  if (body.action === "finalize") {
    if (inspection.status === "COMPLETED") {
      return NextResponse.json({ error: "This inspection is already finalised. Create a new inspection for a revised assessment." }, { status: 409 });
    }

    if (!payload.sections || typeof payload.sections !== "object" || Array.isArray(payload.sections)) {
      return NextResponse.json({ error: "Inspection checklist data is missing." }, { status: 400 });
    }

    const rawFindings = Array.isArray(payload.findings) ? payload.findings : [];
    const findings = rawFindings.map((finding: Record<string, unknown>) => ({
      name: clean(finding?.name, 160),
      system: clean(finding?.system, 80),
      severity: finding?.severity as Severity,
      default_description: clean(finding?.default_description, 2000),
      recommendation: clean(finding?.recommendation, 2000),
    }));

    if (findings.some((finding: { name: string; severity: Severity }) =>
      !finding.name || !VALID_SEVERITIES.has(finding.severity)
    )) {
      return NextResponse.json({ error: "Every finding must have a title and a valid severity." }, { status: 400 });
    }

    const scored = calculateScore(findings);
    const recommendation = recommendationForScore(scored.overall, scored.counts.Critical, scored.counts.Major);
    const itemResults: Array<Record<string, unknown>> = [];

    for (const [section, items] of Object.entries(payload.sections as Record<string, unknown>)) {
      if (!items || typeof items !== "object" || Array.isArray(items)) continue;
      for (const [label, value] of Object.entries(items as Record<string, unknown>)) {
        if (!value || typeof value !== "object" || Array.isArray(value)) continue;
        const item = value as Record<string, unknown>;
        const itemSeverity = VALID_SEVERITIES.has(item.severity as Severity) ? item.severity : null;
        itemResults.push({
          item_code: `${section.toUpperCase().slice(0, 8)}-${label.toUpperCase().replace(/[^A-Z0-9]+/g, "-").slice(0, 28)}`,
          item_label: label.slice(0, 160),
          status: clean(item.status, 80) || null,
          severity: itemSeverity,
          value: item.value ?? null,
          notes: clean(item.notes, 2000) || null,
        });
      }
    }

    const generatedAt = new Date().toISOString();
    const snapshot = {
      inspection: { id, number: inspection.inspection_number, type: inspection.inspection_type },
      vehicle: payload.vehicle ?? {},
      customer: payload.customer ?? {},
      sections: payload.sections,
      findings,
      valuation: payload.valuation ?? null,
      valuationTotals: payload.valuation ? calculateValuation(payload.valuation) : null,
      score: scored,
      recommendation,
      testDrive: payload.testDrive ?? null,
      photos: payload.photos ?? [],
      summary: clean(payload.reviewerComments, 4000),
      generatedAt,
    };

    const token = clean(payload.reportToken, 128);
    if (!/^[a-f0-9]{64}$/.test(token)) {
      return NextResponse.json({ error: "The secure report token is missing. Save the inspection and retry." }, { status: 400 });
    }
    const { data, error } = await supabase.rpc("finalize_inspection", {
      p_inspection_id: id,
      p_organization_id: organizationId,
      p_user_id: userId,
      p_payload: payload,
      p_item_results: itemResults,
      p_findings: findings,
      p_score: scored,
      p_recommendation: recommendation,
      p_snapshot: snapshot,
      p_token_hash: tokenHash(token),
    });

    if (error) {
      if (error.code === "23505" || /already finalized/i.test(error.message)) {
        return NextResponse.json({ error: "This inspection has already been finalised. Create a new inspection for a revised assessment." }, { status: 409 });
      }
      if (error.code === "42501") return NextResponse.json({ error: "You are not authorised to finalise this inspection." }, { status: 403 });
      if (error.code === "P0002") return NextResponse.json({ error: "Inspection not found." }, { status: 404 });
      return NextResponse.json({ error: "The report could not be finalised. No partial report was saved; check the inspection and retry." }, { status: 503 });
    }

    const report = Array.isArray(data) ? data[0] : data;
    if (!report?.report_id) return NextResponse.json({ error: "The report finalisation did not return a report ID." }, { status: 503 });
    return NextResponse.json({
      ok: true,
      reportId: report.report_id,
      verificationToken: token,
      score: scored.overall,
      version: report.current_version ?? 1,
    });
  }

  return NextResponse.json({ error: "Unknown inspection action." }, { status: 400 });
}

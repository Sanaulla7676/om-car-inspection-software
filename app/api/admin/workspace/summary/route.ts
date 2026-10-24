import { NextResponse } from "next/server";
import { getWorkspaceAccess } from "@/lib/admin/workspace-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type InspectionItem = {
  title?: string;
  scope?: string;
  condition?: string;
  damageTypes?: string[];
  damageLevel?: string;
  description?: string;
  notes?: string;
  score?: string | number;
  photoAttached?: boolean;
  levelUnit?: string;
};

type ReportInput = {
  inspectionType?: string;
  make?: string;
  model?: string;
  vehicleYear?: string;
  vehicleColor?: string;
  registration?: string;
  inspector?: string;
  verdict?: string;
  score?: string | number;
  scoreLabel?: string;
  generalNotes?: string;
  scope?: string;
  items?: InspectionItem[];
};

function capSummary(value: string): string {
  const clean = value.replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").trim();
  if (clean.length <= 800) return clean;
  const prefix = clean.slice(0, 800);
  const lineBreak = prefix.lastIndexOf("\n");
  if (lineBreak >= 560) return prefix.slice(0, lineBreak).trim();
  const sentence = prefix.lastIndexOf(". ");
  if (sentence >= 560) return prefix.slice(0, sentence + 1).trim();
  return prefix.slice(0, 797).trimEnd() + "...";
}

function shortText(value: unknown, max = 240): string {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

function summarizeFromFacts(report: ReportInput): string {
  const items = Array.isArray(report.items) ? report.items : [];
  const good = items.filter((item) => ["No visible damage", "Pass"].includes(shortText(item.condition)));
  const issues = items.filter((item) => ["Damage found", "Fail", "Advisory"].includes(shortText(item.condition)));
  const unchecked = items.filter((item) => !shortText(item.condition) || ["Not inspected", "Not assessed"].includes(shortText(item.condition)));
  const verdict = shortText(report.verdict, 30) || "Pending";
  const vehicle = [report.make, report.model].map((v) => shortText(v, 60)).filter(Boolean).join(" ") || "Vehicle";
  const damageName = (item: InspectionItem) => {
    const typeMap: Record<string, string> = {
      P: "paint/surface damage",
      B: "panel deformation",
      X: "cut, crack, hole or missing part",
    };
    const types = (Array.isArray(item.damageTypes) ? item.damageTypes : []).map((code) => typeMap[code]).filter(Boolean);
    const note = shortText(item.description || item.notes, 100);
    return [types.join(", "), item.damageLevel ? "extent level " + shortText(item.damageLevel, 8) : "", note].filter(Boolean).join("; ");
  };
  const lines = ["RESULT: " + verdict + " for " + vehicle + "."];
  if (good.length) lines.push("GOOD CONDITION: " + good.slice(0, 4).map((item) => shortText(item.title, 55)).filter(Boolean).join(", ") + (good.length > 4 ? " and " + (good.length - 4) + " more" : "") + " marked with no visible damage.");
  if (issues.length) {
    const samples = issues.slice(0, 3).map((item) => shortText(item.title, 52) + (damageName(item) ? " (" + damageName(item) + ")" : " (damage/issue recorded)"));
    lines.push("ISSUES FOUND: " + samples.join("; ") + (issues.length > 3 ? "; plus " + (issues.length - 3) + " more issue(s)" : "") + ".");
  } else {
    lines.push("ISSUES FOUND: No items were marked as damaged in the recorded checklist.");
  }
  if (unchecked.length) lines.push("NOT INSPECTED: " + unchecked.length + " component(s) have no completed result; a missing result does not mean the part passed.");
  if (verdict.toLowerCase() === "rejected") {
    lines.push("REASON: Rejected was selected by the inspector. Review the recorded issues above; no unrecorded cause is assumed.");
  } else if (verdict.toLowerCase() === "passed" || verdict.toLowerCase() === "accepted") {
    lines.push("REASON: Passed was selected by the inspector." + (issues.length ? " Recorded issues remain, so confirm they are acceptable before release." : unchecked.length ? " Some parts remain unchecked; verify them before relying on this result." : " All listed parts have recorded no-visible-damage results."));
  } else {
    lines.push("REASON: No final pass/reject result has been selected.");
  }
  const notes = shortText(report.generalNotes, 180);
  if (notes) lines.push("INSPECTOR NOTES: " + notes);
  return capSummary(lines.join("\n"));
}

export async function POST(request: Request) {
  const access = await getWorkspaceAccess();
  if (!access) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Request origin rejected." }, { status: 403 });
  }

  const raw = await request.text();
  if (raw.length > 100_000) return NextResponse.json({ error: "Inspection summary request is too large." }, { status: 413 });
  let body: { report?: ReportInput };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid summary request." }, { status: 400 });
  }
  const report = body?.report;
  if (!report || typeof report !== "object" || Array.isArray(report) || !Array.isArray(report.items) || report.items.length > 250) {
    return NextResponse.json({ error: "Inspection details are missing or invalid." }, { status: 400 });
  }

  const fallback = summarizeFromFacts(report);
  const key = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  if (!key) return NextResponse.json({ summary: fallback, source: "deterministic" });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Bearer " + key },
      signal: AbortSignal.timeout(15_000),
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 450,
        messages: [
          {
            role: "system",
            content: "Write a customer-facing vehicle inspection description in plain, easy English. Maximum 800 characters including spaces. Use short categorized bullet points with labels RESULT, GOOD CONDITION, ISSUES FOUND, NOT INSPECTED, REASON, NEXT STEP only when relevant. Use only supplied inspector-entered facts. Respect the selected Passed/Rejected/Pending result; explain the reason only from recorded checklist states and notes. If a result conflicts with recorded damage or unchecked components, clearly flag that conflict instead of silently approving it. Never infer hidden damage, accident history, mechanical condition, legal roadworthiness, a cause, or a repair that was not recorded. Do not treat missing photos or unchecked items as passed. Do not invent or exaggerate defects. Be concise and understandable to a non-technical customer. Return only the description, no preamble."
          },
          {
            role: "user",
            content: JSON.stringify({
              vehicle: {
                inspectionType: shortText(report.inspectionType, 80),
                make: shortText(report.make, 80),
                model: shortText(report.model, 80),
                year: shortText(report.vehicleYear, 20),
                colour: shortText(report.vehicleColor, 40),
                registration: shortText(report.registration, 40),
                inspector: shortText(report.inspector, 80),
              },
              selectedResult: shortText(report.verdict, 30) || "Pending",
              score: shortText(report.score, 20),
              scoreLabel: shortText(report.scoreLabel, 80),
              generalNotes: shortText(report.generalNotes, 1200),
              scope: shortText(report.scope, 800),
              checklist: report.items.map((item) => ({
                part: shortText(item.title, 100),
                category: shortText(item.scope, 30),
                status: shortText(item.condition, 40) || "Not inspected",
                damageTypes: Array.isArray(item.damageTypes) ? item.damageTypes.slice(0, 3).map((code) => ({
                  P: "paint or surface damage",
                  B: "panel deformation or change in shape",
                  X: "cut, crack, hole or missing part",
                }[code] || shortText(code, 4))) : [],
                extent: (() => {
                  const level = shortText(item.damageLevel, 5);
                  if (!level) return "";
                  if (item.scope === "Exterior" || item.levelUnit === "inch") {
                    return level === "1" ? "0-2 inches" : level === "2" ? "2-6 inches" : level === "3" ? "6 inches or more" : "";
                  }
                  return level === "1" ? "up to one-quarter of the part" : level === "2" ? "up to one-half of the part" : level === "3" ? "more than one-half of the part" : "";
                })(),
                observation: shortText(item.description, 180),
                inspectorNotes: shortText(item.notes, 180),
                itemScore: shortText(item.score, 12),
                photoAttached: Boolean(item.photoAttached),
              })),
            }),
          },
        ],
      }),
    });
    const result = await response.json().catch(() => null);
    const generated = typeof result?.choices?.[0]?.message?.content === "string" ? result.choices[0].message.content.trim() : "";
    if (!response.ok || !generated) return NextResponse.json({ summary: fallback, source: "deterministic" });
    return NextResponse.json({ summary: capSummary(generated), source: "ai" });
  } catch {
    return NextResponse.json({ summary: fallback, source: "deterministic" });
  }
}

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_BODY_BYTES = 12_000;
const clean = (value: unknown, max = 500) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const forwardedHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && forwardedHost) {
    try {
      if (new URL(origin).host !== forwardedHost) {
        return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 400 });
    }
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return NextResponse.json({ error: "Request is too large." }, { status: 413 });

  let body: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid body");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  // Honeypot: respond normally to automated spam without creating a lead.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true, id: null });

  const requestType = body.requestType === "masterclass" ? "masterclass" : body.requestType === "inspection" ? "inspection" : null;
  const fullName = clean(body.fullName, 120);
  const mobile = clean(body.mobile, 30);
  const digits = mobile.replace(/\D/g, "");
  const email = clean(body.email, 254).toLowerCase();
  const preferredDate = clean(body.preferredDate, 10);
  const vehicleMakeModel = clean(body.vehicleMakeModel, 120);
  const vehicleLocation = clean(body.vehicleLocation, 200);
  const notes = clean(body.notes, 2000);
  const learningGoals = clean(body.learningGoals, 1500);
  const experienceLevel = clean(body.experienceLevel, 80);
  const inspectionType = clean(body.inspectionType, 100);
  const modelYearText = clean(body.modelYear, 4);
  const modelYear = modelYearText ? Number(modelYearText) : null;

  if (!requestType) return NextResponse.json({ error: "Choose an enquiry type." }, { status: 400 });
  if (fullName.length < 2) return NextResponse.json({ error: "Enter your full name." }, { status: 400 });
  if (digits.length < 8 || digits.length > 15) return NextResponse.json({ error: "Enter a valid mobile number." }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate) || Number.isNaN(Date.parse(preferredDate))) {
    return NextResponse.json({ error: "Choose a preferred date." }, { status: 400 });
  }
  if (requestType === "inspection" && (!vehicleMakeModel || !vehicleLocation || !inspectionType)) {
    return NextResponse.json({ error: "Add the vehicle, inspection type and location." }, { status: 400 });
  }
  if (requestType === "masterclass" && !experienceLevel) {
    return NextResponse.json({ error: "Choose your experience level." }, { status: 400 });
  }
  if (modelYear !== null && (!Number.isInteger(modelYear) || modelYear < 1950 || modelYear > new Date().getFullYear() + 1)) {
    return NextResponse.json({ error: "Enter a valid model year." }, { status: 400 });
  }

  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "Enquiry saving is temporarily unavailable. Please contact the team directly." }, { status: 503 });

  const { data, error } = await supabase.from("booking_requests").insert({
    request_type: requestType,
    full_name: fullName,
    mobile,
    email: email || null,
    vehicle_make_model: vehicleMakeModel || null,
    model_year: modelYear,
    inspection_type: inspectionType || null,
    preferred_date: preferredDate,
    vehicle_location: vehicleLocation || null,
    notes: notes || null,
    experience_level: experienceLevel || null,
    learning_goals: learningGoals || null,
    source: "public-website",
  }).select("id,created_at").single();

  if (error || !data) {
    return NextResponse.json({ error: "We could not save your enquiry. Please try again or contact the team." }, { status: 503 });
  }

  return NextResponse.json({ ok: true, id: data.id, createdAt: data.created_at }, { status: 201 });
}

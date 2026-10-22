import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const STAFF_ROLES = ["SUPER_ADMIN", "ORG_ADMIN", "REVIEWER", "INSPECTOR"];

function startsAt(pathname: string, root: string) {
  return pathname === root || pathname.startsWith(root + "/");
}

function isPrivatePage(pathname: string) {
  return [
    "/dashboard", "/inspections", "/reports", "/vehicles", "/customers",
    "/analytics", "/calendar", "/reinspections", "/templates", "/faults", "/scoring",
    "/settings", "/audit", "/inspectors", "/onboarding", "/requests"
  ].some((root) => startsAt(pathname, root));
}

function isPrivateApi(pathname: string) {
  return [
    "/api/me", "/api/inspections", "/api/reports", "/api/vehicle-lookup",
    "/api/ai/summary", "/api/booking-requests"
  ].some((root) => startsAt(pathname, root));
}

function withCookies(source: NextResponse, target: NextResponse) {
  for (const cookie of source.cookies.getAll()) target.cookies.set(cookie.name, cookie.value);
  return target;
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const privatePage = isPrivatePage(pathname);
  const privateApi = isPrivateApi(pathname);
  const privateRequest = privatePage || privateApi;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    if (privateApi) return NextResponse.json({ error: "Staff authentication is not configured." }, { status: 503 });
    if (privatePage) return NextResponse.redirect(new URL("/login?reason=configuration", request.url));
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  if (!privateRequest) {
    await supabase.auth.getClaims();
    return response;
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    if (privateApi) return withCookies(response, NextResponse.json({ error: "Authentication required." }, { status: 401 }));
    const login = new URL("/login", request.url);
    login.searchParams.set("reason", "sign-in");
    login.searchParams.set("next", pathname + request.nextUrl.search);
    return withCookies(response, NextResponse.redirect(login));
  }

  const { data: membership, error: membershipError } = await supabase
    .from("memberships")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .eq("status", "active")
    .in("role", STAFF_ROLES)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    if (privateApi) return withCookies(response, NextResponse.json({ error: "Workspace access could not be verified." }, { status: 503 }));
    return withCookies(response, NextResponse.redirect(new URL("/login?reason=access", request.url)));
  }

  if (!membership?.organization_id) {
    if (privateApi) return withCookies(response, NextResponse.json({ error: "Staff workspace access required." }, { status: 403 }));
    return withCookies(response, NextResponse.redirect(new URL("/login?reason=access", request.url)));
  }

  if (startsAt(pathname, "/requests") && membership.role !== "SUPER_ADMIN" && membership.role !== "ORG_ADMIN") {
    return withCookies(response, NextResponse.redirect(new URL("/dashboard?reason=admin", request.url)));
  }

  return response;
}

import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, adminCookieOptions, adminRpc, hashSessionToken, isValidLoginId, jsonNoStore, normalizeLoginId, readJsonBounded, sameOriginRequest } from "@/lib/admin/admin-portal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOriginRequest(request)) return jsonNoStore({ ok: false, error: "Request rejected." }, 403);
  let body: Record<string, unknown>;
  try { body = await readJsonBounded(request); }
  catch { return jsonNoStore({ ok: false, error: "Enter a valid login ID and password." }, 400); }

  const loginId = String(body.loginId ?? "").trim();
  const password = String(body.password ?? "");
  if (!isValidLoginId(loginId) || password.length < 1 || password.length > 256) {
    return jsonNoStore({ ok: false, error: "Enter a valid login ID and password." }, 400);
  }
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = request.headers.get("x-real-ip") || (forwarded ? forwarded.split(",").pop()?.trim() : "") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const clientHash = createHash("sha256").update(ip + "|" + userAgent, "utf8").digest("hex");

  try {
    const credential = await adminRpc<{ok?:boolean;found?:boolean;rate_limited?:boolean;attempt_id?:string;salt?:string;password_hash?:string}>("login-credential", {
      login_id_normalized: normalizeLoginId(loginId), client_hash: clientHash,
    });
    if (credential.rate_limited) return jsonNoStore({ ok: false, error: "Too many attempts. Wait 15 minutes before trying again." }, 429);
    if (!credential.ok || !credential.attempt_id || !credential.salt || !credential.password_hash) {
      return jsonNoStore({ ok: false, error: "Admin sign-in is temporarily unavailable." }, 503);
    }
    const salt = Buffer.from(credential.salt, "hex");
    const expected = Buffer.from(credential.password_hash, "hex");
    const actual = scryptSync(password, salt, 64);
    const validHash = expected.length === actual.length && timingSafeEqual(actual, expected);
    if (!credential.found || !validHash) {
      await adminRpc("login-fail", { attempt_id: credential.attempt_id });
      return jsonNoStore({ ok: false, error: "The login ID or password is incorrect." }, 401);
    }

    const token = randomBytes(32).toString("hex");
    const session = await adminRpc<{ok?:boolean;login_id?:string;expires_at?:string}>("login-success", {
      attempt_id: credential.attempt_id, login_id_normalized: normalizeLoginId(loginId), session_hash: hashSessionToken(token),
    });
    if (!session.ok || !session.login_id) {
      await adminRpc("login-fail", { attempt_id: credential.attempt_id });
      return jsonNoStore({ ok: false, error: "The sign-in attempt could not be completed. Please retry." }, 401);
    }
    (await cookies()).set(ADMIN_SESSION_COOKIE, token, adminCookieOptions());
    return jsonNoStore({ ok: true, loginId: session.login_id, expiresAt: session.expires_at });
  } catch {
    return jsonNoStore({ ok: false, error: "Admin sign-in is temporarily unavailable. Please try again later." }, 503);
  }
}

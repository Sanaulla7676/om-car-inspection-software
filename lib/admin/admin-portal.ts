import "server-only";

import { createHash, createHmac } from "node:crypto";
import { createClient } from "@/lib/supabase/server";

export const ADMIN_SESSION_COOKIE = "omcar_admin_session";
export const ADMIN_SESSION_SECONDS = 12 * 60 * 60;

export type AdminRpcAction =
  | "login-credential" | "login-fail" | "login-success" | "session"
  | "logout" | "get-config" | "overview" | "otp-store" | "otp-clear"
  | "otp-verify" | "credentials-update";

const RPC_NAMES: Record<AdminRpcAction, string> = {
  "login-credential": "omcar_admin_get_login_credential",
  "login-fail": "omcar_admin_fail_login",
  "login-success": "omcar_admin_create_session",
  session: "omcar_admin_get_session",
  logout: "omcar_admin_end_session",
  "get-config": "omcar_admin_get_config",
  overview: "omcar_admin_overview",
  "otp-store": "omcar_admin_store_otp",
  "otp-clear": "omcar_admin_clear_otp",
  "otp-verify": "omcar_admin_verify_otp",
  "credentials-update": "omcar_admin_update_credentials",
};

export function getAdminRpcSecret(): string {
  const secret = process.env.OMCAR_ADMIN_RPC_SECRET;
  if (!secret || secret.length < 32) throw new Error("Admin portal service is not configured.");
  return secret;
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function hashOtp(sessionHash: string, otp: string): string {
  return createHmac("sha256", getAdminRpcSecret())
    .update(["omcar-admin-otp", sessionHash, otp].join("."))
    .digest("hex");
}

export async function adminRpc<T = Record<string, unknown>>(
  action: AdminRpcAction,
  payload: Record<string, unknown>,
): Promise<T> {
  const supabase = await createClient();
  if (!supabase) throw new Error("Admin portal service is not configured.");
  const payloadText = JSON.stringify(payload);
  const signature = createHmac("sha256", getAdminRpcSecret())
    .update(action + "." + payloadText, "utf8").digest("hex");
  const { data, error } = await supabase.rpc(RPC_NAMES[action], {
    p_payload_text: payloadText, p_signature: signature,
  });
  if (error) {
    console.error("[admin-portal] RPC failed:", action, error.code || "unknown");
    throw new Error("Admin portal request could not be completed.");
  }
  return data as T;
}

export async function readJsonBounded(request: Request, maxBytes = 16 * 1024) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Request body is required.");
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) { await reader.cancel(); throw new Error("Request body is too large."); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const parsed: unknown = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))).toString("utf8");
  const value: unknown = JSON.parse(parsed as string);
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Request body must be an object.");
  return value as Record<string, unknown>;
}

export function sameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (origin) {
    try { if (new URL(origin).origin !== new URL(request.url).origin) return false; }
    catch { return false; }
  }
  return request.headers.get("sec-fetch-site") !== "cross-site";
}

export function adminCookieOptions() {
  return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/", maxAge: ADMIN_SESSION_SECONDS };
}

export function jsonNoStore(body: Record<string, unknown>, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache", "X-Content-Type-Options": "nosniff" } });
}

export function isValidLoginId(value: string) {
  return value.length >= 3 && value.length <= 80 && /[\p{L}\p{N}]/u.test(value);
}
export function normalizeLoginId(value: string) {
  return value.trim().toLocaleLowerCase("en-US").replace(/\s+/g, " ");
}

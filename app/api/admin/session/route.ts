import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, adminRpc, hashSessionToken, jsonNoStore } from "@/lib/admin/admin-portal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return jsonNoStore({ ok: false }, 401);
  try {
    const sessionHash = hashSessionToken(token);
    const session = await adminRpc<{ok?:boolean;login_id?:string;expires_at?:string}>("session", { session_hash: sessionHash });
    if (!session.ok || !session.login_id) {
      cookieStore.set(ADMIN_SESSION_COOKIE, "", { httpOnly:true, secure:process.env.NODE_ENV==="production", sameSite:"strict", path:"/", maxAge:0 });
      return jsonNoStore({ ok: false }, 401);
    }
    const [metrics, config] = await Promise.all([
      adminRpc<Record<string, unknown>>("overview", { session_hash: sessionHash }),
      adminRpc<{ok?:boolean;whatsapp_phone?:string}>("get-config", {}),
    ]);
    const configured = Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_OTP_TEMPLATE);
    const digits = String(config.whatsapp_phone || "918880339999").replace(/\D/g, "");
    return jsonNoStore({
      ok:true,
      admin:{loginId:session.login_id,expiresAt:session.expires_at,whatsappMasked:digits.length>=4?"••••••"+digits.slice(-4):"WhatsApp admin number",whatsappConfigured:configured},
      metrics,
    });
  } catch {
    return jsonNoStore({ ok:false, error:"Admin session could not be verified." }, 503);
  }
}

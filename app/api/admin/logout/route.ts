import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, adminRpc, hashSessionToken, jsonNoStore, sameOriginRequest } from "@/lib/admin/admin-portal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOriginRequest(request)) return jsonNoStore({ok:false,error:"Request rejected."},403);
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) { try { await adminRpc("logout",{session_hash:hashSessionToken(token)}); } catch { /* Clear browser cookie if DB is offline. */ } }
  cookieStore.set(ADMIN_SESSION_COOKIE,"",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:0});
  return jsonNoStore({ok:true});
}

import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, adminRpc, hashOtp, hashSessionToken, jsonNoStore, readJsonBounded, sameOriginRequest } from "@/lib/admin/admin-portal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if(!sameOriginRequest(request))return jsonNoStore({ok:false,error:"Request rejected."},403);
  const token=(await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if(!token)return jsonNoStore({ok:false,error:"Sign in to continue."},401);
  let body:Record<string,unknown>;
  try{body=await readJsonBounded(request,4096);}catch{return jsonNoStore({ok:false,error:"Enter the six-digit code."},400);}
  const otp=String(body.otp??"").trim();
  if(!/^\d{6}$/.test(otp))return jsonNoStore({ok:false,error:"Enter the six-digit code."},400);
  const sessionHash=hashSessionToken(token);
  try{
    const session=await adminRpc<{ok?:boolean}>("session",{session_hash:sessionHash});
    if(!session.ok)return jsonNoStore({ok:false,error:"Your session expired. Sign in again."},401);
    const result=await adminRpc<{ok?:boolean;error?:string}>("otp-verify",{session_hash:sessionHash,otp_hash:hashOtp(sessionHash,otp)});
    if(!result.ok)return jsonNoStore({ok:false,error:result.error||"The code could not be verified."},400);
    return jsonNoStore({ok:true,message:"WhatsApp verification complete. Credentials can now be updated for five minutes."});
  }catch{return jsonNoStore({ok:false,error:"Could not verify the code. Please retry."},503);}
}

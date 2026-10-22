import { randomBytes, scryptSync } from "node:crypto";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, adminRpc, hashSessionToken, isValidLoginId, jsonNoStore, normalizeLoginId, readJsonBounded, sameOriginRequest } from "@/lib/admin/admin-portal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if(!sameOriginRequest(request))return jsonNoStore({ok:false,error:"Request rejected."},403);
  const token=(await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if(!token)return jsonNoStore({ok:false,error:"Sign in to continue."},401);
  let body:Record<string,unknown>;
  try{body=await readJsonBounded(request,8192);}catch{return jsonNoStore({ok:false,error:"Check the login ID and password fields."},400);}
  const loginId=String(body.loginId??"").trim(),password=String(body.newPassword??""),confirmation=String(body.confirmPassword??"");
  if(!isValidLoginId(loginId))return jsonNoStore({ok:false,error:"Login ID must be 3-80 characters and include a letter or number."},400);
  if(password.length<10||password.length>128)return jsonNoStore({ok:false,error:"Use a password between 10 and 128 characters."},400);
  if(password!==confirmation)return jsonNoStore({ok:false,error:"The new password and confirmation do not match."},400);
  if(!/[A-Za-z]/.test(password)||!/[0-9]/.test(password))return jsonNoStore({ok:false,error:"Choose a stronger password with at least one letter and one number."},400);
  const salt=randomBytes(16),passwordHash=scryptSync(password,salt,64).toString("hex");
  try{
    const sessionHash=hashSessionToken(token);
    const result=await adminRpc<{ok?:boolean;login_id?:string;error?:string}>("credentials-update",{
      session_hash:sessionHash,login_id:loginId,login_id_normalized:normalizeLoginId(loginId),
      password_salt:salt.toString("hex"),password_hash:passwordHash,
    });
    if(!result.ok)return jsonNoStore({ok:false,error:result.error||"Credentials could not be updated."},400);
    return jsonNoStore({ok:true,loginId:result.login_id||loginId,message:"Admin login details updated. Use the new login ID and password the next time you sign in."});
  }catch{return jsonNoStore({ok:false,error:"Could not update admin credentials. Please retry."},503);}
}

import { randomInt } from "node:crypto";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, adminRpc, hashOtp, hashSessionToken, jsonNoStore, sameOriginRequest } from "@/lib/admin/admin-portal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOriginRequest(request)) return jsonNoStore({ok:false,error:"Request rejected."},403);
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return jsonNoStore({ok:false,error:"Sign in to continue."},401);
  const accessToken=process.env.WHATSAPP_ACCESS_TOKEN, phoneNumberId=process.env.WHATSAPP_PHONE_NUMBER_ID, templateName=process.env.WHATSAPP_OTP_TEMPLATE;
  const language=process.env.WHATSAPP_OTP_LANGUAGE||"en";
  if(!accessToken||!phoneNumberId||!templateName) return jsonNoStore({ok:false,code:"WHATSAPP_NOT_CONFIGURED",error:"WhatsApp verification is not configured on the server. Add the WhatsApp Cloud API access token, phone-number ID, and an approved OTP template in Vercel settings."},503);
  const sessionHash=hashSessionToken(token);
  try {
    const session=await adminRpc<{ok?:boolean}>("session",{session_hash:sessionHash});
    if(!session.ok)return jsonNoStore({ok:false,error:"Your session expired. Sign in again."},401);
    const config=await adminRpc<{ok?:boolean;whatsapp_phone?:string}>("get-config",{});
    const recipient=String(config.whatsapp_phone||"").replace(/\D/g,"");
    if(!/^\d{10,15}$/.test(recipient))return jsonNoStore({ok:false,error:"The configured WhatsApp destination is invalid."},503);
    const otp=String(randomInt(0,1_000_000)).padStart(6,"0");
    const saved=await adminRpc<{ok?:boolean;rate_limited?:boolean}>("otp-store",{session_hash:sessionHash,otp_hash:hashOtp(sessionHash,otp)});
    if(!saved.ok)return jsonNoStore({ok:false,error:saved.rate_limited?"Wait one minute before requesting another code.":"Could not create a verification code. Please retry."},saved.rate_limited?429:503);
    const version=process.env.WHATSAPP_GRAPH_API_VERSION||"v23.0";
    const endpoint="https://graph.facebook.com/"+version+"/"+encodeURIComponent(phoneNumberId)+"/messages";
    let sent=false;
    try {
      const response=await fetch(endpoint,{method:"POST",cache:"no-store",headers:{Authorization:"Bearer "+accessToken,"Content-Type":"application/json"},body:JSON.stringify({
        messaging_product:"whatsapp",recipient_type:"individual",to:recipient,type:"template",
        template:{name:templateName,language:{code:language},components:[{type:"body",parameters:[{type:"text",text:otp}]}]},
      }),signal:AbortSignal.timeout(10_000)});
      sent=response.ok;
      if(!sent)console.error("[admin-portal] WhatsApp provider rejected the OTP send:",response.status);
    } catch {sent=false;}
    if(!sent){try{await adminRpc("otp-clear",{session_hash:sessionHash});}catch{}return jsonNoStore({ok:false,error:"WhatsApp could not send the code. Check the approved template and Cloud API configuration, then try again."},502);}
    return jsonNoStore({ok:true,expiresInSeconds:600,destination:"WhatsApp ending 9999"});
  } catch {return jsonNoStore({ok:false,error:"Could not start WhatsApp verification."},503);}
}

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.117.2";

Deno.serve(async (req) => {
  const token=(await req.json().catch(()=>({}))).token;
  if(!token) return Response.json({verified:false},{status:400});
  const hash=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(token));
  const hex=[...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("");
  const supabase=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const {data,error}=await supabase.from("reports").select("id,current_version,status,created_at,organizations(name),inspections(inspection_number,vehicles(make,model,registration_number))").eq("verification_token_hash",hex).maybeSingle();
  if(error||!data) return Response.json({verified:false},{status:404});
  return Response.json({verified:true,reportId:data.id,version:data.current_version,status:data.status,createdAt:data.created_at,organization:data.organizations,inspection:data.inspections});
});

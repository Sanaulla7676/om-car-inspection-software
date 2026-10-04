import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.117.2";

Deno.serve(async (req) => {
  const auth = req.headers.get("Authorization");
  if (!auth) return new Response("Unauthorized",{status:401});
  const url = Deno.env.get("SUPABASE_URL")!;
  const key = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabase = createClient(url,key,{global:{headers:{Authorization:auth}}});
  const {data:{user},error}=await supabase.auth.getUser();
  if(error||!user) return new Response("Unauthorized",{status:401});
  const {findings=[],vehicle={},score=0}=await req.json();
  const apiKey=Deno.env.get("OPENAI_API_KEY"); const model=Deno.env.get("OPENAI_MODEL");
  if(!apiKey||!model) return Response.json({source:"deterministic",summary:`Vehicle score: ${score}/100. Recorded findings: ${findings.length}. Review all major or critical observations before purchase or delivery.`});
  const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"content-type":"application/json",authorization:`Bearer ${apiKey}`},body:JSON.stringify({model,messages:[{role:"system",content:"Rewrite only supplied inspection facts. Do not invent findings, measurements, vehicle data, causes, safety conclusions, or recommendations."},{role:"user",content:JSON.stringify({findings,vehicle,score})}],temperature:.2})});
  const j=await r.json(); return Response.json({source:"ai",summary:j?.choices?.[0]?.message?.content ?? "Summary unavailable"});
});

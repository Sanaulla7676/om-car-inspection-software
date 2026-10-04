import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { calculateScore, recommendationForScore } from "@/lib/scoring";
import type { Severity } from "@/lib/types";

function tokenHash(token:string){return createHash("sha256").update(token).digest("hex");}

async function context() {
  const supabase=await createClient();
  if(!supabase) return {supabase:null,userId:"demo",organizationId:"demo-org"};
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return {supabase,userId:null,organizationId:null};
  const {data:m}=await supabase.from("memberships").select("organization_id").eq("user_id",user.id).eq("status","active").order("created_at").limit(1).maybeSingle();
  return {supabase,userId:user.id,organizationId:m?.organization_id??null};
}

export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  const {supabase,userId,organizationId}=await context();
  if(!supabase) return NextResponse.json({ok:true});
  if(!userId||!organizationId) return NextResponse.json({error:"Unauthorized"},{status:401});

  const {data:inspection}=await supabase.from("inspections").select("id,organization_id,inspection_number,vehicle_id,customer_id,inspection_type").eq("id",id).eq("organization_id",organizationId).single();
  if(!inspection) return NextResponse.json({error:"Inspection not found"},{status:404});

  const body=await req.json();
  const payload=body.payload;
  if(body.action==="draft"){
    const {data:existing}=await supabase.from("inspection_drafts").select("version").eq("inspection_id",id).maybeSingle();
    const version=(existing?.version??0)+1;
    const {error}=await supabase.from("inspection_drafts").upsert({inspection_id:id,version,payload,updated_by:userId,updated_at:new Date().toISOString()},{onConflict:"inspection_id"});
    if(error) return NextResponse.json({error:error.message},{status:500});
    await supabase.from("inspections").update({draft_payload:payload,status:"IN_PROGRESS",updated_at:new Date().toISOString()}).eq("id",id);
    return NextResponse.json({ok:true,version});
  }

  if(body.action==="finalize"){
    const findings=(payload.findings??[]).map((f:any)=>({name:f.name,system:f.system,severity:f.severity as Severity,default_description:f.default_description,recommendation:f.recommendation}));
    const scored=calculateScore(findings);
    const recommendation=recommendationForScore(scored.overall,scored.counts.Critical,scored.counts.Major);

    await supabase.from("inspection_item_results").delete().eq("inspection_id",id);
    const rows:any[]=[];
    for(const [section,items] of Object.entries(payload.sections??{})){
      for(const [label,val] of Object.entries(items as Record<string,any>)){
        rows.push({inspection_id:id,item_code:`${section.toUpperCase().slice(0,8)}-${label.toUpperCase().replace(/[^A-Z0-9]+/g,"-").slice(0,28)}`,item_label:label,status:val.status,severity:val.severity,notes:val.notes||null,inspector_id:userId});
      }
    }
    if(rows.length) await supabase.from("inspection_item_results").insert(rows);

    await supabase.from("inspection_findings").delete().eq("inspection_id",id);
    if(findings.length) await supabase.from("inspection_findings").insert(findings.map((f:any)=>({inspection_id:id,system:f.system,title:f.name,severity:f.severity,description:f.default_description,recommendation:f.recommendation??null,status:"OPEN",created_by:userId})));

    await supabase.from("inspection_scores").upsert({
      inspection_id:id,overall_score:scored.overall,recommendation,major_count:scored.counts.Major,minor_count:scored.counts.Minor,
      moderate_count:scored.counts.Moderate,cosmetic_count:scored.counts.Cosmetic,critical_count:scored.counts.Critical,calculated_at:new Date().toISOString()
    },{onConflict:"inspection_id"});

    const snapshot={
      inspection:{id,number:inspection.inspection_number,type:inspection.inspection_type},
      vehicle:payload.vehicle,customer:payload.customer,
      sections:payload.sections,findings,
      score:scored,recommendation,
      testDrive:payload.testDrive,
      photos:payload.photos,
      summary:payload.reviewerComments,
      generatedAt:new Date().toISOString()
    };
    const token=crypto.randomUUID().replace(/-/g,"")+crypto.randomUUID().replace(/-/g,"");
    const hash=tokenHash(token);
    const {data:report,error:reportError}=await supabase.from("reports").upsert({
      organization_id:organizationId,inspection_id:id,current_version:1,status:"READY",verification_token_hash:hash,updated_at:new Date().toISOString()
    },{onConflict:"inspection_id"}).select("id,current_version").single();
    if(reportError||!report) return NextResponse.json({error:reportError?.message??"Could not create report"},{status:500});
    await supabase.from("report_versions").upsert({report_id:report.id,version_number:1,snapshot_json:snapshot,created_by:userId},{onConflict:"report_id,version_number"});

    await supabase.from("inspections").update({draft_payload:payload,status:"COMPLETED",completed_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq("id",id);
    await supabase.from("audit_logs").insert({organization_id:organizationId,actor_id:userId,action:"generated report",entity_type:"inspection",entity_id:id,after_data:{score:scored.overall,recommendation,report_id:report.id}});
    return NextResponse.json({ok:true,reportId:report.id,verificationToken:token,score:scored.overall});
  }

  return NextResponse.json({error:"Unknown action"},{status:400});
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function getContext() {
  const supabase=await createClient();
  if(!supabase) return {supabase:null,userId:"demo",organizationId:"demo-org",role:"ORG_ADMIN"};
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return {supabase,userId:null,organizationId:null,role:null};
  const {data:m}=await supabase.from("memberships").select("organization_id,role").eq("user_id",user.id).eq("status","active").order("created_at").limit(1).maybeSingle();
  return {supabase,userId:user.id,organizationId:m?.organization_id??null,role:m?.role??null};
}

export async function GET() {
  const {supabase,organizationId}=await getContext();
  if(!supabase) return NextResponse.json([]);
  if(!organizationId) return NextResponse.json({error:"No organization"},{status:409});
  const {data,error}=await supabase.from("inspections").select("*,vehicles(make,model,registration_number),customers(name),inspection_scores(overall_score)").eq("organization_id",organizationId).order("created_at",{ascending:false}).limit(100);
  if(error) return NextResponse.json({error:error.message},{status:500});
  return NextResponse.json(data??[]);
}

export async function POST(req:Request) {
  const {supabase,userId,organizationId}=await getContext();
  if(!supabase) return NextResponse.json({id:"demo-"+Date.now(),inspectionNumber:"DEMO-"+Date.now()});
  if(!userId||!organizationId) return NextResponse.json({error:"Create an organization first."},{status:409});
  const body=await req.json();
  const d=body.draft;
  if(!d?.vehicle?.registration) return NextResponse.json({error:"Registration number is required."},{status:400});

  let {data:vehicle,error:vehicleError}=await supabase.from("vehicles").upsert({
    organization_id:organizationId,
    registration_number:d.vehicle.registration.trim().toUpperCase(),
    vin:d.vehicle.vin||null,
    chassis_number:d.vehicle.vin||null,
    make:d.vehicle.make||null, model:d.vehicle.model||null, variant:d.vehicle.variant||null,
    manufacturing_year:d.vehicle.year?Number(d.vehicle.year):null,
    fuel_type:d.vehicle.fuel||null, transmission:d.vehicle.transmission||null,
    color:d.vehicle.color||null, odometer:d.vehicle.odometer?Number(d.vehicle.odometer):null,
    engine_number:d.vehicle.engineNumber||null
  },{onConflict:"organization_id,registration_number"}).select("id").single();
  if(vehicleError||!vehicle) return NextResponse.json({error:vehicleError?.message??"Vehicle could not be saved"},{status:500});

  let customerId:string|null=null;
  if(d.customer?.name) {
    const {data:existing}=await supabase.from("customers").select("id").eq("organization_id",organizationId).eq("phone",d.customer.phone||"").eq("name",d.customer.name).limit(1).maybeSingle();
    if(existing) customerId=existing.id;
    else {
      const {data:c,error}=await supabase.from("customers").insert({organization_id:organizationId,name:d.customer.name,phone:d.customer.phone||null,email:d.customer.email||null,customer_type:d.customer.type||"Buyer"}).select("id").single();
      if(error) return NextResponse.json({error:error.message},{status:500}); customerId=c.id;
    }
  }

  const inspectionNumber=d.inspectionNumber || `INS-${new Date().getFullYear()}-${String(Date.now()).slice(-7)}`;
  const {data:inspection,error}=await supabase.from("inspections").insert({
    organization_id:organizationId,inspection_number:inspectionNumber,vehicle_id:vehicle.id,customer_id:customerId,
    inspector_id:userId,inspection_type:d.inspectionType||"Used Car",status:"IN_PROGRESS",priority:"Normal",started_at:new Date().toISOString(),draft_payload:d
  }).select("id,inspection_number").single();
  if(error||!inspection) return NextResponse.json({error:error?.message??"Inspection could not be created"},{status:500});

  await supabase.from("inspection_drafts").upsert({organization_id:organizationId,inspection_id:inspection.id,version:1,payload:d,updated_by:userId,updated_at:new Date().toISOString()},{onConflict:"inspection_id"});
  await supabase.from("audit_logs").insert({organization_id:organizationId,actor_id:userId,action:"created inspection",entity_type:"inspection",entity_id:inspection.id,after_data:{inspection_number:inspectionNumber}});
  return NextResponse.json({id:inspection.id,inspectionNumber:inspection.inspection_number});
}

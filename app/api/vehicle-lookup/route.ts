import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type LookupData = Record<string, unknown>;

function normalizeText(value: unknown){ return typeof value==="string" ? value.trim() : value==null ? "" : String(value).trim(); }
function first(data:LookupData, keys:string[]){ for(const key of keys){const v=data[key];if(v!==undefined&&v!==null&&normalizeText(v)!=="")return v;} return ""; }

async function context(){
  const supabase=await createClient();
  if(!supabase)return {supabase:null,userId:"demo",organizationId:"demo-org"};
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)return {supabase,userId:null,organizationId:null};
  const {data:m}=await supabase.from("memberships").select("organization_id").eq("user_id",user.id).eq("status","active").order("created_at").limit(1).maybeSingle();
  return {supabase,userId:user.id,organizationId:m?.organization_id??null};
}

function normalizeResponse(root:LookupData){
  const d=(root.data&&typeof root.data==="object"&&!Array.isArray(root.data)?root.data:root) as LookupData;
  const raw=(d.result&&typeof d.result==="object"&&!Array.isArray(d.result)?d.result:d) as LookupData;
  const makerModel=normalizeText(first(raw,["maker_model","makerModel","vehicle_model","model","vehicle_type"]));
  const parts=makerModel.split(/\s+/);
  return {
    registration:normalizeText(first(raw,["rc_number","registration_number","registration","vehicle_number"])),
    vin:normalizeText(first(raw,["vehicle_chasi_number","chassis_number","chassis_no","vin","chassis"])),
    engineNumber:normalizeText(first(raw,["vehicle_engine_number","engine_number","engine_no","engineNumber"])),
    make:normalizeText(first(raw,["maker_description","manufacturer","manufacturer_name","make","vehicle_make"])) || parts[0] || "",
    model:normalizeText(first(raw,["maker_model","model","vehicle_model"])) || (parts.slice(1).join(" ") || ""),
    variant:normalizeText(first(raw,["variant","vehicle_variant","model_variant"])),
    year:normalizeText(first(raw,["manufacturing_year","manufacture_year","mfg_year","year_of_manufacture"])),
    registrationDate:normalizeText(first(raw,["registration_date","date_of_registration","reg_date"])),
    fuel:normalizeText(first(raw,["fuel_type","fuel"])),
    color:normalizeText(first(raw,["color","vehicle_color"])),
    transmission:normalizeText(first(raw,["transmission","gear_type"])),
    category:normalizeText(first(raw,["vehicle_category_description","vehicle_category","vehicle_class"])),
    bodyType:normalizeText(first(raw,["body_type","body"])),
    emissionNorm:normalizeText(first(raw,["norms_type","emission_norm","emission_norms"])),
    fitnessValidUntil:normalizeText(first(raw,["fit_up_to","fitness_valid_until","fitness_upto"])),
    insuranceValidUntil:normalizeText(first(raw,["insurance_upto","insurance_valid_until","insurance_expiry"])),
    puccValidUntil:normalizeText(first(raw,["pucc_upto","pucc_valid_until","puc_upto"])),
    permitValidUntil:normalizeText(first(raw,["permit_valid_from","permit_upto","permit_valid_until"])),
    rcStatus:normalizeText(first(raw,["rc_status","registration_status","status"])),
    blacklistStatus:normalizeText(first(raw,["blacklist_status","blacklist"])),
    financer:normalizeText(first(raw,["financer","financier","financer_name"])),
    ownerName:normalizeText(first(raw,["owner_name","owner","registered_owner"])),
    ownerCount:normalizeText(first(raw,["owner_number","ownership_count","owner_count"])),
    raw:raw
  };
}

export async function POST(req:Request){
  const {supabase,userId,organizationId}=await context();
  if(!supabase)return NextResponse.json({error:"Vehicle lookup is not configured in demo mode."},{status:503});
  if(!userId||!organizationId)return NextResponse.json({error:"Unauthorized"},{status:401});

  const body=await req.json().catch(()=>({}));
  const chassis=normalizeText(body.chassis_number).toUpperCase().replace(/\s+/g,"");
  const engineNumber=normalizeText(body.engine_number).toUpperCase().replace(/\s+/g,"");
  if(chassis.length<6||chassis.length>32)return NextResponse.json({error:"Enter a valid chassis/VIN number."},{status:400});

  const provider=(process.env.VEHICLE_LOOKUP_PROVIDER||"decentro").toLowerCase();
  let endpoint=process.env.VEHICLE_LOOKUP_URL||"https://in.decentro.tech/v2/bytes/converter/chassis/rc";
  const referenceId=`OM-${Date.now()}-${crypto.randomUUID().slice(0,8)}`;
  const purpose="Vehicle inspection and report preparation using customer-provided chassis number.";
  let payload:LookupData={reference_id:referenceId,consent:true,purpose,id:chassis};

  if(provider==="surepass"){
    endpoint=process.env.VEHICLE_LOOKUP_URL||"https://kyc-api.surepass.app/api/v1/rc/chassis-engine-to-rc";
    if(!engineNumber)return NextResponse.json({error:"This Surepass adapter requires the engine number too. Configure the chassis-only provider or enter the engine number."},{status:400});
    payload={chassis_number:chassis,engine_number:engineNumber};
  }

  const headers:Record<string,string>={"content-type":"application/json"};
  if(provider==="decentro"){headers.client_id=process.env.DECENTRO_CLIENT_ID||"";headers.client_secret=process.env.DECENTRO_CLIENT_SECRET||""}
  else if(provider==="surepass")headers.authorization=`Bearer ${process.env.SUREPASS_API_KEY||""}`;
  else if(process.env.VEHICLE_LOOKUP_API_KEY)headers.authorization=`Bearer ${process.env.VEHICLE_LOOKUP_API_KEY}`;

  if(Object.values(headers).some(v=>!v))return NextResponse.json({error:"Vehicle lookup provider credentials are not configured. Add the provider credentials in Vercel environment variables."},{status:503});

  let upstream:Response;
  try{
    upstream=await fetch(endpoint,{method:"POST",headers,body:JSON.stringify(payload),cache:"no-store"});
  }catch{
    return NextResponse.json({error:"Vehicle registry is temporarily unreachable. You can continue with manual vehicle entry."},{status:502});
  }

  const result=await upstream.json().catch(()=>({}));
  if(!upstream.ok||result?.success===false||result?.status_code&&Number(result.status_code)>=400){
    await supabase.from("vehicle_lookup_logs").insert({organization_id:organizationId,provider,request:{chassis_number:chassis,has_engine_number:Boolean(engineNumber)},response_summary:{message:result?.message||"Lookup failed",status_code:result?.status_code||upstream.status},status:"FAILED",requested_by:userId});
    return NextResponse.json({error:normalizeText(result?.message)||"No vehicle was found for that chassis number."},{status:422});
  }

  const normalized=normalizeResponse(result);
  const vehiclePayload={
    organization_id:organizationId,
    registration_number:(normalized.registration||`UNKNOWN-${chassis.slice(-8)}`).toUpperCase(),
    vin:normalized.vin||chassis,
    chassis_number:normalized.vin||chassis,
    engine_number:normalized.engineNumber||engineNumber||null,
    make:normalized.make||null,model:normalized.model||null,variant:normalized.variant||null,
    manufacturing_year:normalized.year&&/^\d{4}$/.test(normalized.year)?Number(normalized.year):null,
    fuel_type:normalized.fuel||null,transmission:normalized.transmission||null,color:normalized.color||null,
    metadata:{registry_provider:provider,registry_client_id:(result?.data&&typeof result.data==="object"?(result.data as LookupData).client_id:null),registration_date:normalized.registrationDate,category:normalized.category,body_type:normalized.bodyType,emission_norm:normalized.emissionNorm,fitness_valid_until:normalized.fitnessValidUntil,insurance_valid_until:normalized.insuranceValidUntil,pucc_valid_until:normalized.puccValidUntil,permit_valid_until:normalized.permitValidUntil,rc_status:normalized.rcStatus,blacklist_status:normalized.blacklistStatus,financer:normalized.financer,owner_name:normalized.ownerName,owner_count:normalized.ownerCount,fetched_at:new Date().toISOString()}
  };

  let vehicleId:string|null=null;
  const {data:vehicle}=await supabase.from("vehicles").upsert(vehiclePayload,{onConflict:"organization_id,registration_number"}).select("id").maybeSingle();
  vehicleId=vehicle?.id??null;

  await supabase.from("vehicle_lookup_logs").insert({organization_id:organizationId,vehicle_id:vehicleId,provider,request:{chassis_number:chassis,has_engine_number:Boolean(engineNumber)},response_summary:{registration:normalized.registration,vin:normalized.vin,make:normalized.make,model:normalized.model,variant:normalized.variant,year:normalized.year,fuel:normalized.fuel,insurance_valid_until:normalized.insuranceValidUntil,pucc_valid_until:normalized.puccValidUntil,fitness_valid_until:normalized.fitnessValidUntil,rc_status:normalized.rcStatus,blacklist_status:normalized.blacklistStatus},status:"SUCCESS",requested_by:userId});

  return NextResponse.json({success:true,provider,vehicleId,data:normalized});
}

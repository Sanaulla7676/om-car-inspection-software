import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(){
  const supabase=await createClient();
  if(!supabase)return NextResponse.json([]);
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
  const {data:m}=await supabase.from("memberships").select("organization_id").eq("user_id",user.id).eq("status","active").order("created_at").limit(1).maybeSingle();
  if(!m?.organization_id)return NextResponse.json({error:"No organization"},{status:409});
  const {data,error}=await supabase.from("reports").select("id,inspection_id,current_version,status,share_count,created_at,updated_at,inspections(inspection_number,inspection_type,vehicles(make,model,registration_number),customers(name))").eq("organization_id",m.organization_id).order("created_at",{ascending:false}).limit(100);
  if(error)return NextResponse.json({error:error.message},{status:500});
  return NextResponse.json(data??[]);
}

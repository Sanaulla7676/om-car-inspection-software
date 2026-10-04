import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ user:{id:"demo",name:"Demo Inspector"}, organization:{id:"demo-org",name:"OM Car Inspection"}, demo:true });
  const { data:{ user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error:"Unauthorized" },{status:401});

  const { data: membership } = await supabase
    .from("memberships")
    .select("organization_id, role, organizations(id,name,logo_url,timezone)")
    .eq("user_id",user.id).eq("status","active").order("created_at").limit(1).maybeSingle();

  const organization = membership?.organizations ?? null;
  return NextResponse.json({
    user:{id:user.id,name:user.user_metadata?.full_name ?? user.email ?? "User",email:user.email},
    organization,
    role:membership?.role ?? null,
  });
}

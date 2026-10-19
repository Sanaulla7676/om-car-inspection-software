import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/supabase/authorization";

export async function GET() {
  const context = await getAdminContext();
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status });

  const { data: memberships, error } = await context.supabase
    .from("memberships")
    .select("id,user_id,role,status,branch_id,created_at")
    .eq("organization_id", context.organizationId)
    .order("created_at", { ascending: true })
    .limit(250);

  if (error) return NextResponse.json({ error: "Team members could not be loaded." }, { status: 503 });
  const userIds = (memberships ?? []).map(member => member.user_id);
  const { data: profiles, error: profileError } = userIds.length
    ? await context.supabase.from("profiles").select("id,full_name,phone,avatar_url").in("id", userIds)
    : { data: [], error: null };

  if (profileError) return NextResponse.json({ error: "Team profiles could not be loaded." }, { status: 503 });
  const profileById = new Map((profiles ?? []).map(profile => [profile.id, profile]));
  return NextResponse.json((memberships ?? []).map(member => ({
    ...member,
    profile: profileById.get(member.user_id) ?? null,
    isCurrentUser: member.user_id === context.userId,
  })));
}

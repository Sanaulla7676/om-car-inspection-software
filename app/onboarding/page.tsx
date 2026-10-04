"use client";

import { FormEvent, useState } from "react";
import { Building2, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const supabase = createClient();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) { window.location.href = "/dashboard"; return; }
    setSaving(true); setMessage("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }

    const { data: org, error: orgError } = await supabase.from("organizations").insert({ name }).select("id").single();
    if (orgError || !org) { setMessage(orgError?.message ?? "Could not create organization"); setSaving(false); return; }

    const { error } = await supabase.from("memberships").insert({ organization_id: org.id, user_id: user.id, role: "ORG_ADMIN", status: "active" });
    if (error) setMessage(error.message);
    else { setMessage("Organization created. Redirecting…"); window.location.href = "/dashboard"; }
    setSaving(false);
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="card w-full max-w-xl">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100"><Building2 /></div>
        <h1 className="mt-5 text-3xl font-black">Create your inspection organization</h1>
        <p className="mt-2 text-slate-500">This becomes the tenant boundary for your data, users, reports and evidence.</p>
        <form onSubmit={submit} className="mt-8">
          <div className="field"><label>Company / Organization name</label><input value={name} onChange={e=>setName(e.target.value)} required placeholder="OM Car Inspection" /></div>
          {message && <div className="p-3 rounded-xl bg-slate-50 border text-sm">{message}</div>}
          <button className="btn primary mt-3 flex items-center gap-2" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={16}/> : <CheckCircle2 size={16}/>} Create organization</button>
        </form>
      </div>
    </main>
  );
}

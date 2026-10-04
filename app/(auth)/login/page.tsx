"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, CarFront, Loader2 } from "lucide-react";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) setMessage("Demo mode: configure Supabase to enable authentication.");
  }, [supabase]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!supabase) {
      window.location.href = "/dashboard";
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else window.location.href = "/dashboard";
    setLoading(false);
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 overflow-hidden rounded-3xl border bg-white shadow-2xl">
        <section className="hidden md:flex bg-[#0f172a] text-white p-10 flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="brand-mark">OM</div>
              <div><div className="font-extrabold text-lg">OM Car Inspection</div><div className="text-slate-400 text-sm">Inspection Operations</div></div>
            </div>
            <div className="mt-16">
              <div className="text-4xl font-black tracking-tight">Inspect faster.<br/>Prove everything.</div>
              <p className="mt-5 text-slate-300 leading-7">Offline-first vehicle inspection software with evidence capture, deterministic scoring, versioned reports and secure customer verification.</p>
            </div>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-2"><ShieldCheck size={15}/> RLS-protected • Audit-ready • Offline capable</div>
        </section>
        <section className="p-8 md:p-12">
          <div className="md:hidden flex items-center gap-3 mb-10">
            <div className="brand-mark">OM</div><div><div className="font-extrabold">OM Car Inspection</div><div className="label">Inspection Operations</div></div>
          </div>
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100"><CarFront size={21}/></div>
          <h1 className="mt-5 text-3xl font-black">Welcome back</h1>
          <p className="mt-2 text-slate-500">Sign in to your inspection workspace.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="field">
              <label>Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required placeholder="you@company.com" />
            </div>
            <div className="field">
              <label>Password</label>
              <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required placeholder="••••••••" />
            </div>
            {message && <div className="p-3 rounded-xl bg-slate-50 border text-sm text-slate-600">{message}</div>}
            <button className="btn primary w-full flex justify-center items-center gap-2" disabled={loading}>
              {loading && <Loader2 className="animate-spin" size={16}/>} Sign in
            </button>
          </form>

          <div className="mt-7 p-4 rounded-2xl border bg-slate-50 text-xs text-slate-500">
            First deployment? Create a user in Supabase Auth, then open <strong>/onboarding</strong> to create your organization.
          </div>
        </section>
      </div>
    </main>
  );
}

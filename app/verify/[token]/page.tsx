"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";

export default function VerifyPage({params}:{params:Promise<{token:string}>}) {
  const [data,setData]=useState<any>(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{params.then(p=>fetch("/api/verify/"+p.token)).then(r=>r.json()).then(setData).finally(()=>setLoading(false));},[params]);
  return <main className="min-h-screen grid place-items-center p-6"><div className="card w-full max-w-xl text-center">
    {loading ? <div>Checking verification…</div> : data?.verified ? <><CheckCircle2 size={48} className="mx-auto text-emerald-600"/><h1 className="text-3xl font-black mt-4">Report verified</h1><p className="text-slate-500 mt-2">{data.inspection?.inspection_number} • Version {data.version}</p><div className="mt-5 p-4 rounded-xl bg-slate-50 border text-left text-sm"><strong>{data.organization?.name}</strong><div className="text-slate-500 mt-1">{[data.inspection?.vehicles?.make,data.inspection?.vehicles?.model].filter(Boolean).join(" ")} • {data.inspection?.vehicles?.registration_number}</div></div></> : <><ShieldAlert size={48} className="mx-auto text-amber-600"/><h1 className="text-3xl font-black mt-4">Verification failed</h1><p className="text-slate-500 mt-2">The supplied report token could not be verified.</p></>}
  </div></main>;
}

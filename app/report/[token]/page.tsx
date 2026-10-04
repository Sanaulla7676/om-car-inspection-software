"use client";
import {useEffect,useState} from "react";
import {CheckCircle2,Download,ShieldCheck} from "lucide-react";

export default function CustomerReportPage({params}:{params:Promise<{token:string}>}){
 const[token,setToken]=useState("");const[data,setData]=useState<any>(null);const[loading,setLoading]=useState(true);
 useEffect(()=>{params.then(p=>{setToken(p.token);return fetch("/api/verify/"+p.token)}).then(r=>r?.json()).then(setData).finally(()=>setLoading(false))},[params]);
 if(loading)return <main className="min-h-screen grid place-items-center"><div className="card">Loading secure report…</div></main>;
 if(!data?.verified)return <main className="min-h-screen grid place-items-center p-6"><div className="card max-w-lg text-center"><ShieldCheck size={42} className="mx-auto text-slate-400"/><h1 className="text-2xl font-black mt-4">Report not found</h1><p className="text-slate-500 mt-2">This verification link is invalid or revoked.</p></div></main>;
 const vehicle=data.inspection?.vehicles;
 return <main className="min-h-screen p-5 md:p-10"><div className="max-w-4xl mx-auto report-page">
  <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4"><div><div className="text-2xl font-black">OM Car Inspection</div><div className="text-slate-500">Secure vehicle inspection report</div></div><div className="text-right"><span className="chip success"><CheckCircle2 size={14}/> Verified</span><div className="label mt-2">Version {data.version}</div></div></div>
  <div className="grid md:grid-cols-3 gap-3 mt-6"><div className="report-box"><small>Inspection</small><strong>{data.inspection?.inspection_number}</strong></div><div className="report-box"><small>Vehicle</small><strong>{[vehicle?.make,vehicle?.model].filter(Boolean).join(" ")||"—"}</strong></div><div className="report-box"><small>Registration</small><strong>{vehicle?.registration_number||"—"}</strong></div></div>
  <div className="mt-7 p-5 rounded-2xl bg-slate-900 text-white"><div className="text-sm text-slate-300">Report status</div><div className="text-3xl font-black mt-1">{data.status}</div><div className="text-slate-300 mt-2">Generated {new Date(data.createdAt).toLocaleString("en-IN")}</div></div>
  <div className="mt-7 text-sm text-slate-500">This public verification page intentionally exposes limited report metadata. Customer-sensitive data remains protected.</div>
  <a className="btn gold inline-flex items-center gap-2 mt-5" href={"/api/public-reports/"+token+"/pdf"}><Download size={15}/> Download PDF</a>
 </div></main>;
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Plus, RefreshCw } from "lucide-react";

type Row = {
  id: string; inspection_number: string; inspection_type: string; status: string; created_at: string;
  vehicles?: { make?: string; model?: string; registration_number?: string } | null;
  customers?: { name?: string } | null;
  inspection_scores?: { overall_score: number }[] | { overall_score: number } | null;
};

export default function InspectionsPage() {
  const [rows,setRows]=useState<Row[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
  async function load(){
    setLoading(true);setError("");
    try{const res=await fetch("/api/inspections",{cache:"no-store"});const data=await res.json().catch(()=>null);if(!res.ok)throw new Error(data?.error||"Inspections could not be loaded.");setRows(Array.isArray(data)?data:[])}
    catch(e){setError(e instanceof Error?e.message:"Inspections could not be loaded.")}finally{setLoading(false)}
  }
  useEffect(()=>{void load()},[]);
  return <AppShell module="inspections"><div className="page">
    <div className="section-title"><div><h2>Inspection records</h2><p>Live records from your workspace. No sample vehicles or invented inspection history.</p></div><div className="btn-row"><button className="btn" onClick={()=>void load()} disabled={loading}><RefreshCw size={14}/> Refresh</button><Link href="/inspections/new" className="btn primary"><Plus size={14}/> New inspection</Link></div></div>
    {error&&<p role="alert" className="error-message">{error}</p>}
    <div className="card"><div className="table-wrap"><table><thead><tr><th>Inspection</th><th>Vehicle</th><th>Customer</th><th>Type</th><th>Status</th><th>Score</th><th>Created</th></tr></thead><tbody>
      {rows.map(row=>{const score=Array.isArray(row.inspection_scores)?row.inspection_scores[0]?.overall_score:row.inspection_scores?.overall_score;return <tr key={row.id}><td><strong>{row.inspection_number}</strong><div className="label">{row.id.slice(0,8).toUpperCase()}</div></td><td>{[row.vehicles?.make,row.vehicles?.model].filter(Boolean).join(" ")||"Vehicle pending"}<div className="label">{row.vehicles?.registration_number||"Registration pending"}</div></td><td>{row.customers?.name||"—"}</td><td>{row.inspection_type}</td><td><span className={row.status==="COMPLETED"?"chip success":row.status==="IN_PROGRESS"?"chip info":"chip"}>{row.status.replaceAll("_"," ")}</span></td><td>{typeof score==="number"?score:"—"}</td><td>{new Date(row.created_at).toLocaleDateString("en-IN")}</td></tr>})}
      {!loading&&rows.length===0&&<tr><td colSpan={7}>No inspections recorded yet. Start a new inspection to create the first record.</td></tr>}
      {loading&&<tr><td colSpan={7}>Loading live inspection records…</td></tr>}
    </tbody></table></div></div>
  </div></AppShell>;
}

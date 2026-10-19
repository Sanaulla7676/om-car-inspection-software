"use client";

import { useEffect,useState } from "react";
import { AppShell } from "@/components/app-shell";
import { RefreshCw } from "lucide-react";

type Fault={id:string;code?:string|null;system:string;name:string;severity:string;default_description?:string|null;recommendation?:string|null;photo_required:boolean};
export default function FaultsPage(){const [rows,setRows]=useState<Fault[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
async function load(){setLoading(true);setError("");try{const r=await fetch("/api/faults",{cache:"no-store"});const d=await r.json().catch(()=>null);if(!r.ok)throw new Error(d?.error||"Fault library could not be loaded.");setRows(Array.isArray(d)?d:[])}catch(e){setError(e instanceof Error?e.message:"Fault library could not be loaded.")}finally{setLoading(false)}}
useEffect(()=>{void load()},[]);
return <AppShell module="faults"><div className="page"><div className="section-title"><div><h2>Fault library</h2><p>Published fault definitions from the live database.</p></div><button className="btn" onClick={()=>void load()} disabled={loading}><RefreshCw size={14}/> Refresh</button></div>{error&&<p role="alert" className="error-message">{error}</p>}<div className="card"><div className="table-wrap"><table><thead><tr><th>Code</th><th>Fault</th><th>System</th><th>Severity</th><th>Photo evidence</th><th>Recommendation</th></tr></thead><tbody>{rows.map(f=><tr key={f.id}><td>{f.code||"—"}</td><td><strong>{f.name}</strong><div className="label">{f.default_description||""}</div></td><td>{f.system}</td><td><span className={f.severity==="Critical"||f.severity==="Major"?"chip danger":"chip"}>{f.severity}</span></td><td>{f.photo_required?"Required":"Recommended"}</td><td>{f.recommendation||"—"}</td></tr>)}{!loading&&rows.length===0&&<tr><td colSpan={6}>No active fault definitions are available.</td></tr>}{loading&&<tr><td colSpan={6}>Loading fault definitions…</td></tr>}</tbody></table></div></div></div></AppShell>}

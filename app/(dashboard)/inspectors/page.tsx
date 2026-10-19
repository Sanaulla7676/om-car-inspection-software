"use client";

import { useEffect,useState } from "react";
import { AppShell } from "@/components/app-shell";
import { RefreshCw,ShieldCheck } from "lucide-react";

type Member={id:string;user_id:string;role:string;status:string;created_at:string;profile?:{full_name?:string|null;phone?:string|null;avatar_url?:string|null}|null;isCurrentUser?:boolean};
export default function InspectorsPage(){const [rows,setRows]=useState<Member[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
async function load(){setLoading(true);setError("");try{const r=await fetch("/api/inspectors",{cache:"no-store"});const d=await r.json().catch(()=>null);if(!r.ok)throw new Error(d?.error||"Team members could not be loaded.");setRows(Array.isArray(d)?d:[])}catch(e){setError(e instanceof Error?e.message:"Team members could not be loaded.")}finally{setLoading(false)}}
useEffect(()=>{void load()},[]);
return <AppShell module="inspectors"><div className="page"><div className="section-title"><div><h2>Team & access</h2><p>Current workspace memberships and assigned roles. Invitations are managed by an administrator.</p></div><button className="btn" onClick={()=>void load()} disabled={loading}><RefreshCw size={14}/> Refresh</button></div>{error&&<p role="alert" className="error-message">{error}</p>}<div className="card"><div className="table-wrap"><table><thead><tr><th>Team member</th><th>Role</th><th>Status</th><th>Added</th></tr></thead><tbody>{rows.map(m=><tr key={m.id}><td><strong>{m.profile?.full_name||"Workspace member"}</strong>{m.isCurrentUser&&<div className="label">Current account</div>}{m.profile?.phone&&<div className="label">{m.profile.phone}</div>}</td><td><span className="chip"><ShieldCheck size={12}/>{m.role.replaceAll("_"," ")}</span></td><td><span className={m.status==="active"?"chip success":"chip warn"}>{m.status}</span></td><td>{new Date(m.created_at).toLocaleDateString("en-IN")}</td></tr>)}{!loading&&rows.length===0&&<tr><td colSpan={4}>No workspace members found.</td></tr>}{loading&&<tr><td colSpan={4}>Loading workspace members…</td></tr>}</tbody></table></div></div></div></AppShell>}

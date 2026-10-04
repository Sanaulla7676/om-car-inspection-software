"use client";

import { useEffect,useState } from "react";
import Link from "next/link";
import { Download,FileText,Merge,Plus,QrCode,RefreshCw,Share2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";

type ReportRow={id:string;inspection_id:string;current_version:number;status:string;share_count:number;created_at:string;inspections?:{inspection_number?:string;inspection_type?:string;vehicles?:{make?:string;model?:string;registration_number?:string}|null;customers?:{name?:string}|null}|null};

export default function ReportsPage(){return <AppShell module="reports"><ReportsWorkspace/></AppShell>}

function ReportsWorkspace(){
 const [rows,setRows]=useState<ReportRow[]>([]),[loading,setLoading]=useState(true);
 useEffect(()=>{fetch("/api/reports").then(r=>r.ok?r.json():[]).then(d=>setRows(Array.isArray(d)?d:[])).catch(()=>setRows([])).finally(()=>setLoading(false))},[]);
 return <div className="page">
  <div className="section-title"><div><h2>Reports</h2><p>Versioned inspection packages with evidence, verification and supporting-document merge.</p></div><div className="btn-row"><Link href="/reports/merge" className="btn gold"><Merge size={15}/> PDF Studio</Link><Link href="/inspections/new" className="btn primary"><Plus size={15}/> New inspection</Link></div></div>
  <div className="grid grid-3 mb-4">
   <div className="card stat"><div><div className="label">Reports ready</div><div className="num">{rows.filter(r=>r.status==="READY").length}</div></div><span className="chip success">Ready</span></div>
   <div className="card stat"><div><div className="label">Versions</div><div className="num">{rows.reduce((n,r)=>n+r.current_version,0)}</div></div><span className="chip info"><QrCode size={13}/> Verified</span></div>
   <div className="card stat"><div><div className="label">Shared</div><div className="num">{rows.reduce((n,r)=>n+(r.share_count||0),0)}</div></div><span className="chip"><Share2 size={12}/> Delivery</span></div>
  </div>
  <div className="card"><div className="section-title"><div><h2 className="text-lg font-bold">Inspection reports</h2><p>Print PDF includes every synced image attached to the inspection.</p></div><button className="btn" onClick={()=>location.reload()}><RefreshCw size={14}/> Refresh</button></div>
   <div className="table-wrap"><table><thead><tr><th>Report</th><th>Vehicle</th><th>Customer</th><th>Version</th><th>Generated</th><th>Status</th><th>Actions</th></tr></thead><tbody>
    {rows.map(r=>{const i=r.inspections,v=i?.vehicles;return <tr key={r.id}><td><strong>{i?.inspection_number||r.inspection_id}</strong><div className="label">{i?.inspection_type||"Inspection report"}</div></td><td>{[v?.make,v?.model].filter(Boolean).join(" ")||"Vehicle"}<div className="label">{v?.registration_number||"Registration pending"}</div></td><td>{i?.customers?.name||"—"}</td><td>v{r.current_version}</td><td>{new Date(r.created_at).toLocaleString("en-IN")}</td><td><span className={r.status==="READY"?"chip success":"chip"}>{r.status}</span></td><td><div className="btn-row"><a className="btn" href={`/api/reports/${r.id}/pdf`}><Download size={13}/> Print PDF</a><Link className="btn" href={`/reports/merge?report=${r.id}`}><Merge size={13}/> Merge</Link><button className="btn" onClick={()=>navigator.clipboard?.writeText(r.id)}><FileText size={13}/> Copy ID</button></div></td></tr>})}
   </tbody></table>{loading&&<div className="empty">Loading reports…</div>}{!loading&&!rows.length&&<div className="empty">No published reports yet. Complete an inspection to create the first one.</div>}</div>
  </div>
 </div>
}

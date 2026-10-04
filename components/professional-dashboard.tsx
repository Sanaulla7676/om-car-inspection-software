"use client";

import { useEffect,useState } from "react";
import type { ReactNode } from "react";
import { ArrowRight,Camera,CheckCircle2,ClipboardList,Cloud,FileText,Gauge,Plus,RefreshCw,ShieldCheck,TriangleAlert,Users } from "lucide-react";
import { useRouter } from "next/navigation";
import type { InspectionStatus } from "@/lib/types";

type InspectionRow={id:string;inspection_number?:string;status?:InspectionStatus;created_at?:string;inspection_scores?:{overall_score:number}[]|{overall_score:number}|null;vehicles?:{make?:string;model?:string;registration_number?:string}|null;customers?:{name?:string}|null};

export function ProfessionalDashboard(){
 const [role,setRole]=useState<string|null>(null),[rows,setRows]=useState<InspectionRow[]>([]),[loading,setLoading]=useState(true);
 useEffect(()=>{Promise.all([fetch("/api/me").then(r=>r.ok?r.json():null),fetch("/api/inspections").then(r=>r.ok?r.json():[])]).then(([me,data])=>{setRole(me?.role??null);setRows(Array.isArray(data)?data:[])}).catch(()=>{}).finally(()=>setLoading(false))},[]);
 if(loading)return <div className="ref-dash-loading"><Cloud size={17}/>Loading workspace…</div>;
 const field=role==="INSPECTOR"||role==="REVIEWER"||role==="CUSTOMER";
 return field?<InspectorDashboard rows={rows}/>:<ManagerDashboard rows={rows}/>;
}

function scoreOf(row:InspectionRow){const s=row.inspection_scores;return Array.isArray(s)?s[0]?.overall_score??null:s?.overall_score??null}

function ManagerDashboard({rows}:{rows:InspectionRow[]}){
 const router=useRouter(),completed=rows.filter(r=>r.status==="COMPLETED").length,pending=rows.filter(r=>r.status==="IN_REVIEW"||r.status==="CHANGES_REQUESTED").length,inProgress=rows.filter(r=>r.status==="IN_PROGRESS"||r.status==="DRAFT").length;
 const scores=rows.map(scoreOf).filter((x):x is number=>typeof x==="number"),avg=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0;
 const series=[34,48,41,58,61,54,72,64,78,74,88,82];
 return <div className="ref-dashboard">
  <div className="ref-dash-intro"><div><span>PERFORMANCE SNAPSHOT</span><h2>Inspection Overview</h2><p>Workload, quality and review risk in one calm surface.</p></div><div className="ref-live-chip"><i/>Live workspace</div></div>
  <div className="ref-kpi-grid">
   <Metric title="Total inspections" value={String(rows.length)} note="All workspace records" icon={<ClipboardList/>} primary/>
   <Metric title="Completed" value={String(completed)} note="Published inspections" icon={<CheckCircle2/>} trend="↑"/>
   <Metric title="Pending review" value={String(pending)} note="Requires attention" icon={<TriangleAlert/>} trend={pending?"Watch":"Clear"}/>
   <Metric title="Average score" value={avg?String(avg):"—"} note={inProgress?String(inProgress)+" active":"No active jobs"} icon={<Gauge/>}/>
  </div>
  <div className="ref-dash-grid ref-dash-grid-top">
   <section className="ref-card-large"><CardHead title="Inspection Activity" sub="Recent operational volume"/><div className="ref-chart"><div className="ref-y"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div className="ref-bars">{series.map((h,i)=><div className="ref-bar-col" key={i}><div className="ref-bar" style={{height:`${h}%`,animationDelay:`${i*40}ms`}}/><small>{["M","T","W","T","F","S","S","M","T","W","T","F"][i]}</small></div>)}</div></div></section>
   <section className="ref-card"><CardHead title="Vehicle Health" sub="Across completed inspections"/><div className="ref-health"><div className="ref-ring"><div><strong>{avg||"—"}</strong><span>Average score</span></div></div><div className="ref-legend"><span><i className="g"/><b>{completed}</b>Good</span><span><i className="m"/><b>{pending}</b>Review</span><span><i className="p"/><b>{inProgress}</b>Active</span></div></div></section>
  </div>
  <div className="ref-dash-grid ref-dash-grid-bottom">
   <section className="ref-card-large"><CardHead title="Recent Inspections" sub="Latest records from the inspection API" action="View all" onAction={()=>router.push("/inspections")}/><div className="ref-table"><div className="ref-table-row head"><span>Inspection</span><span>Vehicle</span><span>Status</span><span>Score</span><span/></div>{rows.slice(0,7).map(r=><button className="ref-table-row" key={r.id} onClick={()=>router.push("/inspections")}><span><b>{r.inspection_number||"Inspection"}</b><small>{r.customers?.name||"Customer not set"}</small></span><span><b>{(r.vehicles?.make||"")+" "+(r.vehicles?.model||"")}</b><small>{r.vehicles?.registration_number||"Registration pending"}</small></span><span><em className={r.status==="COMPLETED"?"good":r.status==="IN_REVIEW"?"warn":""}>{(r.status||"DRAFT").replaceAll("_"," ")}</em></span><span className={typeof scoreOf(r)==="number"?(scoreOf(r)!>=80?"score-good":"score-watch"):""}>{scoreOf(r)??"—"}</span><ArrowRight size={13}/></button>)}{!rows.length&&<div className="ref-empty">No inspections yet.</div>}</div></section>
   <section className="ref-card"><CardHead title="Quick Actions" sub="Move without hunting through menus"/><div className="ref-action-grid"><Action icon={<Plus/>} title="New inspection" sub="Start field workflow" onClick={()=>router.push("/inspections/new")}/><Action icon={<Users/>} title="Inspectors" sub="Team and workload" onClick={()=>router.push("/inspectors")}/><Action icon={<FileText/>} title="Reports" sub="Open and share" onClick={()=>router.push("/reports")}/><Action icon={<ShieldCheck/>} title="Audit logs" sub="Trace changes" onClick={()=>router.push("/audit")}/></div><div className="ref-sync-line"><Cloud size={14}/><span>Sync status</span><b>Healthy</b></div></section>
  </div>
 </div>
}

function InspectorDashboard({rows}:{rows:InspectionRow[]}){
 const router=useRouter(),active=rows.find(r=>r.status==="IN_PROGRESS"||r.status==="DRAFT"),today=new Date().toDateString(),todayRows=rows.filter(r=>r.created_at&&new Date(r.created_at).toDateString()===today),done=todayRows.filter(r=>r.status==="COMPLETED").length,review=rows.filter(r=>r.status==="IN_REVIEW"||r.status==="CHANGES_REQUESTED").length;
 return <div className="ref-dashboard">
  <div className="ref-dash-intro"><div><span>FIELD PERFORMANCE</span><h2>My Inspection Overview</h2><p>The next action is obvious. Everything else stays secondary.</p></div><div className="ref-live-chip"><i/>Field mode</div></div>
  <div className="ref-kpi-grid"><Metric title="Today" value={String(todayRows.length)} note="Assigned / active" icon={<ClipboardList/>}/><Metric title="Completed" value={String(done)} note="Published today" icon={<CheckCircle2/>} trend="↑"/><Metric title="Needs review" value={String(review)} note="Reviewer attention" icon={<TriangleAlert/>} trend={review?"Watch":"Clear"}/><Metric title="Evidence" value={String(rows.filter(r=>r.status==="COMPLETED").length)} note="Linked records" icon={<Camera/>}/></div>
  <section className="ref-next-card"><div><span>NEXT BEST ACTION</span><h3>{active?"Continue active inspection":"Start a new inspection"}</h3><p>{active?(active.vehicles?.make||"Vehicle")+" "+(active.vehicles?.model||"")+" • "+(active.vehicles?.registration_number||"Registration pending"):"Capture vehicle identity first. Everything else follows."}</p></div><button onClick={()=>router.push("/inspections/new")}><Plus size={15}/>{active?"Continue":"Start inspection"}<ArrowRight size={14}/></button></section>
  <div className="ref-dash-grid ref-dash-grid-bottom"><section className="ref-card-large"><CardHead title="My Inspections" sub="Recent work, ordered by attention"/><div className="ref-list">{rows.slice(0,7).map(r=><button className="ref-list-row" key={r.id} onClick={()=>router.push("/inspections")}><span className="ref-mini-avatar">{(r.vehicles?.make||"V").slice(0,1).toUpperCase()}</span><span><b>{r.inspection_number||"Inspection"}</b><small>{(r.vehicles?.make||"")+" "+(r.vehicles?.model||"")+" • "+(r.vehicles?.registration_number||"Registration pending")}</small></span><em className={r.status==="COMPLETED"?"good":r.status==="IN_REVIEW"?"warn":""}>{(r.status||"DRAFT").replaceAll("_"," ")}</em><ArrowRight size={13}/></button>)}{!rows.length&&<div className="ref-empty">No inspections yet.</div>}</div></section><section className="ref-card"><CardHead title="Field Tools" sub="Built for the person beside the car"/><div className="ref-action-grid"><Action icon={<Camera/>} title="Capture evidence" sub="Photos and documents" onClick={()=>router.push("/inspections/new")}/><Action icon={<RefreshCw/>} title="Re-inspection" sub="Carry forward findings" onClick={()=>router.push("/reinspections")}/><Action icon={<FileText/>} title="Reports" sub="Open and share" onClick={()=>router.push("/reports")}/><Action icon={<Gauge/>} title="Vehicle history" sub="Timeline and scores" onClick={()=>router.push("/vehicles")}/></div><div className="ref-sync-line"><Cloud size={14}/><span>Offline queue</span><b>Ready</b></div></section></div>
 </div>
}

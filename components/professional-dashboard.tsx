"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Camera, CheckCircle2, ClipboardList, Cloud, FileText, Gauge, Plus, RefreshCw, ShieldCheck, TriangleAlert, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import type { InspectionStatus } from "@/lib/types";

type InspectionRow = {
  id:string; inspection_number?:string; status?:InspectionStatus; inspection_scores?:{overall_score:number}[]|{overall_score:number}|null;
  vehicles?:{make?:string;model?:string;registration_number?:string}|null; customers?:{name?:string}|null; created_at?:string;
};

export function ProfessionalDashboard(){
  const [role,setRole]=useState<string|null>(null);
  const [rows,setRows]=useState<InspectionRow[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    Promise.all([
      fetch("/api/me").then(r=>r.ok?r.json():null),
      fetch("/api/inspections").then(r=>r.ok?r.json():[])
    ]).then(([me,data])=>{setRole(me?.role??null);setRows(Array.isArray(data)?data:[])}).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  if(loading) return <div className="ux-home-loading"><Cloud size={18}/> Loading workspace…</div>;
  const field=role==="INSPECTOR"||role==="REVIEWER"||role==="CUSTOMER";
  return field?<InspectorHome rows={rows}/>:<ManagerHome rows={rows} role={role}/>;
}

function InspectorHome({rows}:{rows:InspectionRow[]}){
  const router=useRouter();
  const today=new Date().toDateString();
  const todayRows=rows.filter(r=>r.created_at&&new Date(r.created_at).toDateString()===today);
  const active=rows.find(r=>r.status==="IN_PROGRESS"||r.status==="DRAFT");
  const completed=todayRows.filter(r=>r.status==="COMPLETED").length;
  const review=rows.filter(r=>r.status==="IN_REVIEW"||r.status==="CHANGES_REQUESTED").length;

  return <div className="ux-home">
    <header className="ux-home-head"><div><span>FIELD WORKSPACE</span><h1>Your next inspection is one tap away.</h1><p>Designed for the person standing beside the car, not the person trapped inside a spreadsheet.</p></div><span className="ux-live"><i/> Ready</span></header>

    <section className="ux-next"><div><div className="ux-kicker">NEXT BEST ACTION</div><h2>{active?"Continue active inspection":"Start a new inspection"}</h2><p>{active?(active.vehicles?.make||"Vehicle")+" "+(active.vehicles?.model||"")+" • "+(active.vehicles?.registration_number||"Vehicle ID"):"Capture vehicle identity first. Everything else follows."}</p></div><button onClick={()=>router.push("/inspections/new")}><Plus size={17}/>{active?"Continue inspection":"Start inspection"}<ArrowRight size={15}/></button></section>

    <section className="ux-stat-grid">
      <Stat title="Today" value={String(todayRows.length)} note="scheduled / active" icon={<ClipboardList/>}/>
      <Stat title="Completed" value={String(completed)} note="published today" icon={<CheckCircle2/>}/>
      <Stat title="Needs review" value={String(review)} note="reviewer attention" icon={<TriangleAlert/>}/>
      <Stat title="Evidence" value="0" note="pending sync" icon={<Camera/>}/>
    </section>

    <section className="ux-two-col">
      <div className="ux-card"><div className="ux-card-head"><div><h2>My inspections</h2><p>Recent work, ordered by attention first.</p></div><button onClick={()=>router.push("/inspections")}>View all <ArrowRight size={13}/></button></div>
        <div className="ux-list">{rows.slice(0,6).map(r=><button className="ux-list-row" key={r.id} onClick={()=>router.push("/inspections")}>
          <div className="ux-avatar">{((r.vehicles?.make)||"V").slice(0,1).toUpperCase()}</div><div className="ux-list-main"><b>{r.inspection_number||"Inspection"}</b><small>{(r.vehicles?.make||"")+" "+(r.vehicles?.model||"")+" • "+(r.vehicles?.registration_number||"Registration pending")}</small></div>
          <span className={r.status==="COMPLETED"?"ux-pill good":r.status==="IN_REVIEW"?"ux-pill warn":"ux-pill"}>{(r.status||"DRAFT").replaceAll("_"," ")}</span><ArrowRight size={14}/>
        </button>)}</div>
        {!rows.length&&<div className="ux-empty">No inspections yet. Start the first one from the action above.</div>}
      </div>

      <div className="ux-card"><div className="ux-card-head"><div><h2>Field tools</h2><p>Only what matters in the moment.</p></div></div><div className="ux-tool-grid">
        <button onClick={()=>router.push("/inspections/new")}><Camera/><span><b>Capture evidence</b><small>Photos, video, documents</small></span></button>
        <button onClick={()=>router.push("/reinspections")}><RefreshCw/><span><b>Re-inspection</b><small>Carry forward findings</small></span></button>
        <button onClick={()=>router.push("/reports")}><FileText/><span><b>Reports</b><small>Open, verify and share</small></span></button>
        <button onClick={()=>router.push("/vehicles")}><Gauge/><span><b>Vehicle history</b><small>Timeline and previous scores</small></span></button>
      </div><div className="ux-sync"><Cloud size={15}/><span>Offline queue</span><b>Ready</b></div></div>
    </section>

    <section className="ux-callout"><ShieldCheck size={16}/><div><b>Protection is automatic.</b><span>Drafts save locally, sync to Supabase when online, and remain traceable under the inspection ID.</span></div></section>
    <style jsx global>{uxCss}</style>
  </div>
}

function ManagerHome({rows,role}:{rows:InspectionRow[];role:string|null}){
  const router=useRouter();
  const completed=rows.filter(r=>r.status==="COMPLETED").length;
  const inProgress=rows.filter(r=>r.status==="IN_PROGRESS"||r.status==="DRAFT").length;
  const review=rows.filter(r=>r.status==="IN_REVIEW"||r.status==="CHANGES_REQUESTED").length;
  const scores=rows.flatMap(r=>{const s=r.inspection_scores;return Array.isArray(s)?s.map(x=>x.overall_score):s?[s.overall_score]:[]}).filter((x):x is number=>typeof x==="number");
  const avg=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0;

  return <div className="ux-home">
    <header className="ux-home-head"><div><span>{role?role.replaceAll("_"," ")+" WORKSPACE":"OPERATIONS OVERVIEW"}</span><h1>Run inspections without dashboard archaeology.</h1><p>Workload, risk, quality and the next action stay visible.</p></div><button className="ux-head-action" onClick={()=>router.push("/inspections/new")}><Plus size={15}/> New inspection</button></header>
    <section className="ux-stat-grid">
      <Stat title="Total inspections" value={String(rows.length)} note="workspace" icon={<ClipboardList/>} accent/>
      <Stat title="In progress" value={String(inProgress)} note="field work" icon={<RefreshCw/>}/>
      <Stat title="Needs review" value={String(review)} note="approval queue" icon={<TriangleAlert/>}/>
      <Stat title="Average score" value={avg?String(avg):"—"} note={completed?String(completed)+" completed":"No scores yet"} icon={<Gauge/>}/>
    </section>
    <section className="ux-two-col">
      <div className="ux-card"><div className="ux-card-head"><div><h2>Inspection queue</h2><p>Latest operational work.</p></div><button onClick={()=>router.push("/inspections")}>Open workspace <ArrowRight size={13}/></button></div><div className="ux-list">{rows.slice(0,8).map(r=><div className="ux-list-row static" key={r.id}><div className="ux-avatar">{((r.vehicles?.make)||"O").slice(0,1).toUpperCase()}</div><div className="ux-list-main"><b>{r.inspection_number||"Inspection"}</b><small>{(r.vehicles?.make||"")+" "+(r.vehicles?.model||"")+" • "+(r.vehicles?.registration_number||"—")}</small></div><span className={r.status==="COMPLETED"?"ux-pill good":r.status==="IN_REVIEW"?"ux-pill warn":"ux-pill"}>{(r.status||"DRAFT").replaceAll("_"," ")}</span></div>)}</div></div>
      <div className="ux-card"><div className="ux-card-head"><div><h2>Management shortcuts</h2><p>Admin tools stay out of inspector flow.</p></div></div><div className="ux-tool-grid">
        <button onClick={()=>router.push("/templates")}><ClipboardList/><span><b>Templates</b><small>Configure checklists</small></span></button>
        <button onClick={()=>router.push("/inspectors")}><Users/><span><b>Inspectors</b><small>Team and workload</small></span></button>
        <button onClick={()=>router.push("/analytics")}><Gauge/><span><b>Analytics</b><small>Quality and trends</small></span></button>
        <button onClick={()=>router.push("/audit")}><ShieldCheck/><span><b>Audit logs</b><small>Trace every action</small></span></button>
      </div></div>
    </section>
    <style jsx global>{uxCss}</style>
  </div>
}

function Stat({title,value,note,icon,accent=false}:{title:string;value:string;note:string;icon:React.ReactNode;accent?:boolean}){
  return <div className={"ux-stat"+(accent?" accent":"")}><div className="ux-stat-top"><span>{title}</span>{icon}</div><strong>{value}</strong><small>{note}</small></div>
}

const uxCss = ".ux-home{max-width:1500px;margin:0 auto;animation:uxRise .28s ease-out}.ux-home-loading{min-height:55vh;display:grid;place-items:center;color:#8090a1;gap:8px}@keyframes uxRise{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}.ux-home-head{display:flex;align-items:flex-start;justify-content:space-between;gap:15px;margin-bottom:15px}.ux-home-head>div>span,.ux-kicker{font-size:9px;font-weight:900;letter-spacing:.17em;color:#8795a7}.ux-home-head h1{margin:5px 0;font-size:26px;line-height:1.05;letter-spacing:-.04em;color:#21334b}.ux-home-head p{margin:0;color:#7d8c9e;font-size:11px}.ux-live{display:inline-flex;gap:6px;align-items:center;padding:8px 11px;border:1px solid #cdece5;background:#f1fbf8;color:#148169;border-radius:999px;font-size:9px;font-weight:800}.ux-live i{width:7px;height:7px;border-radius:50%;background:#21b79d;box-shadow:0 0 0 4px rgba(33,183,157,.11)}.ux-head-action{display:inline-flex;align-items:center;gap:7px;border:1px solid #213b63;background:#213b63;color:#fff;border-radius:10px;padding:9px 12px;font-size:10px;font-weight:850}.ux-next{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:17px;border-radius:17px;background:linear-gradient(145deg,#213b63,#2c4f77);color:#fff;margin-bottom:12px;box-shadow:0 12px 28px rgba(33,59,99,.12)}.ux-next h2{margin:5px 0;font-size:17px}.ux-next p{margin:0;color:#d5e0eb;font-size:10px}.ux-next button{border:0;border-radius:10px;background:#22bfd0;color:#06353b;padding:10px 12px;font-size:10px;font-weight:900;display:flex;align-items:center;gap:6px;white-space:nowrap}.ux-stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:12px}.ux-stat{padding:14px;border:1px solid #e0e8ef;background:#fff;border-radius:15px;box-shadow:0 8px 20px rgba(31,56,91,.04)}.ux-stat.accent{background:#f7fdfe;border-color:#cdeef2}.ux-stat-top{display:flex;justify-content:space-between;gap:8px;color:#8190a3;font-size:9px;font-weight:800}.ux-stat-top svg{width:15px;color:#20aabd}.ux-stat strong{display:block;font-size:28px;line-height:1;margin:15px 0 6px;letter-spacing:-.05em}.ux-stat small{color:#93a0ae;font-size:8px}.ux-two-col{display:grid;grid-template-columns:1.25fr .75fr;gap:11px}.ux-card{background:#fff;border:1px solid #e0e8ef;border-radius:16px;padding:14px;box-shadow:0 8px 20px rgba(31,56,91,.04)}.ux-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px}.ux-card-head h2{margin:0;font-size:13px}.ux-card-head p{margin:3px 0 0;color:#8a98a7;font-size:9px}.ux-card-head button{border:0;background:none;color:#1b7484;display:flex;align-items:center;gap:4px;font-size:9px;font-weight:850}.ux-list{display:grid}.ux-list-row{width:100%;display:flex;align-items:center;gap:9px;border:0;border-top:1px solid #edf1f5;background:#fff;text-align:left;padding:10px 3px;color:#34475d}.ux-list-row:hover{background:#fbfdff}.ux-list-row.static{pointer-events:none}.ux-avatar{width:29px;height:29px;border-radius:9px;background:#eaf9fb;color:#217b88;display:grid;place-items:center;font-size:10px;font-weight:900;flex:0 0 auto}.ux-list-main{flex:1;min-width:0}.ux-list-main b{display:block;font-size:10px}.ux-list-main small{display:block;color:#94a0af;font-size:8px;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ux-pill{padding:5px 7px;border-radius:999px;background:#f2f5f8;color:#77879a;font-size:8px;font-weight:900;white-space:nowrap}.ux-pill.good{background:#edf9f4;color:#158064}.ux-pill.warn{background:#fff6e7;color:#b77918}.ux-list-row>svg{color:#9aa6b5;flex:0 0 auto}.ux-empty{padding:35px 10px;text-align:center;color:#8b98a5;font-size:10px}.ux-tool-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}.ux-tool-grid button{border:1px solid #e3eaf0;background:#fbfcfe;border-radius:11px;padding:11px 9px;display:flex;align-items:center;gap:8px;text-align:left;color:#34485f}.ux-tool-grid button:hover{border-color:#c6e7ec;background:#f2fcfd}.ux-tool-grid svg{width:16px;color:#23acbc;flex:0 0 auto}.ux-tool-grid b{display:block;font-size:9px}.ux-tool-grid small{display:block;color:#8c9aa8;font-size:8px;margin-top:2px}.ux-sync{display:flex;align-items:center;gap:7px;padding:8px 9px;border-radius:9px;background:#f1fbf7;color:#567366;font-size:9px;margin-top:8px}.ux-sync b{margin-left:auto;color:#178365}.ux-callout{display:flex;gap:9px;align-items:flex-start;padding:11px;margin-top:11px;border:1px solid #d8eef1;background:#f5fdfe;border-radius:12px;color:#6b7c8f;font-size:9px;line-height:1.5}.ux-callout svg{color:#21aabd}.ux-callout b{display:block;color:#3e536a;font-size:10px}.ux-callout span{display:block;margin-top:2px}@media(max-width:1020px){.ux-stat-grid{grid-template-columns:1fr 1fr}.ux-two-col{grid-template-columns:1fr}}@media(max-width:600px){.ux-home-head{flex-direction:column}.ux-home-head h1{font-size:22px}.ux-next{align-items:flex-start;flex-direction:column}.ux-next button{width:100%;justify-content:center}.ux-stat-grid{grid-template-columns:1fr 1fr}.ux-card{padding:12px}}";


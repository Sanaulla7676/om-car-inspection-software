"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Check, ChevronLeft, ChevronRight, Cloud, CloudOff, FileText, Loader2, PenLine, Sparkles, ShieldCheck, Upload, Wifi, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { loadLocalDraft, saveLocalDraft } from "@/lib/offline";
import { calculateScore, recommendationForScore } from "@/lib/scoring";
import type { InspectionDraft, Severity } from "@/lib/types";
import { faultLibrary } from "@/lib/demo-data";

const stepNames = ["Setup","Vehicle","Exterior","Interior","Mechanical","Electrical","Tyres","Test Drive","Faults","Photos","Summary"];
const sections = [
  ["Exterior",["Headlights","Fog lamps","Windshield","ORVM left","ORVM right","Front bumper","Rear bumper","Tail lamps","Number plates","Parking sensors","Reverse camera","Panel gaps"]],
  ["Interior",["Instrument cluster","Warning lights","Infotainment","Reverse camera","AC controls","Steering controls","Horn","Airbag indicator","USB / charging ports","Speakers","Driver seat","Passenger seat","Rear seats","Seat belts","Upholstery","Door trims","Dashboard","Center console","Boot interior"]],
  ["Mechanical",["Cold start","Engine noise","Oil leakage","Coolant leakage","Smoke","Mounting","Belts","Hoses","Battery","Fluid levels","Gear shifting","Clutch operation","Automatic transmission behavior","Abnormal noise","Front suspension","Rear suspension","Shock absorbers","Bushes","Ball joints","Steering response","Steering play","Alignment","Brake pedal","Brake response","Brake noise","Disc condition","ABS"]],
  ["Electrical",["Headlights","Tail lamps","Indicators","Fog lamps","Brake lights","Reverse lights","Interior lights","Battery","Alternator","Power windows","Central locking","ORVM","Sunroof","Infotainment","Parking sensors","Cameras","ADAS"]],
  ["Tyres",["Front Left","Front Right","Rear Left","Rear Right","Spare"]],
  ["Test Drive",["Cold start","Acceleration","Gear shifting","Braking","Steering","Suspension","Noise","Vibration","Clutch","Transmission","Straight-line stability","Cornering","Braking behavior","Pulling / drift"]],
] as const;

const defaultDraft: InspectionDraft = {
  inspectionNumber: `INS-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
  inspectionType: "Used Car",
  inspectorName: "Current inspector",
  customer: { name:"", phone:"", email:"", type:"Buyer" },
  vehicle: { registration:"", vin:"", make:"", model:"", variant:"", year:"", fuel:"Petrol", transmission:"Automatic", color:"", odometer:"", engineNumber:"", ownership:"1st owner" },
  sections: {},
  findings: [],
  photos: [],
  recommendation: "Suitable",
  reviewerComments: "",
  testDrive: { distance:"", road:"Mixed city + highway", result:"Passed", notes:"" },
  updatedAt: new Date().toISOString()
};

function makeInitialSections() {
  const result: InspectionDraft["sections"] = {};
  for (const [section, items] of sections) {
    result[section] = {};
    for (const item of items) result[section][item] = { status:"Good", severity:"Cosmetic" as Severity, notes:"" };
  }
  return result;
}
defaultDraft.sections = makeInitialSections();

export function InspectionWizard() {
  const supabase = createClient();
  const [step,setStep] = useState(0);
  const [draft,setDraft] = useState<InspectionDraft>(defaultDraft);
  const [inspectionId,setInspectionId] = useState<string|undefined>();
  const [orgId,setOrgId] = useState<string|undefined>();
  const [online,setOnline] = useState(true);
  const [saving,setSaving] = useState(false);
  const [notice,setNotice] = useState("");
  const [uploadingIndex,setUploadingIndex] = useState<number|null>(null);
  const [loading,setLoading] = useState(true);
  const signatureRef=useRef<HTMLCanvasElement>(null);

  useEffect(()=>{
    setOnline(navigator.onLine);
    const on=()=>setOnline(true), off=()=>setOnline(false);
    window.addEventListener("online",on); window.addEventListener("offline",off);
    fetch("/api/me").then(r=>r.ok?r.json():null).then(x=>{
      setOrgId(x?.organization?.id);
      if(x?.user?.name) setDraft(d=>({...d,inspectorName:x.user.name}));
    }).catch(()=>{}).finally(()=>setLoading(false));
    const savedId = typeof window!=="undefined" ? localStorage.getItem("om-active-inspection") : null;
    if(savedId) {
      loadLocalDraft(savedId).then(record=>record?.payload&&setDraft(record.payload)).catch(()=>{});
      setInspectionId(savedId);
    }
    return ()=>{window.removeEventListener("online",on);window.removeEventListener("offline",off);}
  },[]);

  useEffect(()=>{
    if(loading) return;
    const t=window.setTimeout(async ()=>{
      await saveLocalDraft(inspectionId ?? draft.inspectionNumber, {...draft,updatedAt:new Date().toISOString()});
      if(online && inspectionId) {
        setSaving(true);
        fetch(`/api/inspections/${inspectionId}`,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({action:"draft",payload:draft})})
          .then(r=>{if(!r.ok) throw new Error("sync failed");})
          .then(()=>setNotice("Saved"))
          .catch(()=>setNotice("Saved offline"))
          .finally(()=>setSaving(false));
      } else setNotice(online?"Draft saved locally":"Offline • draft saved locally");
    },700);
    return ()=>window.clearTimeout(t);
  },[draft,inspectionId,online,loading]);

  const score = useMemo(()=>calculateScore(draft.findings.map(f=>({severity:f.severity as Severity}))),[draft.findings]);
  const recommendation = recommendationForScore(score.overall,score.counts.Critical,score.counts.Major);

  function updateDraft(p:Partial<InspectionDraft>) { setDraft(d=>({...d,...p,updatedAt:new Date().toISOString()})); }
  function updateVehicle(key:keyof InspectionDraft["vehicle"], value:string) { setDraft(d=>({...d,vehicle:{...d.vehicle,[key]:value},updatedAt:new Date().toISOString()})); }
  function updateItem(section:string,item:string,key:"status"|"severity"|"notes",value:string) {
    setDraft(d=>({...d,sections:{...d.sections,[section]:{...d.sections[section],[item]:{...d.sections[section][item],[key]:value}}},updatedAt:new Date().toISOString()}));
  }

  async function ensureInspection() {
    if(inspectionId) return inspectionId;
    if(!orgId && supabase) { setNotice("Create an organization from /onboarding before creating inspections."); throw new Error("No organization"); }
    if(!supabase) return draft.inspectionNumber;
    const res=await fetch("/api/inspections",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({draft,organizationId:orgId})});
    const json=await res.json();
    if(!res.ok) throw new Error(json.error||"Could not create inspection");
    setInspectionId(json.id);
    localStorage.setItem("om-active-inspection",json.id);
    return json.id;
  }

  async function next() {
    try {
      if(step===0) {
        await ensureInspection();
      }
      setStep(s=>Math.min(stepNames.length-1,s+1));
      window.scrollTo({top:0,behavior:"smooth"});
    } catch(e) { setNotice(e instanceof Error?e.message:"Could not save"); }
  }
  function prev(){setStep(s=>Math.max(0,s-1));window.scrollTo({top:0,behavior:"smooth"});}

  async function capturePhoto(index:number,file:File) {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setNotice("File is too large. Keep evidence under 15 MB.");
      return;
    }
    setUploadingIndex(index);
    const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
    const nextPhotos=[...draft.photos];
    nextPhotos[index]={name:nextPhotos[index]?.name ?? (file.name || `Evidence ${index+1}`),url:preview};
    updateDraft({photos:nextPhotos});
    try {
      let activeInspectionId=inspectionId;
      if (!activeInspectionId && supabase) activeInspectionId=await ensureInspection();
      if (supabase && orgId && activeInspectionId && online) {
        const ext=(file.name.split(".").pop()||"bin").toLowerCase().replace(/[^a-z0-9]/g,"");
        const path=`${orgId}/${activeInspectionId}/original/${crypto.randomUUID()}.${ext || "bin"}`;
        const {error}=await supabase.storage.from("inspection-media").upload(path,file,{contentType:file.type || "application/octet-stream",cacheControl:"3600",upsert:false});
        if(error) throw error;
        const {error:rowError}=await supabase.from("inspection_media").insert({
          organization_id:orgId,inspection_id:activeInspectionId,file_path:path,
          media_type:file.type.startsWith("video/")?"video":file.type==="application/pdf"?"document":"image",
          original_filename:file.name,mime_type:file.type || "application/octet-stream",
          file_size:file.size,captured_at:new Date().toISOString()
        });
        if(rowError) throw rowError;
        setInspectionId(activeInspectionId);
        setNotice("Evidence uploaded and linked to this inspection");
        const saved=[...nextPhotos];
        saved[index]={name:file.name,path,url:preview};
        updateDraft({photos:saved});
      } else {
        setNotice(online ? "Evidence saved locally. Finish the inspection to sync it." : "Offline: evidence saved locally and will sync when online.");
      }
    } catch (error) {
      const message=error instanceof Error ? error.message : "Upload failed";
      setNotice(`Upload failed: ${message}`);
    } finally {
      setUploadingIndex(null);
    }
  }

  async function aiSummary(){
    setSaving(true);
    try {
      const r=await fetch("/api/ai/summary",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({findings:draft.findings,vehicle:draft.vehicle,score:score.overall})});
      const j=await r.json();
      updateDraft({reviewerComments:j.summary ?? ""});
      setNotice(j.source==="ai"?"AI draft generated":"Deterministic draft generated");
    } catch { setNotice("Could not generate summary"); } finally { setSaving(false); }
  }

  async function finalize(){
    try {
      const id=await ensureInspection();
      setSaving(true);
      const signatureDataUrl=signatureRef.current?.toDataURL("image/png");
      const payload={...draft,recommendation,signatureDataUrl};
      const r=await fetch(`/api/inspections/${id}`,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({action:"finalize",payload})});
      const j=await r.json();
      if(!r.ok) throw new Error(j.error||"Finalization failed");
      setNotice("Inspection approved for report generation");
      localStorage.removeItem("om-active-inspection");
      window.location.href=`/reports?inspection=${id}`;
    } catch(e) { setNotice(e instanceof Error?e.message:"Finalization failed"); } finally { setSaving(false); }
  }

  function startSignature(e:React.PointerEvent<HTMLCanvasElement>) {
    const canvas=signatureRef.current; if(!canvas)return;
    const ctx=canvas.getContext("2d"); if(!ctx)return;
    const rect=canvas.getBoundingClientRect(); ctx.beginPath(); ctx.moveTo(e.clientX-rect.left,e.clientY-rect.top);
    const move=(ev:PointerEvent)=>{ctx.lineTo(ev.clientX-rect.left,ev.clientY-rect.top);ctx.stroke();};
    const stop=()=>{window.removeEventListener("pointermove",move);window.removeEventListener("pointerup",stop);};
    window.addEventListener("pointermove",move);window.addEventListener("pointerup",stop);
  }

  if(loading) return <div className="page"><div className="card grid place-items-center min-h-60"><Loader2 className="animate-spin"/></div></div>;

  return <div className="page">
    <div className="section-title">
      <div><h2>New Vehicle Inspection</h2><p>Field-optimized inspection with automatic save, evidence capture and report generation.</p></div>
      <div className="btn-row"><span className={`chip ${online?"success":"warn"}`}>{online?<Wifi size={13}/> : <CloudOff size={13}/>} {online?"Online":"Offline"}</span><span className="chip info">{saving?<Loader2 className="animate-spin" size={13}/>:<Cloud size={13}/>} {saving?"Saving…":"Autosave active"}</span></div>
    </div>

    <div className="stepper">
      {stepNames.map((name,i)=><button key={name} className={`step ${i===step?"active":i<step?"done":""}`} onClick={()=>i<=step&&setStep(i)}>{i<step?<Check size={13}/>:i+1}. {name}</button>)}
    </div>

    {step===0 && <Setup draft={draft} setDraft={updateDraft} next={next}/>}
    {step===1 && <Vehicle draft={draft} updateVehicle={updateVehicle} updateDraft={updateDraft} next={next}/>}
    {step>=2 && step<=5 && <Checklist step={step} draft={draft} updateItem={updateItem}/>}
    {step===6 && <Tyres draft={draft} updateDraft={updateDraft}/>}
    {step===7 && <TestDrive draft={draft} updateDraft={updateDraft}/>}
    {step===8 && <Faults draft={draft} updateDraft={updateDraft}/>}
    {step===9 && <Photos draft={draft} capturePhoto={capturePhoto} uploadingIndex={uploadingIndex}/>}
    {step===10 && <Summary draft={draft} score={score.overall} recommendation={recommendation} aiSummary={aiSummary} signatureRef={signatureRef} startSignature={startSignature} finalize={finalize}/>}    

    <div className="btn-row justify-between mt-5">
      <button className="btn" disabled={step===0} onClick={prev}><ChevronLeft size={15}/> Previous</button>
      {step<10 ? <button className="btn primary" onClick={next}>Save & continue <ChevronRight size={15}/></button> : <button className="btn gold" disabled={saving} onClick={finalize}>{saving?<Loader2 className="animate-spin"/>:<FileText size={15}/>} Finalize & generate report</button>}
    </div>
    {notice && <div className="mt-4 p-3 rounded-xl border bg-white text-sm text-slate-600">{notice}</div>}
  </div>;
}

function Setup({draft,setDraft,next}:{draft:InspectionDraft;setDraft:(p:Partial<InspectionDraft>)=>void;next:()=>void}) {
  return <div className="inspect-layout"><div className="card">
    <div className="section-title"><div><h2 className="text-lg font-bold">Inspection setup</h2><p>Choose the workflow and start with the minimum necessary typing.</p></div></div>
    <div className="form-grid">
      <div className="field"><label>Inspection type</label><select value={draft.inspectionType} onChange={e=>setDraft({inspectionType:e.target.value})}><option>Used Car</option><option>New Car — PDI</option><option>Re-inspection</option><option>Fleet</option><option>EV Extended</option></select></div>
      <div className="field"><label>Inspector</label><input value={draft.inspectorName} onChange={e=>setDraft({inspectorName:e.target.value})}/></div>
      <div className="field"><label>Inspection ID</label><input value={draft.inspectionNumber} readOnly/></div>
      <div className="field"><label>Inspection time</label><input value={new Date(draft.updatedAt).toLocaleString("en-IN")} readOnly/></div>
      <div className="field span-2"><label>Customer</label><input value={draft.customer.name} onChange={e=>setDraft({customer:{...draft.customer,name:e.target.value}})} placeholder="Search or create customer"/></div>
      <div className="field"><label>Customer type</label><select value={draft.customer.type} onChange={e=>setDraft({customer:{...draft.customer,type:e.target.value}})}><option>Buyer</option><option>Seller</option><option>Dealer</option><option>Fleet</option></select></div>
      <div className="field"><label>Priority</label><select><option>Normal</option><option>Express</option><option>High priority</option></select></div>
    </div>
    <div className="mt-2 p-3 rounded-xl border bg-blue-50 border-blue-100 text-sm text-slate-600"><strong>Smart setup</strong><div className="label mt-1">Registration/VIN can prefill vehicle data through a configured provider. No image-based identity guessing is used.</div></div>
    <div className="btn-row mt-4"><button className="btn gold" onClick={()=>next()}>Start inspection</button></div>
  </div><div className="card sticky-card"><h3 className="mt-0">Field controls</h3><div className="kpi-list"><div className="kpi"><strong>Auto</strong><span>Save</span></div><div className="kpi"><strong>Offline</strong><span>Cache</span></div><div className="kpi"><strong>Quick</strong><span>Tap input</span></div></div><hr className="my-4 border-slate-100"/><div className="label">Required before submission</div><div className="mt-2 text-sm leading-7">✓ Vehicle identity<br/>✓ Required checklist items<br/>✓ Required photos<br/>✓ Final recommendation<br/>✓ Signature</div></div></div>;
}

function Vehicle({draft,updateVehicle,updateDraft,next}:{draft:InspectionDraft;updateVehicle:(k:keyof InspectionDraft["vehicle"],v:string)=>void;updateDraft:(p:Partial<InspectionDraft>)=>void;next:()=>void}) {
  return <div className="card"><div className="section-title"><div><h2 className="text-lg font-bold">Vehicle identity</h2><p>Scan or enter the registration/VIN once. Everything else can be prefilled.</p></div><span className="chip success">Prefill ready</span></div>
    <div className="form-grid">{(Object.entries(draft.vehicle) as [keyof InspectionDraft["vehicle"],string][]).map(([key,value])=><div key={key} className="field"><label>{key.replaceAll(/([A-Z])/g," $1")}</label>{["fuel","transmission","ownership"].includes(String(key))?<select value={value} onChange={e=>updateVehicle(key,e.target.value)}>{(key==="fuel"?["Petrol","Diesel","EV","Hybrid"]:key==="transmission"?["Manual","Automatic"]:["1st owner","2nd owner","3+ owners"]).map(x=><option key={x}>{x}</option>)}</select>:<input value={value} onChange={e=>updateVehicle(key,e.target.value)} placeholder={key==="registration"?"KA01AB1234":key==="vin"?"VIN / chassis":""}/>}</div>)}</div>
    <div className="grid grid-3 mt-3"><div className="card p-3"><strong><Camera size={16}/> Scan VIN</strong><div className="label">Camera / OCR slot</div><label className="btn mt-2 inline-flex items-center gap-2" htmlFor="vin-camera">Open scanner<input id="vin-camera" type="file" accept="image/*" capture="environment" className="hidden"/></label></div><div className="card p-3"><strong>Registration lookup</strong><div className="label">Provider-backed lookup</div><button className="btn mt-2" onClick={()=>updateDraft({vehicle:{...draft.vehicle,make:"Hyundai",model:"Creta",variant:"SX(O)",year:"2023",odometer:"42560"}})}>Run lookup</button></div><div className="card p-3"><strong>Documents</strong><div className="label">RC / insurance / PUC</div><label className="btn mt-2 inline-flex items-center gap-2" htmlFor="documents"><Upload size={15}/> Upload<input id="documents" type="file" multiple accept=".pdf,image/*" className="hidden"/></label></div></div>
    <button className="btn primary mt-4" onClick={next}>Save & continue</button>
  </div>;
}

function Checklist({step,draft,updateItem}:{step:number;draft:InspectionDraft;updateItem:(s:string,i:string,k:"status"|"severity"|"notes",v:string)=>void}) {
  const [section,items]=sections[step-2];
  return <div className="grid grid-2"><div className="card"><div className="section-title"><div><h2 className="text-lg font-bold">{section} inspection</h2><p>Tap-select status and attach evidence when useful.</p></div><span className="chip info">{items.length} items</span></div>
    <div className="check-section"><div className="check-body">{items.map((item,i)=>{const value=draft.sections[section]?.[item]??{status:"Good",severity:"Cosmetic",notes:""}; return <div className="item-row" key={item}><div><div className="item-name">{item}</div><div className="item-sub">{i%3===0?"Required":"Optional / conditional"}</div></div><select value={value.status} onChange={e=>updateItem(section,item,"status",e.target.value)}>{["Good","Excellent","Fair","Poor","Damaged","Working","Partial","Not working","Not tested"].map(x=><option key={x}>{x}</option>)}</select><select value={value.severity} onChange={e=>updateItem(section,item,"severity",e.target.value)}>{["Cosmetic","Minor","Moderate","Major","Critical"].map(x=><option key={x}>{x}</option>)}</select><button className="btn" onClick={()=>alert("Use the Photos step to upload linked evidence.")}><Camera size={15}/> Photo</button></div>})}</div></div>
  </div><div className="card sticky-card"><h3 className="mt-0">Field note</h3><p className="text-sm text-slate-500 leading-6">Structured selections are saved locally immediately and synchronized to Supabase when connectivity returns. Critical or major findings will require review in the final workflow.</p><div className="mt-4 p-3 rounded-xl border bg-amber-50 border-amber-100 text-sm"><strong>OBD diagnostics</strong><div className="label mt-1">Add manual codes now; hardware/Bluetooth integration can be attached later.</div></div></div></div>;
}

function Tyres({draft,updateDraft}:{draft:InspectionDraft;updateDraft:(p:Partial<InspectionDraft>)=>void}) {
  const [values,setValues]=useState(["Front Left","Front Right","Rear Left","Rear Right","Spare"].map(p=>({position:p,brand:p==="Spare"?"MRF":"Michelin",size:"215/60 R17",wear:"Good",condition:"Good"})));
  return <div className="card"><div className="section-title"><div><h2 className="text-lg font-bold">Tyre inspection</h2><p>Record each wheel consistently, including tread, size, brand and replacement assessment.</p></div></div><div className="table-wrap"><table><thead><tr><th>Position</th><th>Brand</th><th>Size</th><th>Tread / Wear</th><th>Condition</th></tr></thead><tbody>{values.map((v,i)=><tr key={v.position}><td><strong>{v.position}</strong></td><td><input value={v.brand} onChange={e=>setValues(a=>a.map((x,j)=>j===i?{...x,brand:e.target.value}:x))}/></td><td><input value={v.size} onChange={e=>setValues(a=>a.map((x,j)=>j===i?{...x,size:e.target.value}:x))}/></td><td><select value={v.wear} onChange={e=>setValues(a=>a.map((x,j)=>j===i?{...x,wear:e.target.value}:x))}><option>Good</option><option>Fair</option><option>Worn</option><option>Critical</option></select></td><td><select value={v.condition} onChange={e=>setValues(a=>a.map((x,j)=>j===i?{...x,condition:e.target.value}:x))}><option>Good</option><option>Uneven wear</option><option>Sidewall damage</option><option>Replace</option></select></td></tr>)}</tbody></table></div><div className="grid grid-2 mt-4"><div className="card p-3"><strong>Tyre notes</strong><textarea rows={3} className="mt-2" placeholder="Age, wear pattern, spare condition…" onChange={e=>updateDraft({reviewerComments:e.target.value})}/></div><div className="card p-3"><strong>Replacement recommendation</strong><select className="mt-2"><option>None</option><option>Monitor</option><option>Replace 1–2 tyres</option><option>Replace all</option></select></div></div></div>;
}

function TestDrive({draft,updateDraft}:{draft:InspectionDraft;updateDraft:(p:Partial<InspectionDraft>)=>void}) {
  return <div className="card"><div className="section-title"><div><h2 className="text-lg font-bold">Test drive</h2><p>Capture road behavior separately from static inspection.</p></div><span className="chip info">Optional by template</span></div><div className="grid grid-3">{[["distance","Distance tested","8.2 km"],["road","Road conditions","Mixed city + highway"],["result","Test result","Passed"]].map(([k,l,d])=><div className="field" key={k}><label>{l}</label>{k==="road"?<select value={draft.testDrive.road} onChange={e=>updateDraft({testDrive:{...draft.testDrive,road:e.target.value}})}><option>Mixed city + highway</option><option>City</option><option>Highway</option><option>Parking lot only</option></select>:k==="result"?<select value={draft.testDrive.result} onChange={e=>updateDraft({testDrive:{...draft.testDrive,result:e.target.value}})}><option>Passed</option><option>Passed with observations</option><option>Further evaluation required</option><option>Not recommended</option></select>:<input value={draft.testDrive.distance} placeholder={d} onChange={e=>updateDraft({testDrive:{...draft.testDrive,distance:e.target.value}})}/>}</div>)}</div><div className="field"><label>Drive notes</label><textarea rows={4} value={draft.testDrive.notes} onChange={e=>updateDraft({testDrive:{...draft.testDrive,notes:e.target.value}})} placeholder="Only enter unusual observations…"/></div><button className="btn"><Camera size={15}/> Record evidence</button></div>;
}

function Faults({draft,updateDraft}:{draft:InspectionDraft;updateDraft:(p:Partial<InspectionDraft>)=>void}) {
  const [q,setQ]=useState("");
  const filtered=faultLibrary.filter(x=>x.name.toLowerCase().includes(q.toLowerCase()));
  function add(f:typeof faultLibrary[number]) {
    updateDraft({findings:[...draft.findings,{name:f.name,system:f.system,severity:f.severity as Severity,default_description:f.description}]});
  }
  return <div className="grid grid-2"><div className="card"><div className="section-title"><div><h2 className="text-lg font-bold">Fault library</h2><p>Tap predefined issues instead of typing them repeatedly.</p></div><button className="btn">＋ Custom</button></div><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search fault…"/><div className="grid grid-2 mt-3">{filtered.map(f=><button className="card text-left p-3 hover:bg-slate-50" key={f.name} onClick={()=>add(f)}><strong>{f.name}</strong><div className="label">{f.system} • {f.severity}</div></button>)}</div></div><div className="card"><div className="section-title"><div><h2 className="text-lg font-bold">Selected faults</h2><p>Descriptions are structured for consistent reporting.</p></div></div>{draft.findings.length===0?<div className="empty">No faults selected yet.</div>:draft.findings.map((f,i)=><div className="card p-3 mb-2" key={f.name+i}><div className="flex justify-between gap-3"><div><strong>{f.name}</strong><div className="label">{f.system}</div></div><span className={`chip ${f.severity==="Major"||f.severity==="Critical"?"danger":f.severity==="Moderate"?"warn":""}`}>{f.severity}</span></div><div className="text-sm mt-2">{f.default_description}</div><button className="btn mt-2" onClick={()=>updateDraft({findings:draft.findings.filter((_,j)=>j!==i)})}><X size={14}/> Remove</button></div>)}</div></div>;
}

function Photos({draft,capturePhoto,uploadingIndex}:{draft:InspectionDraft;capturePhoto:(i:number,f:File)=>Promise<void>;uploadingIndex:number|null}) {
  const slots=["Front overview","Rear overview","Left side","Right side","Odometer","VIN / chassis","Front-left damage","Rear bumper damage","Engine bay","Tyre RR","Interior dashboard","Documents"];
  const firstEmpty=draft.photos.findIndex((x)=>!x);
  return <div className="grid gap-4">
    <div className="card evidence-upload-hero">
      <div className="evidence-upload-copy">
        <div className="eyebrow">EVIDENCE CAPTURE</div>
        <h2 className="text-xl font-black mt-1">Add inspection photos</h2>
        <p>Use the camera for field capture or upload files from the device. Each file is linked to this inspection.</p>
      </div>
      <div className="evidence-actions">
        <label className="btn gold">
          <Camera size={16}/> Take photo
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f){const i=firstEmpty>=0?firstEmpty:0;void capturePhoto(i,f)};e.currentTarget.value=""}}/>
        </label>
        <label className="btn primary">
          <Upload size={16}/> Upload files
          <input type="file" multiple accept="image/*,video/*,.pdf" className="hidden" onChange={e=>{
            const files=Array.from(e.target.files??[]);
            let index=draft.photos.findIndex((x)=>!x);
            if(index<0) index=0;
            void files.reduce((p,file)=>p.then(()=>{const target=Math.min(index,slots.length-1); index=Math.min(index+1,slots.length); return capturePhoto(target,file)}),Promise.resolve());
            e.currentTarget.value="";
          }}/>
        </label>
      </div>
      <div className="upload-meta"><span><Check size={13}/> Max 15 MB/file</span><span><ShieldCheck size={13}/> Private inspection storage</span><span><Wifi size={13}/> Offline cache enabled</span></div>
    </div>
    <div className="card">
      <div className="section-title">
        <div><h2 className="text-lg font-bold">Evidence checklist</h2><p>Front-to-back capture order keeps reports consistent.</p></div>
        <span className="chip info">{draft.photos.filter(Boolean).length} / {slots.length} added</span>
      </div>
      <div className="photo-grid">
        {slots.map((name,i)=>(
          <div className={`photo-slot ${draft.photos[i]?"attached":""}`} key={name}>
            <div className="thumb">
              {draft.photos[i]?.url ? <img src={draft.photos[i].url} alt={name}/> : draft.photos[i]?.path ? <FileText size={25}/> : <Camera/>}
            </div>
            <div className="mt-2">
              <strong className="text-xs">{name}</strong>
              <div className="label">{i<8?"Required":"Optional / conditional"}</div>
            </div>
            <label className={`btn mt-2 text-center ${uploadingIndex===i?"pointer-events-none opacity-70":""}`} htmlFor={`photo-${i}`}>
              {uploadingIndex===i ? <><Loader2 size={14} className="animate-spin"/> Uploading…</> : draft.photos[i] ? "Replace" : "Capture / upload"}
              <input id={`photo-${i}`} type="file" className="hidden" accept="image/*,video/*,.pdf" capture="environment" onChange={e=>{const f=e.target.files?.[0];if(f)void capturePhoto(i,f);e.currentTarget.value=""}}/>
            </label>
          </div>
        ))}
      </div>
    </div>
  </div>;
}

function Summary({draft,score,recommendation,aiSummary,signatureRef,startSignature,finalize}:{draft:InspectionDraft;score:number;recommendation:string;aiSummary:()=>Promise<void>;signatureRef:React.RefObject<HTMLCanvasElement|null>;startSignature:(e:React.PointerEvent<HTMLCanvasElement>)=>void;finalize:()=>Promise<void>}) {
  return <div className="inspect-layout"><div className="card"><div className="section-title"><div><h2 className="text-lg font-bold">Inspection summary</h2><p>Review before final report generation.</p></div><span className="chip warn">Reviewer check recommended</span></div><div className="grid grid-3"><div className="card p-3"><div className="label">Overall score</div><div className="text-3xl font-black mt-1">{score}<span className="text-sm text-slate-400"> / 100</span></div></div><div className="card p-3"><div className="label">Findings</div><div className="text-3xl font-black mt-1">{draft.findings.length}</div></div><div className="card p-3"><div className="label">Recommendation</div><div className="text-lg font-black mt-3">{recommendation}</div></div></div><div className="report-section mt-5"><h4>Category coverage</h4><div className="table-wrap"><table><thead><tr><th>Category</th><th>Reviewed</th></tr></thead><tbody>{sections.slice(0,6).map(([name,items])=><tr key={name}><td>{name}</td><td>{Object.keys(draft.sections[name]??{}).length} / {items.length}</td></tr>)}</tbody></table></div></div><div className="report-section mt-5"><div className="flex justify-between items-center"><h4>AI-assisted summary draft</h4><button className="btn" onClick={aiSummary}><Sparkles size={15}/> Generate</button></div><textarea className="mt-2" rows={5} value={draft.reviewerComments} readOnly placeholder="Generate a customer-friendly report summary…"/></div><div className="report-section mt-5"><h4>Inspector signature</h4><canvas ref={signatureRef} onPointerDown={startSignature} width={700} height={180} className="w-full h-44 border rounded-xl bg-white touch-none"/><div className="label mt-2">Sign with mouse, stylus or touch.</div></div></div><div className="card sticky-card"><h3 className="mt-0">Pre-flight checklist</h3><div className="timeline">{["Vehicle identity","Checklist","Faults","Photos","Recommendation","Signature","QR verification"].map((x,i)=><div className="timeline-item" key={x}><strong>{x}</strong><div className="label">{i<draft.findings.length+2?"Complete":"Required"}</div></div>)}</div><button className="btn gold w-full mt-4" onClick={finalize}><FileText size={15}/> Generate report</button></div></div>;
}

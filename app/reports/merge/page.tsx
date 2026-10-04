"use client";

import { useEffect,useState } from "react";
import { FileText,Loader2,Merge,Upload,X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";

export default function PdfStudioPage(){return <AppShell module="reports"><Studio/></AppShell>}

function Studio(){
 const params=useSearchParams(),reportId=params.get("report")||"";const [reportFile,setReportFile]=useState<File|null>(null),[support,setSupport]=useState<File|null>(null),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 useEffect(()=>{if(!reportId)return;fetch("/api/reports").then(r=>r.ok?r.json():[]).then(rows=>{const r=Array.isArray(rows)?rows.find((x:any)=>x.id===reportId):null;if(r)setMessage("Report selected. You can still choose a generated PDF manually if needed.")}).catch(()=>{})},[reportId]);
 async function merge(){
  if(!reportFile||!support){setMessage("Choose both the generated report PDF and the supporting PDF.");return}
  setBusy(true);setMessage("");
  try{
   const base=reportFile;const form=new FormData();form.append("basePdf",base);form.append("attachment",support);
   const r=await fetch(reportId?`/api/reports/${reportId}/merge-pdf`:"/api/reports/standalone/merge-pdf",{method:"POST",body:form});
   if(!r.ok)throw new Error(await r.text()||"Merge failed");
   const blob=await r.blob();const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="OM-Car-Inspection-complete-package.pdf";a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);setMessage("Combined PDF downloaded.");
  }catch(e){setMessage(e instanceof Error?e.message:"Merge failed.")}finally{setBusy(false)}
 }
 return <div className="page"><div className="section-title"><div><h2>PDF Studio</h2><p>Package the inspection report with one additional supporting PDF.</p></div></div>
 <div className="card"><div className="grid grid-2">
  <FilePick title="Generated inspection PDF" file={reportFile} setFile={setReportFile} accept="application/pdf,.pdf"/>
  <FilePick title="Supporting PDF" file={support} setFile={setSupport} accept="application/pdf,.pdf"/>
 </div>
 <div className="om-callout"><FileText size={14}/><span>The generated inspection PDF already contains all synced inspection images. The supporting PDF is appended after the report.</span></div>
 {message&&<div className="om-lookup-message"><X size={13}/><span>{message}</span></div>}
 <button className="om-primary-action om-tool" onClick={merge} disabled={busy||!reportFile||!support}>{busy?<Loader2 className="spin"/>:<Merge size={14}/>} {busy?"Merging…":"Merge & Download Complete PDF"}</button>
 </div></div>
}

function FilePick({title,file,setFile,accept}:{title:string;file:File|null;setFile:(f:File|null)=>void;accept:string}){
 return <label className="om-tool" style={{minHeight:130,display:"flex",flexDirection:"column",alignItems:"flex-start",justifyContent:"center",cursor:"pointer"}}><Upload size={17}/><div><b style={{fontSize:11}}>{title}</b><small>{file?file.name:"Choose PDF"}</small></div><input className="hidden" type="file" accept={accept} onChange={e=>setFile(e.target.files?.[0]||null)}/></label>
}

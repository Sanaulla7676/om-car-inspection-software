"use client";

import { useEffect,useState } from "react";
import { FileText,Loader2,Merge,Upload } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";

export default function PdfStudioPage(){return <AppShell module="reports"><Studio/></AppShell>}

function Studio(){
 const params=useSearchParams(),reportId=params.get("report")||"";
 const [reportFile,setReportFile]=useState<File|null>(null),[support,setSupport]=useState<File|null>(null),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 const [reportName,setReportName]=useState("");
 useEffect(()=>{if(!reportId)return;fetch("/api/reports").then(r=>r.ok?r.json():[]).then(rows=>{const x=Array.isArray(rows)?rows.find((item:any)=>item.id===reportId):null;if(x){setReportName(x.inspections?.inspection_number||x.id)}}).catch(()=>{})},[reportId]);
 async function merge(){
  if(!reportFile||!support){setMessage("Choose both the generated report PDF and the supporting PDF.");return}
  if(reportFile.size>25*1024*1024||support.size>25*1024*1024){setMessage("Each PDF must be 25 MB or smaller.");return}
  setBusy(true);setMessage("");
  try{
   const form=new FormData();form.append("basePdf",reportFile);form.append("attachment",support);
   const endpoint=reportId?`/api/reports/${reportId}/merge-pdf`:"/api/reports/standalone/merge-pdf";
   const r=await fetch(endpoint,{method:"POST",body:form});if(!r.ok)throw new Error(await r.text()||"Merge failed");
   const blob=await r.blob();const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="OM-Car-Inspection-complete-package.pdf";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);setMessage("Combined PDF downloaded successfully.");
  }catch(e){setMessage(e instanceof Error?e.message:"Merge failed.")}finally{setBusy(false)}
 }
 return <div className="page">
  <div className="section-title"><div><h2>PDF Studio</h2><p>{reportName?`Packaging ${reportName} with one supporting document.`:"Merge an inspection report PDF with one supporting document."}</p></div></div>
  <div className="card"><div className="grid grid-2"><FilePick title="Generated inspection PDF" file={reportFile} setFile={setReportFile}/><FilePick title="Supporting PDF" file={support} setFile={setSupport}/></div>
   <div className="om-callout"><FileText size={14}/><span>The generated inspection PDF contains the synced inspection images. The supporting PDF is appended after the report.</span></div>
   {message&&<div className="om-lookup-message"><FileText size={13}/><span>{message}</span></div>}
   <button className="om-primary-action om-tool" onClick={merge} disabled={busy||!reportFile||!support}>{busy?<Loader2 className="spin"/>:<Merge size={14}/>} {busy?"Merging…":"Merge & Download Complete PDF"}</button>
  </div>
 </div>
}
function FilePick({title,file,setFile}:{title:string;file:File|null;setFile:(f:File|null)=>void}){
 return <label className="om-tool" style={{minHeight:130,display:"flex",flexDirection:"column",alignItems:"flex-start",justifyContent:"center",cursor:"pointer"}}><Upload size={17}/><div><b style={{fontSize:11}}>{title}</b><small>{file?file.name:"Choose PDF • max 25 MB"}</small></div><input className="hidden" type="file" accept="application/pdf,.pdf" onChange={e=>setFile(e.target.files?.[0]||null)}/></label>
}

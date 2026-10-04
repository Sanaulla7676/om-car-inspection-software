"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, FileCheck2, FilePlus2, Loader2, Merge, ShieldCheck, Upload, X } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";

export default function MergeReportPage() {
  return <AppShell module="reports"><PdfMergeWorkspace /></AppShell>;
}

function PdfMergeWorkspace() {
  const [reportId, setReportId] = useState("");
  const [basePdf, setBasePdf] = useState<File | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const ready = useMemo(() => Boolean(reportId.trim() && basePdf && attachment), [reportId, basePdf, attachment]);

  function pickAttachment(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setError("");
    setMessage("");
    if (file && file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setAttachment(null);
      setError("Please choose a PDF file.");
      return;
    }
    if (file && file.size > 25 * 1024 * 1024) {
      setAttachment(null);
      setError("Attachment is too large. Maximum size is 25 MB.");
      return;
    }
    setAttachment(file);
  }

  async function merge(event: FormEvent) {
    event.preventDefault();
    if (!ready || !basePdf || !attachment) return;
    setWorking(true);
    setError("");
    setMessage("");
    try {
      const form = new FormData();
      form.append("basePdf", basePdf);
      form.append("attachment", attachment);
      const response = await fetch(`/api/reports/${encodeURIComponent(reportId.trim())}/merge-pdf`, { method: "POST", body: form });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Could not merge the PDFs.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `OM-Car-Inspection-${reportId.trim()}-merged.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setMessage("Merged PDF generated and downloaded successfully.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not merge the PDFs.");
    } finally {
      setWorking(false);
    }
  }

  return <div className="page">
    <div className="section-title">
      <div>
        <div className="btn-row mb-3"><Link href="/reports" className="btn"><ArrowLeft size={15}/> Reports</Link></div>
        <h2>PDF Report Studio</h2>
        <p>Generate one client-ready PDF by combining the inspection report with a supporting PDF such as RC, insurance, PUC, invoice or service history.</p>
      </div>
      <span className="chip success"><ShieldCheck size={14}/> Secure merge</span>
    </div>

    <form onSubmit={merge} className="grid grid-3">
      <div className="card" style={{gridColumn:"span 2"}}>
        <div className="section-title"><div><h2 className="text-lg font-bold">Build final document</h2><p>The inspection report stays first. Your attachment is appended page-for-page.</p></div><span className="chip info"><Merge size={13}/> PDF merge</span></div>
        <div className="field"><label>Report ID</label><input value={reportId} onChange={e=>setReportId(e.target.value)} placeholder="Paste the report UUID" autoComplete="off"/></div>

        <div className="grid grid-2 mt-3">
          <PdfCard title="1. Generated inspection PDF" description="Use the PDF you generated from OM Car Inspection." icon={<FileCheck2/>} file={basePdf} accept="application/pdf" onChange={e=>setBasePdf(e.target.files?.[0] ?? null)} />
          <PdfCard title="2. Supporting PDF" description="Add RC, insurance, PUC, invoice, service history or any other PDF." icon={<FilePlus2/>} file={attachment} accept="application/pdf" onChange={pickAttachment} removable onRemove={()=>setAttachment(null)} />
        </div>

        {error && <div className="mt-4 p-3 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">{error}</div>}
        {message && <div className="mt-4 p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-sm text-emerald-700 flex items-center gap-2"><CheckCircle2 size={16}/>{message}</div>}

        <button className="btn gold mt-5" type="submit" disabled={!ready || working}>
          {working ? <Loader2 size={16} className="animate-spin"/> : <Merge size={16}/>} {working ? "Merging PDFs…" : "Merge & Download Final PDF"}
        </button>
      </div>

      <div className="card sticky-card">
        <h3 className="mt-0">How it works</h3>
        <div className="timeline">
          {["Generate the official inspection PDF","Attach one supporting PDF","Server validates both files","Pages are merged without re-rendering","Final PDF downloads immediately"].map((item,i)=><div className="timeline-item" key={item}><strong>{i+1}. {item}</strong><div className="label">{i===3?"Original page content preserved":"Automatic"}</div></div>)}
        </div>
        <div className="mt-4 p-3 rounded-xl border bg-blue-50 border-blue-100 text-sm text-slate-600"><strong>Safety rule</strong><div className="label mt-1">The merge feature only combines documents. It does not modify inspection findings, scores or report facts.</div></div>
        <div className="mt-3 label flex items-center gap-2"><Upload size={13}/> Maximum supporting PDF: 25 MB</div>
      </div>
    </form>
  </div>;
}

function PdfCard({title,description,icon,file,accept,onChange,removable,onRemove}:{title:string;description:string;icon:React.ReactNode;file:File|null;accept:string;onChange:(event:ChangeEvent<HTMLInputElement>)=>void;removable?:boolean;onRemove?:()=>void}) {
  return <div className={`card p-4 ${file ? "border-emerald-200 bg-emerald-50/40" : ""}`}>
    <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2"><span className="chip info">{icon}</span><strong>{title}</strong></div>{file && removable && <button type="button" className="btn" onClick={onRemove}><X size={14}/></button>}</div>
    <div className="label mt-2">{description}</div>
    <label className="btn mt-4 w-full"><Upload size={15}/> {file ? "Replace PDF" : "Choose PDF"}<input className="hidden" type="file" accept={accept} onChange={onChange}/></label>
    {file && <div className="mt-3 text-sm"><strong className="block truncate">{file.name}</strong><span className="label">{(file.size/1024/1024).toFixed(2)} MB</span></div>}
  </div>;
}

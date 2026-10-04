"use client";

import Link from "next/link";
import { Download, FileText, Merge, Plus, QrCode, Share2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";

const demoReports = [
  { id: "INS-2026-00184", vehicle: "Hyundai Creta • KA01AB1234", version: "v2", generated: "16 Sep 2026 10:22 AM", shared: "WhatsApp + Email" },
  { id: "INS-2026-00185", vehicle: "Tata Nexon EV • KA05MX4455", version: "v1", generated: "16 Sep 2026 12:40 PM", shared: "Not shared" },
];

export default function ReportsPage() {
  return <AppShell module="reports"><ReportsWorkspace /></AppShell>;
}

function ReportsWorkspace() {
  return <div className="page">
    <div className="section-title">
      <div><h2>Reports</h2><p>Branded, versioned and verifiable inspection outputs, with one-click document packaging.</p></div>
      <div className="btn-row">
        <Link href="/reports/merge" className="btn gold"><Merge size={15}/> PDF Studio</Link>
        <Link href="/inspections/new" className="btn primary"><Plus size={15}/> Generate report</Link>
      </div>
    </div>

    <div className="grid grid-3 mb-4">
      <div className="card stat"><div><div className="label">Reports ready</div><div className="num">18</div></div><span className="chip success">Ready</span></div>
      <div className="card stat"><div><div className="label">Verified links</div><div className="num">18</div></div><span className="chip info"><QrCode size={13}/> Active</span></div>
      <div className="card stat"><div><div className="label">Shared this month</div><div className="num">42</div></div><span className="chip">WhatsApp + Email</span></div>
    </div>

    <div className="card">
      <div className="section-title"><div><h2 className="text-lg font-bold">Recent reports</h2><p>Every published report is versioned and independently verifiable.</p></div><Link href="/reports/merge" className="btn"><Merge size={15}/> Merge supporting PDF</Link></div>
      <div className="table-wrap"><table><thead><tr><th>Report</th><th>Vehicle</th><th>Version</th><th>Generated</th><th>Sharing</th><th>Verification</th><th>Actions</th></tr></thead><tbody>{demoReports.map(report=><tr key={report.id}>
        <td><strong>{report.id}</strong><div className="label">Inspection report</div></td>
        <td>{report.vehicle}</td><td>{report.version}</td><td>{report.generated}</td>
        <td><span className={report.shared === "Not shared" ? "chip" : "chip success"}><Share2 size={12}/>{report.shared}</span></td>
        <td><span className="chip info"><QrCode size={12}/> QR active</span></td>
        <td><div className="btn-row"><button className="btn"><FileText size={14}/> Open</button><button className="btn"><Download size={14}/> PDF</button></div></td>
      </tr>)}</tbody></table></div>
      <div className="mt-4 p-4 rounded-xl border bg-slate-50 text-sm text-slate-600 flex items-start gap-3"><Merge size={18} className="mt-0.5"/><div><strong>New: PDF Studio</strong><div className="label mt-1">After generating a report, attach a second PDF such as RC, insurance, PUC or service history and download a single combined client package.</div></div></div>
    </div>
  </div>;
}

import Link from "next/link";
import { ArrowRight, Camera, ClipboardCheck, FileText, LockKeyhole, ShieldCheck, Smartphone } from "lucide-react";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteFooter } from "@/components/site-footer";

export function SoftwareAccess() {
  return (
    <div className="marketing-site om-editorial-home om-software-page">
      <SiteNavigation />
      <main className="om-software-entry">
        <section className="om-software-hero" aria-labelledby="om-software-title">
          <div className="om-software-grid" aria-hidden="true" />
          <div className="om-software-copy">
            <p className="om-software-eyebrow"><span /> OMCAR INSPECTION WORKSPACE</p>
            <h1 id="om-software-title">Your inspection software.<br /><em>Ready wherever you work.</em></h1>
            <p className="om-software-lead">Access the live vehicle inspection workspace from your desktop, tablet or phone. Record findings, attach photo evidence and prepare structured inspection reports online.</p>
            <div className="om-software-actions">
              <Link className="om-software-primary" href="/login?next=%2Finspections%2Fnew">Open inspection software <ArrowRight size={17} /></Link>
              <Link className="om-software-secondary" href="/admin"><ShieldCheck size={16} /> Admin portal</Link>
            </div>
            <p className="om-software-note"><LockKeyhole size={14} /> Staff and administrator access is protected by sign-in.</p>
          </div>
          <div className="om-software-visual" aria-label="Inspection software features">
            <div className="om-software-window">
              <div className="om-software-window-top"><span><i /> <i /> <i /></span><b>OMCAR / FIELD WORKSPACE</b><span className="om-software-live"><span /> ONLINE</span></div>
              <div className="om-software-preview-heading"><small>NEW INSPECTION</small><h2>Vehicle condition report</h2><p>Inspection checklist · Photo evidence · Report review</p></div>
              <div className="om-software-preview-steps">
                <div className="is-done"><span><ClipboardCheck size={15} /></span><div><b>Vehicle details</b><small>Registration and identity</small></div><ShieldCheck size={15} /></div>
                <div><span><Camera size={15} /></span><div><b>Capture evidence</b><small>Photos from camera or gallery</small></div><Smartphone size={15} /></div>
                <div><span><FileText size={15} /></span><div><b>Generate report</b><small>Review and export a PDF</small></div><ArrowRight size={15} /></div>
              </div>
              <div className="om-software-preview-footer"><span><i /> Secure staff workspace</span><span>Responsive · Online</span></div>
            </div>
            <div className="om-software-float om-software-float-top"><Camera size={16} /><span><b>Evidence first</b><small>Attach photos to findings</small></span></div>
            <div className="om-software-float om-software-float-bottom"><FileText size={16} /><span><b>Clear reports</b><small>One workflow, end to end</small></span></div>
          </div>
        </section>
        <section className="om-software-feature-strip" aria-label="Software capabilities">
          <article><span><ClipboardCheck size={18} /></span><div><b>Guided inspection</b><p>Work through the existing checklist and capture vehicle details.</p></div></article>
          <article><span><Camera size={18} /></span><div><b>Photo evidence</b><p>Use a compatible mobile camera picker or choose existing files.</p></div></article>
          <article><span><FileText size={18} /></span><div><b>Inspection reports</b><p>Review inspection records and continue to report generation.</p></div></article>
        </section>
        <section className="om-software-bottom-cta">
          <div><p className="om-software-eyebrow"><span /> START FROM ANY DEVICE</p><h2>Open the workspace and continue your inspection.</h2><p>The public homepage remains available at Home. Inspection records require the appropriate staff account.</p></div>
          <Link className="om-software-primary" href="/login?next=%2Finspections%2Fnew">Sign in and start <ArrowRight size={17} /></Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

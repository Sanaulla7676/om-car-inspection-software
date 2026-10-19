import Link from "next/link";
import { ArrowRight, Camera, CheckCircle2, ClipboardCheck, FileText, ShieldCheck } from "lucide-react";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteFooter } from "@/components/site-footer";

const findings = [
  { severity: "MODERATE", title: "Example paint-finish variation", section: "Exterior panels", detail: "A real inspector would record the exact panel, observation, limits of the check and any recommended follow-up." },
  { severity: "MINOR", title: "Example tyre-wear observation", section: "Tyres and wheels", detail: "A real report would include measured tread depth where available and a clear photo of the relevant tyre." },
  { severity: "PASS", title: "Example cabin-control check", section: "Interior and controls", detail: "A real report would identify which controls were tested and note anything that could not be verified." },
];

export default function SampleReportPage() {
  return <div className="marketing-site sample-report-page">
    <SiteNavigation />
    <main className="sample-report-main">
      <section className="sample-report-intro">
        <p className="om-home-eyebrow"><span /> REPORT FORMAT PREVIEW</p>
        <h1>See how an inspection report should explain its findings.</h1>
        <p>This is an illustrative layout showing the type of information a structured vehicle report can contain. It is not a real inspection, customer record, score or claim about an inspected vehicle.</p>
        <div className="sample-report-actions">
          <Link href="/book-inspection" className="om-home-button om-home-button-primary">Request a vehicle inspection <ArrowRight size={16}/></Link>
          <Link href="/masterclass" className="om-home-button om-home-button-secondary">Learn how to inspect <ArrowRight size={16}/></Link>
        </div>
      </section>

      <section className="sample-report-document" aria-labelledby="sample-report-title">
        <div className="sample-report-warning"><ShieldCheck size={16}/> DEMONSTRATION DATA ONLY · NOT A CUSTOMER REPORT</div>
        <header className="sample-report-doc-header">
          <div><p>OMKAR CAR INSPECTION</p><h2 id="sample-report-title">Vehicle condition report</h2><span>Illustrative example · Report version 1</span></div>
          <div className="sample-report-doc-mark"><FileText size={25}/><b>SAMPLE</b></div>
        </header>
        <div className="sample-report-meta-grid">
          <div><span>Vehicle</span><b>Example vehicle · details masked</b></div>
          <div><span>Registration</span><b>XX 00 XX 0000 (example)</b></div>
          <div><span>Inspection type</span><b>Pre-purchase inspection</b></div>
          <div><span>Report status</span><b>Illustrative, not issued</b></div>
        </div>
        <div className="sample-report-score-row">
          <div className="sample-report-score"><strong>86</strong><span>/ 100</span><small>Example score only</small></div>
          <div><b>Example condition summary</b><p>A real report should summarise observed condition, significant findings, the agreed inspection scope and any limitations. A score never replaces the individual findings.</p></div>
        </div>
        <div className="sample-report-section-heading"><ClipboardCheck size={18}/><h3>Example findings</h3></div>
        <div className="sample-report-findings">
          {findings.map((finding) => <article key={finding.title}>
            <div className={"sample-report-severity sample-report-severity-"+finding.severity.toLowerCase()}>{finding.severity}</div>
            <div><span>{finding.section}</span><h4>{finding.title}</h4><p>{finding.detail}</p></div>
          </article>)}
        </div>
        <div className="sample-report-section-heading"><Camera size={18}/><h3>Photo evidence standard</h3></div>
        <div className="sample-report-evidence-grid">
          <div><span><Camera size={24}/></span><b>Context photo</b><p>Shows where the observation is located on the vehicle.</p></div>
          <div><span><Camera size={24}/></span><b>Detail photo</b><p>Shows the relevant detail clearly enough to review.</p></div>
          <div><span><FileText size={24}/></span><b>Finding reference</b><p>Connects the evidence to the report finding and next step.</p></div>
        </div>
        <p className="sample-report-disclaimer">This page contains demonstration content only. No real vehicle has been assessed for this example. Actual reports must be based on an authorised inspection, with evidence captured by the inspection team and limitations stated honestly.</p>
      </section>
      <section className="sample-report-bottom-cta">
        <CheckCircle2 size={22}/>
        <div><h2>Need a real inspection report?</h2><p>Share the vehicle details and location. The team will confirm scope, availability and pricing before the appointment is final.</p></div>
        <Link href="/book-inspection" className="om-home-button om-home-button-primary">Request inspection <ArrowRight size={16}/></Link>
      </section>
    </main>
    <SiteFooter />
  </div>;
}

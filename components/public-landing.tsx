"use client";

import Link from "next/link";
import {
  ArrowDown, ArrowRight, BadgeCheck, Camera, CarFront, ChartNoAxesCombined,
  Check, CheckCircle2, ClipboardCheck, Clock3, FileCheck2, FileText,
  Gauge, HeartHandshake, ShieldCheck, Star, Users, Wrench
} from "lucide-react";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteFooter } from "@/components/site-footer";

const services = [
  {
    id: "new-pdi",
    number: "01",
    title: "New Vehicle PDI",
    short: "Pre-delivery inspection",
    text: "Check the vehicle carefully before you accept the keys.",
    bullets: ["Exterior and fit-finish checks", "Functional and cabin review", "Handover evidence"],
    href: "/services/new-car-pdi",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=90",
    icon: CarFront,
    tone: "blue"
  },
  {
    id: "old-pda",
    number: "02",
    title: "Old Vehicle PDA",
    short: "Pre-purchase assessment",
    text: "Understand observed condition before you make a buying decision.",
    bullets: ["Body and interior condition", "Mechanical observations", "Road-test notes where agreed"],
    href: "/services/used-car-inspection",
    image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1400&q=90",
    icon: Gauge,
    tone: "amber"
  },
  {
    id: "valuation",
    number: "03",
    title: "Vehicle Valuation",
    short: "Structured condition review",
    text: "Bring inspection findings and refurbishment costs into one view.",
    bullets: ["W / X / Y / Z evaluation", "RF cost worksheet", "Buying-price summary"],
    href: "/services/used-car-pdi",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1400&q=90",
    icon: ChartNoAxesCombined,
    tone: "mint"
  },
  {
    id: "reports",
    number: "04",
    title: "Reports & Documentation",
    short: "Evidence-ready reporting",
    text: "Keep findings, supporting documents and the final PDF together.",
    bullets: ["Photo and video evidence", "Supporting PDF attachments", "Combined downloadable report"],
    href: "/services/inspection-report",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=90",
    icon: FileText,
    tone: "violet"
  }
];

const strengths = [
  { title: "Structured inspection", text: "Separate sections keep checks organised and repeatable.", icon: ClipboardCheck, tone: "blue" },
  { title: "Reference-based evaluation", text: "Use the worksheet's W / X / Y / Z and condition codes.", icon: ChartNoAxesCombined, tone: "gold" },
  { title: "2D inspection guides", text: "Choose a system and use labelled diagrams to guide observations.", icon: CarFront, tone: "blue" },
  { title: "Image & video evidence", text: "Attach visual context to the inspection record.", icon: Camera, tone: "mint" },
  { title: "Combine multiple PDFs", text: "Review and merge supporting documents into one package.", icon: FileCheck2, tone: "violet" },
  { title: "Clear and practical", text: "A responsive layout helps the workflow stay easy to follow.", icon: ShieldCheck, tone: "gold" }
];

const workflow = [
  { number: "01", title: "Choose the inspection", text: "Start a New PDI, Old Vehicle PDA or valuation.", icon: ClipboardCheck, tone: "amber" },
  { number: "02", title: "Complete the checklist", text: "Record the selected condition codes and observations.", icon: CheckCircle2, tone: "blue" },
  { number: "03", title: "Add evidence", text: "Upload photos, video and relevant documents.", icon: Camera, tone: "mint" },
  { number: "04", title: "Review the report", text: "Check the details before generating the PDF.", icon: FileText, tone: "violet" },
  { number: "05", title: "Download or share", text: "Download the report or merge supporting PDFs.", icon: ArrowDown, tone: "rose" }
];

const audiences = [
  { title: "Car dealers", image: "https://images.unsplash.com/photo-1562519819-016930ada31b?auto=format&fit=crop&w=900&q=88", alt: "Vehicles displayed at an automotive showroom" },
  { title: "Individual buyers", image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=88", alt: "Driver checking a vehicle before a journey" },
  { title: "Corporate fleets", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=88", alt: "Vehicle ready for fleet use" },
  { title: "Insurance teams", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=88", alt: "Documents being reviewed at a desk" },
  { title: "Leasing companies", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=88", alt: "Premium vehicle side view" },
  { title: "Automotive businesses", image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=900&q=88", alt: "Vehicle being inspected in a workshop" }
];

const expectations = [
  { title: "The details are easier to review", text: "Findings are grouped into a consistent inspection workflow.", icon: ClipboardCheck },
  { title: "Evidence stays with the record", text: "Keep photos, videos and documents close to the relevant report.", icon: Camera },
  { title: "Next steps are clearer", text: "A report can record observed issues, limitations and follow-up actions.", icon: HeartHandshake }
];

export default function PublicLanding() {
  return (
    <div className="marketing-site home-page luxury-home">
      <SiteNavigation />
      <main>
        <section className="lux-hero" aria-labelledby="lux-hero-title">
          <div className="lux-hero-copy">
            <p className="lux-eyebrow"><span /> PROFESSIONAL · ACCURATE · TRUSTED</p>
            <h1 id="lux-hero-title">CAR INSPECTION<br /><span>MADE SIMPLE.</span></h1>
            <p className="lux-hero-description">Complete vehicle inspection, structured valuation and professional reports, all in one clear workflow.</p>
            <div className="lux-hero-promises">
              <div><span><ShieldCheck size={18} /></span><b>Detailed<br />inspection</b></div>
              <div><span><ChartNoAxesCombined size={18} /></span><b>Structured<br />valuation</b></div>
              <div><span><Clock3 size={18} /></span><b>Clear<br />workflow</b></div>
              <div><span><Users size={18} /></span><b>Built for<br />professionals</b></div>
            </div>
            <div className="lux-hero-actions">
              <Link href="/book-inspection" className="lux-button lux-button-gold">Start an inspection <ArrowRight size={16} /></Link>
              <Link href="/services/inspection-report" className="lux-button lux-button-white"><FileText size={15} /> View report features</Link>
            </div>
            <p className="lux-hero-footnote"><Check size={14} /> Evidence-first records · Clear scope · Practical reporting</p>
          </div>
          <div className="lux-hero-visual" aria-label="Mr. Omkar in an automotive workshop">
            <img src="/omkar-inspection-hero.webp" alt="Mr. Omkar standing confidently in a modern automotive inspection workshop" fetchPriority="high" />
            <div className="lux-hero-fade" />
            <div className="lux-hero-signature"><span>Omkar</span><b>MR. OMKAR</b><small>Automotive inspection</small></div>
            <div className="lux-hero-stamp"><span><BadgeCheck size={21} /></span><div><b>Evidence-led</b><small>Inspection workflow</small></div></div>
          </div>
        </section>

        <section className="lux-service-grid" id="services" aria-label="Inspection services">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article className={"lux-service-card tone-" + service.tone} id={service.id} key={service.id}>
                <div className="lux-service-copy">
                  <div className="lux-service-heading">
                    <span className="lux-service-icon"><Icon size={22} /></span>
                    <div><small>{service.number} / SERVICE</small><h2>{service.title}</h2></div>
                  </div>
                  <p className="lux-service-short">{service.short}</p>
                  <p className="lux-service-text">{service.text}</p>
                  <ul>{service.bullets.map((bullet) => <li key={bullet}><Check size={13} /> {bullet}</li>)}</ul>
                  <Link href={service.href as any} className="lux-round-link" aria-label={"Explore " + service.title}><ArrowRight size={18} /></Link>
                </div>
                <div className="lux-service-photo"><img src={service.image} alt="" loading="lazy" /></div>
              </article>
            );
          })}
        </section>

        <section className="lux-proof-strip" aria-label="Platform capabilities">
          <div><span><CarFront size={20} /></span><div><b>PDI + PDA</b><small>Two inspection journeys</small></div></div>
          <div><span><ChartNoAxesCombined size={20} /></span><div><b>W / X / Y / Z</b><small>Structured valuation sheet</small></div></div>
          <div><span><Camera size={20} /></span><div><b>Photo + video</b><small>Attach supporting evidence</small></div></div>
          <div><span><FileCheck2 size={20} /></span><div><b>One PDF package</b><small>Combine reports & attachments</small></div></div>
        </section>

        <section className="lux-section lux-why" aria-labelledby="lux-why-title">
          <div className="lux-section-heading">
            <p className="lux-eyebrow"><span /> A MORE CLEARLY STRUCTURED PROCESS</p>
            <h2 id="lux-why-title">Why choose <em>Omkar</em> Car Inspection?</h2>
            <p>Professional inspection, organised valuation and transparent documentation.</p>
          </div>
          <div className="lux-strength-grid">
            {strengths.map((item) => {
              const Icon = item.icon;
              return <article className="lux-strength-card" key={item.title}><span className={"lux-strength-icon tone-" + item.tone}><Icon size={21} /></span><h3>{item.title}</h3><p>{item.text}</p></article>;
            })}
          </div>
        </section>

        <section className="lux-section lux-workflow" aria-labelledby="lux-workflow-title">
          <div className="lux-section-heading">
            <p className="lux-eyebrow"><span /> FROM INSPECTION TO DOCUMENTATION</p>
            <h2 id="lux-workflow-title">How it works</h2>
            <p>From the first checklist to a reviewed, downloadable report.</p>
          </div>
          <div className="lux-workflow-row">
            {workflow.map((item, index) => {
              const Icon = item.icon;
              return <article className={"lux-workflow-step tone-" + item.tone} key={item.number}><div className="lux-workflow-icon"><Icon size={23} /><span>{item.number}</span></div><h3>{item.title}</h3><p>{item.text}</p>{index < workflow.length - 1 && <div className="lux-workflow-connector" aria-hidden="true"><ArrowRight size={16} /></div>}</article>;
            })}
          </div>
        </section>

        <section className="lux-about" id="about" aria-label="About Mr. Omkar">
          <div className="lux-about-portrait"><img src="/omkar-inspection-hero.webp" alt="Mr. Omkar in a professional automotive workshop" loading="lazy" /><span className="lux-about-halo" /></div>
          <div className="lux-about-message">
            <p className="lux-eyebrow"><span /> THE APPROACH</p>
            <h2>Transparency and trust in every inspection.</h2>
            <p>Every record should make the observed condition easier to understand, keep supporting evidence close at hand, and make limitations clear.</p>
            <div className="lux-about-signature">Omkar <small>Automotive inspection</small></div>
          </div>
          <div className="lux-about-points">
            <div><span><ShieldCheck size={18} /></span><b>Professional process</b></div>
            <div><span><BadgeCheck size={18} /></span><b>Structured records</b></div>
            <div><span><FileText size={18} /></span><b>Reports with evidence</b></div>
            <div><span><HeartHandshake size={18} /></span><b>Clearer decisions</b></div>
          </div>
        </section>

        <section className="lux-section lux-customers" id="customers" aria-labelledby="lux-customers-title">
          <div className="lux-section-heading">
            <p className="lux-eyebrow"><span /> WHO IT IS FOR</p>
            <h2 id="lux-customers-title">Designed for automotive decisions</h2>
            <p>Useful for individuals and teams who need a clearer vehicle-condition record.</p>
          </div>
          <div className="lux-audience-grid">
            {audiences.map((audience) => <article className="lux-audience-card" key={audience.title}><img src={audience.image} alt={audience.alt} loading="lazy" /><h3>{audience.title}</h3></article>)}
          </div>
        </section>

        <section className="lux-section lux-expectations" aria-labelledby="lux-expectations-title">
          <div className="lux-section-heading">
            <p className="lux-eyebrow"><span /> WHAT GOOD DOCUMENTATION SHOULD DO</p>
            <h2 id="lux-expectations-title">Clear findings. Better-informed next steps.</h2>
            <p>Rather than unverified star ratings or placeholder testimonials, these are the outcomes the product is designed to support.</p>
          </div>
          <div className="lux-expectation-grid">
            {expectations.map((item) => {
              const Icon = item.icon;
              return <article className="lux-expectation-card" key={item.title}><span><Icon size={22} /></span><h3>{item.title}</h3><p>{item.text}</p><div className="lux-expectation-rule" /></article>;
            })}
          </div>
        </section>

        <section className="lux-final-cta" id="contact">
          <div><p className="lux-eyebrow lux-eyebrow-light"><span /> YOUR NEXT STEP</p><h2>Make the next vehicle decision with more clarity.</h2><p>Choose a service for customers or open the secure inspection application if you are part of the team.</p></div>
          <div className="lux-final-actions"><Link href="/book-inspection" className="lux-button lux-button-gold">Request an inspection <ArrowRight size={16} /></Link><Link href="/dashboard" className="lux-button lux-button-ghost"><ShieldCheck size={16} /> Open admin software</Link></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

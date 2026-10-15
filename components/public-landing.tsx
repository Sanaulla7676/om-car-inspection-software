"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowDown, ArrowRight, BadgeCheck, Camera, CarFront, ChartNoAxesCombined,
  Check, CheckCircle2, ClipboardCheck, Clock3, FileCheck2, FileText,
  Gauge, GraduationCap, HeartHandshake, ShieldCheck, Users, Wrench
} from "lucide-react";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteFooter } from "@/components/site-footer";

type JourneyKey = "new" | "preowned" | "coaching";

const journeys: Record<JourneyKey, {
  label: string; title: string; accent: string; eyebrow: string; description: string;
  details: string[]; href: string; cta: string; image: string; alt: string; badge: string; badgeText: string;
}> = {
  new: {
    label: "New Vehicle PDI",
    title: "VEHICLE PDI",
    accent: "MADE SIMPLE.",
    eyebrow: "BEFORE THE KEYS ARE YOURS",
    description: "A structured pre-delivery inspection to help you review visible condition, accessible functions and the handover details before accepting your new vehicle.",
    details: ["Exterior and fit-finish review", "Cabin and function checks", "Handover notes and evidence"],
    href: "/services/new-car-pdi",
    cta: "Explore New Vehicle PDI",
    image: "/omkar-inspection-hero.webp",
    alt: "Vehicle and inspection professional in a modern automotive workshop",
    badge: "NEW VEHICLE PDI",
    badgeText: "Check the details before handover"
  },
  preowned: {
    label: "Pre-Owned PDI / PDA",
    title: "PRE-OWNED PDI",
    accent: "CLEARER DECISIONS.",
    eyebrow: "BEFORE YOU COMMIT",
    description: "An organised pre-purchase review of the accessible vehicle condition, with observations and follow-up questions kept clear for your buying decision.",
    details: ["Body, paint and interior observations", "Tyres and accessible functions", "Condition notes for follow-up"],
    href: "/services/used-car-inspection",
    cta: "Explore Pre-Owned Inspection",
    image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1600&q=90",
    alt: "Premium vehicle pictured for a pre-purchase inspection",
    badge: "PRE-OWNED INSPECTION",
    badgeText: "Review the condition with a clear scope"
  },
  coaching: {
    label: "PDI Coaching",
    title: "PDI COACHING",
    accent: "BUILT THROUGH PRACTICE.",
    eyebrow: "LEARN THE METHOD",
    description: "Practical vehicle inspection coaching focused on a repeatable check sequence, recognising visible condition concerns, collecting evidence and communicating findings.",
    details: ["Guided inspection workflow", "Condition marking and evidence", "Clear report-writing practice"],
    href: "/masterclass",
    cta: "Explore PDI Coaching",
    image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1600&q=90",
    alt: "Automotive technician inspecting a vehicle in a workshop",
    badge: "PDI COACHING",
    badgeText: "Practical skills for more consistent checks"
  }
};

const services = [
  {
    id: "new-pdi", number: "01", tag: "BEFORE DELIVERY", title: "New Vehicle PDI",
    text: "Review the visible condition and handover items before accepting a new vehicle.",
    bullets: ["Exterior and fit-finish", "Accessible functions", "Handover evidence"],
    href: "/services/new-car-pdi", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=90", icon: CarFront, featured: true
  },
  {
    id: "preowned-pdi", number: "02", tag: "PRE-PURCHASE", title: "Pre-Owned PDI / PDA",
    text: "Organise the visible condition checks and the questions worth following up.",
    bullets: ["Body and interior", "Mechanical observations", "Road-test notes where agreed"],
    href: "/services/used-car-inspection", image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1400&q=90", icon: Gauge, featured: false
  },
  {
    id: "coaching", number: "03", tag: "PRACTICAL LEARNING", title: "PDI Coaching & Training",
    text: "Build a repeatable inspection method and improve how findings are explained.",
    bullets: ["Structured check sequence", "Condition marking practice", "Evidence and report writing"],
    href: "/masterclass", image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1400&q=90", icon: GraduationCap, featured: true
  },
  {
    id: "valuation-reports", number: "04", tag: "DOCUMENTATION", title: "Valuation & Reports",
    text: "Keep condition findings, valuation details and supporting documentation organised.",
    bullets: ["W / X / Y / Z valuation", "Photo and video evidence", "PDF report workflow"],
    href: "/services/inspection-report", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=90", icon: FileText, featured: false
  }
];

const strengths = [
  { title: "Structured inspection", text: "A repeatable process keeps checks organised.", icon: ClipboardCheck },
  { title: "Reference-led assessment", text: "Clear condition codes and worksheet sections.", icon: ChartNoAxesCombined },
  { title: "Labelled 2D guides", text: "Choose a system and mark the relevant parts.", icon: CarFront },
  { title: "Photo & video evidence", text: "Keep the observed context close to the report.", icon: Camera },
  { title: "Combine PDF files", text: "Bring supporting documents into one report package.", icon: FileCheck2 },
  { title: "PDI coaching", text: "Learn the sequence, observation and reporting method.", icon: GraduationCap }
];

const workflow = [
  { number: "01", title: "Choose the service", text: "Select new-vehicle PDI, pre-owned inspection or coaching.", icon: ClipboardCheck },
  { number: "02", title: "Work through checks", text: "Record observations with a clear inspection scope.", icon: CheckCircle2 },
  { number: "03", title: "Add evidence", text: "Attach photos, video and supporting documents.", icon: Camera },
  { number: "04", title: "Review the details", text: "Check the record before producing a report.", icon: FileText },
  { number: "05", title: "Download or share", text: "Save the report and supporting PDFs together.", icon: ArrowDown }
];

const audiences = [
  { title: "Car dealers", image: "https://images.unsplash.com/photo-1562519819-016930ada31b?auto=format&fit=crop&w=900&q=88", alt: "Cars displayed at an automotive showroom" },
  { title: "Individual buyers", image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=88", alt: "Driver in a vehicle" },
  { title: "Corporate fleets", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=88", alt: "Vehicle ready for fleet use" },
  { title: "Inspection teams", image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=900&q=88", alt: "Vehicle in a workshop" },
  { title: "Training groups", image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=88", alt: "Practical technical learning setting" },
  { title: "Automotive businesses", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=88", alt: "Premium vehicle" }
];

const outcomes = [
  { title: "Know what was checked", text: "Keep the scope, findings and limitations visible.", icon: ClipboardCheck },
  { title: "Keep evidence together", text: "Attach photos, videos and supporting documents to the record.", icon: Camera },
  { title: "Build practical confidence", text: "Use a clear process to observe, mark and explain condition.", icon: HeartHandshake }
];

export default function PublicLanding() {
  const [activeJourney, setActiveJourney] = useState<JourneyKey>("new");
  const journey = journeys[activeJourney];

  return (
    <div className="marketing-site home-page luxury-home">
      <SiteNavigation />
      <main>
        <section className="lux-hero" aria-labelledby="lux-hero-title">
          <div className="lux-hero-copy">
            <p className="lux-eyebrow"><span /> VEHICLE PDI · INSPECTION · COACHING</p>
            <div className="lux-journey-selector" role="group" aria-label="Choose your inspection service">
              {(Object.entries(journeys) as [JourneyKey, typeof journeys[JourneyKey]][]).map(([key, item]) => (
                <button key={key} type="button" onClick={() => setActiveJourney(key)} className={activeJourney === key ? "is-active" : ""} aria-pressed={activeJourney === key}>
                  {item.label}
                </button>
              ))}
            </div>
            <div className="lux-hero-copy-dynamic" key={activeJourney}>
              <p className="lux-journey-eyebrow">{journey.eyebrow}</p>
              <h1 id="lux-hero-title"><span className="lux-hero-title-main">{journey.title}</span><span className="lux-hero-title-accent">{journey.accent}</span></h1>
              <p className="lux-hero-description">{journey.description}</p>
            </div>
            <div className="lux-hero-details">
              {journey.details.map((detail) => <span key={detail}><Check size={14} /> {detail}</span>)}
            </div>
            <div className="lux-hero-actions">
              <Link href={journey.href as any} className="lux-button lux-button-gold">{journey.cta} <ArrowRight size={16} /></Link>
              <Link href={activeJourney === "coaching" ? "/book-masterclass" : "/book-inspection"} className="lux-button lux-button-white">{activeJourney === "coaching" ? "Ask about coaching" : "Request an inspection"} <ArrowRight size={15} /></Link>
            </div>
            <p className="lux-hero-footnote"><CheckCircle2 size={14} /> Clear scope · Practical process · Evidence-first documentation</p>
          </div>
          <div className="lux-hero-visual" key={journey.image} aria-label={journey.alt}>
            <img src={journey.image} alt={journey.alt} fetchPriority="high" />
            <div className="lux-hero-fade" />
            <div className="lux-hero-image-label"><span className="lux-hero-image-dot" /><div><b>{journey.badge}</b><small>{journey.badgeText}</small></div></div>
            <div className="lux-hero-image-count"><CarFront size={18} /><span>INSPECT WITH CLARITY</span></div>
          </div>
        </section>

        <section className="lux-service-grid" id="services" aria-label="Vehicle PDI and coaching services">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article className={"lux-service-card" + (service.featured ? " lux-service-featured" : "")} id={service.id} key={service.id}>
                <div className="lux-service-copy">
                  <div className="lux-service-heading">
                    <span className="lux-service-icon"><Icon size={22} /></span>
                    <div><small>{service.number} / {service.tag}</small><h2>{service.title}</h2></div>
                  </div>
                  <p className="lux-service-text">{service.text}</p>
                  <ul>{service.bullets.map((bullet) => <li key={bullet}><Check size={13} /> {bullet}</li>)}</ul>
                  <Link href={service.href as any} className="lux-round-link" aria-label={"Explore " + service.title}><ArrowRight size={18} /></Link>
                </div>
                <div className="lux-service-photo"><img src={service.image} alt="" loading="lazy" /></div>
              </article>
            );
          })}
        </section>

        <section className="lux-proof-strip" aria-label="Inspection capabilities">
          <div><span><CarFront size={20} /></span><div><b>New + Pre-Owned PDI</b><small>Choose the right inspection path</small></div></div>
          <div><span><GraduationCap size={20} /></span><div><b>PDI coaching</b><small>Practical training and method</small></div></div>
          <div><span><Camera size={20} /></span><div><b>Photo + video</b><small>Attach supporting evidence</small></div></div>
          <div><span><FileCheck2 size={20} /></span><div><b>PDF documentation</b><small>Review and combine reports</small></div></div>
        </section>

        <section className="lux-section lux-why" aria-labelledby="lux-why-title">
          <div className="lux-section-heading">
            <p className="lux-eyebrow"><span /> BUILT AROUND A CLEAR METHOD</p>
            <h2 id="lux-why-title">Why choose <em>this inspection approach?</em></h2>
            <p>Vehicle PDI and practical coaching, supported by structured checklists and clear documentation.</p>
          </div>
          <div className="lux-strength-grid">
            {strengths.map((item) => {
              const Icon = item.icon;
              return <article className="lux-strength-card" key={item.title}><span className="lux-strength-icon"><Icon size={21} /></span><h3>{item.title}</h3><p>{item.text}</p></article>;
            })}
          </div>
        </section>

        <section className="lux-coaching-band" aria-labelledby="lux-coaching-title">
          <div className="lux-coaching-visual"><img src="/omkar-inspection-hero.webp" alt="Inspection professional and vehicles in a workshop" loading="lazy" /><span className="lux-photo-caption">REAL VEHICLES · PRACTICAL OBSERVATIONS</span></div>
          <div className="lux-coaching-copy">
            <p className="lux-eyebrow"><span /> PRACTICAL LEARNING</p>
            <h2 id="lux-coaching-title">Learn the inspection method. Practise with purpose.</h2>
            <p>Coaching focuses on a repeatable inspection sequence, condition marking, evidence capture and writing findings in plain language. Training details and available sessions should be confirmed directly before enrolment.</p>
            <div className="lux-coaching-points">
              <span><Check size={14} /> Exterior and interior checks</span>
              <span><Check size={14} /> Function and condition observations</span>
              <span><Check size={14} /> Evidence and report writing</span>
            </div>
            <Link href="/masterclass" className="lux-button lux-button-gold">Explore PDI coaching <ArrowRight size={16} /></Link>
          </div>
        </section>

        <section className="lux-section lux-workflow" aria-labelledby="lux-workflow-title">
          <div className="lux-section-heading">
            <p className="lux-eyebrow"><span /> FROM CHECKLIST TO REPORT</p>
            <h2 id="lux-workflow-title">How it works</h2>
            <p>From selecting the right inspection to reviewing the report and evidence.</p>
          </div>
          <div className="lux-workflow-row">
            {workflow.map((item, index) => {
              const Icon = item.icon;
              return <article className="lux-workflow-step" key={item.number}><div className="lux-workflow-icon"><Icon size={23} /><span>{item.number}</span></div><h3>{item.title}</h3><p>{item.text}</p>{index < workflow.length - 1 && <div className="lux-workflow-connector" aria-hidden="true"><ArrowRight size={16} /></div>}</article>;
            })}
          </div>
        </section>

        <section className="lux-about" id="about" aria-label="Our approach">
          <div className="lux-about-portrait"><img src="/omkar-inspection-hero.webp" alt="Vehicle inspection professional at work" loading="lazy" /><span className="lux-about-halo" /></div>
          <div className="lux-about-message">
            <p className="lux-eyebrow"><span /> OUR APPROACH</p>
            <h2>Clear observations. Useful evidence. Better-informed decisions.</h2>
            <p>The goal is to document what was observed, keep the scope and limitations clear, and make important follow-up questions easy to see. No owner name or personal claim is assumed in this presentation.</p>
            <div className="lux-about-signature">OMKAR <small>Vehicle inspection · PDI coaching</small></div>
          </div>
          <div className="lux-about-points">
            <div><span><ShieldCheck size={18} /></span><b>Structured process</b></div>
            <div><span><BadgeCheck size={18} /></span><b>Clear condition records</b></div>
            <div><span><FileText size={18} /></span><b>Reports with evidence</b></div>
            <div><span><HeartHandshake size={18} /></span><b>Practical coaching</b></div>
          </div>
        </section>

        <section className="lux-section lux-customers" id="customers" aria-labelledby="lux-customers-title">
          <div className="lux-section-heading">
            <p className="lux-eyebrow"><span /> WHO IT IS FOR</p>
            <h2 id="lux-customers-title">For buyers, professionals and learners</h2>
            <p>Inspection and coaching options for different vehicle-related needs.</p>
          </div>
          <div className="lux-audience-grid">
            {audiences.map((audience) => <article className="lux-audience-card" key={audience.title}><img src={audience.image} alt={audience.alt} loading="lazy" /><h3>{audience.title}</h3></article>)}
          </div>
        </section>

        <section className="lux-section lux-expectations" aria-labelledby="lux-expectations-title">
          <div className="lux-section-heading">
            <p className="lux-eyebrow"><span /> BUILT FOR CLARITY</p>
            <h2 id="lux-expectations-title">A process you can follow and explain</h2>
            <p>These are the intended product outcomes, not fabricated customer ratings or performance claims.</p>
          </div>
          <div className="lux-expectation-grid">
            {outcomes.map((item) => {
              const Icon = item.icon;
              return <article className="lux-expectation-card" key={item.title}><span><Icon size={22} /></span><h3>{item.title}</h3><p>{item.text}</p><div className="lux-expectation-rule" /></article>;
            })}
          </div>
        </section>

        <section className="lux-final-cta" id="contact">
          <div><p className="lux-eyebrow"><span /> YOUR NEXT STEP</p><h2>Choose vehicle PDI or build your inspection skills.</h2><p>Explore a customer inspection service or review the practical coaching programme.</p></div>
          <div className="lux-final-actions"><Link href="/services/new-car-pdi" className="lux-button lux-button-gold">Explore vehicle PDI <ArrowRight size={16} /></Link><Link href="/masterclass" className="lux-button lux-button-white"><GraduationCap size={16} /> PDI coaching</Link></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

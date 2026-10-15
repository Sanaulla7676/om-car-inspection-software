"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, CheckCircle2, ClipboardCheck, FileText, Gauge, GraduationCap, ScanSearch, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteEffects } from "@/components/site-effects";
import { guidePages } from "@/lib/marketing-content";

const slides = [
  {
    phrase: "you buy.",
    eyebrow: "PRE-PURCHASE CLARITY",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=2200&q=88",
    alt: "Vehicle technician reviewing a car in a workshop"
  },
  {
    phrase: "you drive.",
    eyebrow: "A BETTER HANDOVER",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=2200&q=88",
    alt: "Automotive specialist checking a vehicle"
  },
  {
    phrase: "you decide.",
    eyebrow: "EVIDENCE-LED REPORTING",
    image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=2200&q=88",
    alt: "Vehicle maintenance and inspection work"
  }
];

const serviceCards = [
  { slug:"used-car-inspection", label:"PRE-PURCHASE", title:"Used-car inspection", text:"Understand visible condition, questions and limitations before committing to a purchase.", image:"https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=82", icon:ScanSearch },
  { slug:"new-car-pdi", label:"BEFORE DELIVERY", title:"New-car PDI", text:"Review fit, finish, accessible functions and handover items before delivery.", image:"https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=82", icon:ClipboardCheck },
  { slug:"used-car-pdi", label:"HANDOVER RECORD", title:"Used-vehicle PDI", text:"Document observed condition at handover with a clear, repeatable checklist.", image:"https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1000&q=82", icon:ShieldCheck },
  { slug:"vehicle-diagnostics", label:"WARNING LIGHTS", title:"Diagnostic observations", text:"Record symptoms and scan findings without confusing a code with a full diagnosis.", image:"https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=82", icon:Gauge },
  { slug:"inspection-report", label:"CLEAR DOCUMENTATION", title:"Inspection reports", text:"Connect important findings to evidence, severity, limitations and next steps.", image:"https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=82", icon:FileText },
  { slug:"fleet-vehicle-inspection", label:"REPEATABLE WORKFLOWS", title:"Fleet inspections", text:"Standardise records and follow-up actions across a changing vehicle fleet.", image:"https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1000&q=82", icon:Wrench }
];

const guideFeatured = [
  guidePages.find((page) => page.slug === "used-car-inspection-checklist")!,
  guidePages.find((page) => page.slug === "new-car-pdi-checklist")!,
  guidePages.find((page) => page.slug === "understanding-obd-codes")!,
];

const days = [
  ["DAY 01", "The inspection method", "Vehicle identity, scope, safe working habits and the order of checks."],
  ["DAY 02", "Body, paint and exterior", "Panels, glass, lamps, tyres, wheels and documenting visible signs."],
  ["DAY 03", "Engine-bay fundamentals", "Safe visual observations, fluids where accessible, hoses and leak clues."],
  ["DAY 04", "Cabin and diagnostics", "Interior controls, warning lamps and an introduction to OBD code context."],
  ["DAY 05", "Road tests and reporting", "Authorised test observations, evidence photos, severity and plain-language reports."],
  ["DAY 06", "Supervised live practice", "Run a guided checklist, review findings and practise explaining limitations."]
];

const faqs = [
  ["Can an inspection guarantee that a car has no faults?", "No. A point-in-time inspection has limits. Hidden, intermittent and inaccessible issues may require separate diagnosis."],
  ["Is new-car PDI the same as regular servicing?", "No. PDI reviews the accessible condition and handover items. Scheduled maintenance and repairs follow their own procedures."],
  ["Does the six-day masterclass guarantee a job or income?", "No. It is a practical learning outline, not a promise of placement, certification or earnings."],
  ["How do I access the inspection software?", "Use the Inspection Software item in the capsule navigation. It opens the existing /dashboard application route, not a copied demo."]
];

export default function PublicLanding() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = slides[activeSlide];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActiveSlide((value) => (value + 1) % slides.length), 5200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="marketing-site home-page">
      <SiteEffects />
      <SiteNavigation />
      <main>
        <section className="home-hero" aria-label="OM Car Inspection introduction">
          <div className="hero-background-stack" aria-hidden="true">
            {slides.map((item, index) => <div key={item.phrase} className={"hero-background-image" + (index === activeSlide ? " is-active" : "")} style={{ backgroundImage: "url(" + item.image + ")" }} />)}
          </div>
          <div className="hero-grid-overlay" aria-hidden="true" />
          <div className="hero-orbit orbit-one" aria-hidden="true" />
          <div className="hero-orbit orbit-two" aria-hidden="true" />
          <div className="home-hero-content">
            <div className="home-hero-copy">
              <p className="eyebrow eyebrow-on-dark"><span className="eyebrow-live-dot" /> VEHICLE INSPECTION · PRACTICAL TRAINING</p>
              <p className="hero-caption-live" key={slide.eyebrow}><Sparkles size={14} /> {slide.eyebrow}</p>
              <h1 className="home-hero-title"><span className="hero-line-fixed">Inspect before</span><span className="hero-line-switch shiny-heading" key={slide.phrase}>{slide.phrase}</span></h1>
              <p className="home-hero-description">A more structured way to assess vehicle condition, document what you see and know which questions deserve a closer look.</p>
              <div className="home-hero-actions">
                <Link className="site-button-v2 button-bright" href="/services"><span>Explore services</span><ArrowRight size={16} /></Link>
                <Link className="site-button-v2 button-glass" href="/book-inspection"><span>Request an inspection</span><ArrowRight size={16} /></Link>
              </div>
              <div className="hero-confidence-points">
                <span><CheckCircle2 size={15} /> Defined scope</span>
                <span><CheckCircle2 size={15} /> Evidence-first notes</span>
                <span><CheckCircle2 size={15} /> Clear limitations</span>
              </div>
            </div>
            <div className="hero-side-panel site-spotlight" data-reveal>
              <div className="side-panel-top"><span className="panel-overline">THE OM METHOD</span><span className="panel-status"><i /> PROCESS-LED</span></div>
              <div className="hero-scan-art" aria-hidden="true"><div className="scan-car-outline"><span /><span /><span /></div><div className="scan-sweep" /></div>
              <div className="side-panel-bottom"><span>01 / OBSERVE</span><span>02 / RECORD</span><span>03 / REVIEW</span></div>
              <div className="hero-side-note"><ShieldCheck size={15} /><span>Findings stay tied to what was actually checked.</span></div>
            </div>
          </div>
          <div className="hero-bottom-row">
            <a className="hero-scroll-cue" href="#services"><span className="scroll-cue-line" /> SCROLL TO EXPLORE <ArrowDown size={14} /></a>
            <div className="hero-slide-controls" aria-label="Choose hero message">
              {slides.map((item, index) => <button key={item.phrase} type="button" onClick={() => setActiveSlide(index)} className={index === activeSlide ? "is-active" : ""} aria-label={"Show slide " + (index + 1) + ": " + item.phrase}><span /></button>)}
              <span>0{activeSlide + 1} <i>/ 0{slides.length}</i></span>
            </div>
          </div>
        </section>

        <section className="proof-rail" aria-label="Inspection approach">
          <div><span className="proof-rail-icon"><ScanSearch size={18} /></span><p><b>Structured inspection</b><small>Checks organised by area</small></p></div>
          <div><span className="proof-rail-icon"><FileText size={18} /></span><p><b>Evidence-led reporting</b><small>Findings linked to context</small></p></div>
          <div><span className="proof-rail-icon"><ShieldCheck size={18} /></span><p><b>Honest limitations</b><small>Clear about what was not checked</small></p></div>
          <div><span className="proof-rail-icon"><GraduationCap size={18} /></span><p><b>Practical learning</b><small>Six-day guided outline</small></p></div>
        </section>

        <section className="site-section-v2 services-section-v2" id="services">
          <div className="site-container-v2">
            <div className="section-heading-v2" data-reveal>
              <div><p className="eyebrow"><span className="eyebrow-live-dot" /> INSPECTION SERVICES</p><h2>Choose the check<br /><span>that fits the question.</span></h2></div>
              <p className="section-intro-v2">A buyer preparing to purchase, a driver collecting a new car and a team managing vehicles need different checklists. Start with the right page.</p>
            </div>
            <div className="service-card-grid-v2">
              {serviceCards.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article className="service-card-v2 site-spotlight" data-reveal data-reveal-delay={index * 65} key={item.slug}>
                    <Link href={"/services/" + item.slug} className="service-card-link">
                      <div className="service-card-photo"><img src={item.image} alt="" loading="lazy" /><span className="service-card-index">0{index + 1}</span><span className="service-photo-arrow"><ArrowRight size={17} /></span></div>
                      <div className="service-card-copy-v2"><div className="service-card-kicker"><Icon size={14} /><span>{item.label}</span></div><h3>{item.title}</h3><p>{item.text}</p><span className="card-read-link">View service details <ArrowRight size={14} /></span></div>
                    </Link>
                  </article>
                );
              })}
            </div>
            <div className="section-bottom-action" data-reveal><Link href="/services" className="text-link-v2">View all inspection services <ArrowRight size={15} /></Link></div>
          </div>
        </section>

        <section className="site-section-v2 method-section-v2">
          <div className="site-container-v2 method-grid-v2">
            <div className="method-copy-v2" data-reveal>
              <p className="eyebrow"><span className="eyebrow-live-dot" /> A BETTER PROCESS</p>
              <h2>Not just a tick-box.<br /><span>A record you can use.</span></h2>
              <p>Each inspection should make the scope clear, distinguish observations from assumptions, and show the next step when an issue needs more investigation.</p>
              <Link href="/services/inspection-report" className="site-button-v2 button-dark">What makes a useful report <ArrowRight size={15} /></Link>
            </div>
            <div className="method-visual site-spotlight" data-reveal>
              <div className="method-visual-top"><span>INSPECTION NOTE</span><span className="method-visual-code">OM / 03</span></div>
              <div className="inspection-report-demo">
                <div className="report-demo-header"><span className="report-demo-mark">OM</span><div><b>Condition record</b><small>Example layout · illustrative only</small></div><span className="report-demo-status">REVIEW</span></div>
                <div className="report-demo-line large" /><div className="report-demo-line" /><div className="report-demo-line medium" />
                <div className="report-demo-evidence"><div /><div /><div /></div>
                <div className="report-demo-foot"><span><CheckCircle2 size={14} /> Observations recorded</span><span>Limitations noted</span></div>
              </div>
              <div className="method-floating-badge"><ShieldCheck size={17} /><span><b>Evidence first</b><small>Keep the context with the finding</small></span></div>
            </div>
          </div>
        </section>

        <section className="site-section-v2 masterclass-section-v2" id="masterclass">
          <div className="site-container-v2">
            <div className="masterclass-shell-v2">
              <div className="masterclass-background-glow" aria-hidden="true" />
              <div className="masterclass-head-v2" data-reveal>
                <p className="eyebrow eyebrow-on-dark"><span className="eyebrow-live-dot" /> PRACTICAL LEARNING</p>
                <h2>Six days.<br /><span>Real inspection fundamentals.</span></h2>
                <p>A guided learning outline that moves from safe observation to writing and explaining a structured inspection report. Confirm the actual batch details before enrolling.</p>
                <Link href="/masterclass" className="site-button-v2 button-bright">Explore the masterclass <ArrowRight size={15} /></Link>
              </div>
              <div className="masterclass-days-v2">
                {days.map((day, index) => <Link href="/masterclass" className="masterclass-day-v2" data-reveal data-reveal-delay={index * 55} key={day[0]}><span className="masterclass-day-number">{day[0]}</span><div><h3>{day[1]}</h3><p>{day[2]}</p></div><ArrowRight size={16} /></Link>)}
              </div>
            </div>
          </div>
        </section>

        <section className="site-section-v2 guides-section-v2">
          <div className="site-container-v2">
            <div className="section-heading-v2" data-reveal>
              <div><p className="eyebrow"><span className="eyebrow-live-dot" /> KNOW BEFORE YOU GO</p><h2>Useful guides.<br /><span>Clearer questions.</span></h2></div>
              <p className="section-intro-v2">Understand what a check can show, what it cannot prove, and when to seek a specialist opinion.</p>
            </div>
            <div className="guide-feature-grid">
              {guideFeatured.map((guide, index) => <article className="guide-feature-card site-spotlight" data-reveal data-reveal-delay={index * 80} key={guide.slug}><span className="guide-feature-number">GUIDE / 0{index + 1}</span><h3>{guide.title}</h3><p>{guide.intro}</p><Link href={"/guides/" + guide.slug} className="text-link-v2">Read the guide <ArrowRight size={15} /></Link></article>)}
            </div>
            <div className="section-bottom-action" data-reveal><Link href="/guides" className="text-link-v2">Browse all learning guides <ArrowRight size={15} /></Link></div>
          </div>
        </section>

        <section className="faq-section-v2">
          <div className="site-container-v2 faq-layout-v2">
            <div data-reveal><p className="eyebrow"><span className="eyebrow-live-dot" /> GOOD TO KNOW</p><h2>Clear answers<br /><span>before you book.</span></h2><p className="faq-intro-v2">The exact inspection scope depends on access, vehicle condition, available tools and what you request.</p><Link href="/faq" className="text-link-v2">Read all FAQs <ArrowRight size={15} /></Link></div>
            <div className="faq-list-v2">
              {faqs.map(([question, answer], index) => <details className="faq-item-v2" data-reveal data-reveal-delay={index * 55} key={question}><summary><span>{question}</span><i /></summary><div className="faq-answer-v2"><p>{answer}</p></div></details>)}
            </div>
          </div>
        </section>

        <section className="home-cta-v2">
          <div className="site-container-v2 home-cta-inner-v2" data-reveal>
            <div><p className="eyebrow eyebrow-on-dark"><span className="eyebrow-live-dot" /> YOUR NEXT STEP</p><h2>Know what you're<br /><span>looking at.</span></h2><p>Choose a service, explore the learning resources, or open the existing inspection software.</p></div>
            <div className="home-cta-actions-v2"><Link href="/book-inspection" className="site-button-v2 button-bright">Request an inspection <ArrowRight size={15} /></Link><Link href="/masterclass" className="site-button-v2 button-glass">Explore training <ArrowRight size={15} /></Link><Link href="/dashboard" className="home-cta-software"><ShieldCheck size={15} /> Open inspection software <ArrowRight size={13} /></Link></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

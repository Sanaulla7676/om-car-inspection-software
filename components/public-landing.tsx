"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight, ArrowRight, BadgeCheck, Camera, CarFront, Check,
  CheckCircle2, ClipboardCheck, FileCheck2, FileText, GraduationCap,
  Gauge, ShieldCheck, Wrench
} from "lucide-react";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteFooter } from "@/components/site-footer";
import { ScrollMotion } from "@/components/scroll-motion";
import { CoachingInquiryForm } from "@/components/coaching-inquiry-form";

const SUV_IMAGE = "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/af834010-4b06-4bb8-9ed5-9f42b14c3220.png";
const SPORT_IMAGE = "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/fd170dfd-8d3f-4205-9b9c-5cc1fa429cfb.png";
const INSPECTION_IMAGE = "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/9ded0ab3-2c6c-4815-b563-d0a46c973a66.png";

const slides = [
  {
    id: "new-pdi",
    index: "01",
    tab: "New Vehicle PDI",
    kicker: "BEFORE THE KEYS ARE YOURS",
    title: "VEHICLE PDI",
    accent: "BEFORE DELIVERY.",
    description: "Pre-delivery checks for your new vehicle, with visible condition, accessible functions and handover items recorded in a structured report.",
    cta: "Explore New Vehicle PDI",
    href: "/services/new-car-pdi",
    image: SUV_IMAGE,
    alt: "Metallic luxury SUV in a bright premium showroom",
    imageTag: "NEW VEHICLE PDI",
    imageNote: "Inspect the details before handover"
  },
  {
    id: "preowned",
    index: "02",
    tab: "Pre-Owned PDI / PDA",
    kicker: "BEFORE YOU COMMIT",
    title: "PRE-OWNED CHECKS",
    accent: "CLEARER DECISIONS.",
    description: "Review visible body condition, cabin wear, tyres and accessible functions before committing to a pre-owned vehicle.",
    cta: "Explore Pre-Owned Inspection",
    href: "/services/used-car-inspection",
    image: SPORT_IMAGE,
    alt: "Graphite performance coupe in a warm, high-end studio",
    imageTag: "PRE-OWNED INSPECTION",
    imageNote: "Record condition and follow-up points"
  },
  {
    id: "coaching",
    index: "03",
    tab: "PDI Coaching",
    kicker: "LEARN THE INSPECTION METHOD",
    title: "PDI COACHING",
    accent: "BUILT THROUGH PRACTICE.",
    description: "Learn a repeatable vehicle-inspection sequence, condition marking, evidence capture and clear report writing through practical coaching.",
    cta: "Explore PDI Coaching",
    href: "/masterclass",
    image: INSPECTION_IMAGE,
    alt: "Vehicle inspector using a paint thickness gauge beside a black SUV in a bright workshop",
    imageTag: "PDI COACHING",
    imageNote: "Observe, mark, document and explain"
  }
];

const services = [
  {
    number: "01", label: "NEW VEHICLE", title: "New Vehicle PDI",
    intro: "Check a new vehicle before accepting delivery.",
    points: ["Exterior fit and finish", "Cabin and accessible functions", "Handover items and evidence"],
    href: "/services/new-car-pdi", image: SUV_IMAGE, icon: CarFront
  },
  {
    number: "02", label: "PRE-OWNED VEHICLE", title: "Pre-Owned PDI / PDA",
    intro: "Document the observed condition before purchase.",
    points: ["Panels, paint, glass and lights", "Tyres, cabin and visible concerns", "Findings that need follow-up"],
    href: "/services/used-car-inspection", image: SPORT_IMAGE, icon: Gauge
  },
  {
    number: "03", label: "PRACTICAL LEARNING", title: "PDI Coaching",
    intro: "Practise the steps used in a structured inspection.",
    points: ["Walk-through inspection sequence", "Condition codes and observation", "Evidence and report writing"],
    href: "/masterclass", image: INSPECTION_IMAGE, icon: GraduationCap
  },
  {
    number: "04", label: "DOCUMENTATION", title: "Valuation & Reports",
    intro: "Keep condition findings and documents together.",
    points: ["W / X / Y / Z worksheet", "Photo and video evidence", "Report PDF and supporting files"],
    href: "/services/inspection-report", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=90", icon: FileText
  }
];

const checkSystems = [
  { code: "W", title: "Exterior", detail: "Body panels, glass, lights, visible paint and exterior defects." },
  { code: "X", title: "Interior", detail: "Cabin trim, seats, roof lining, cleaning and visible interior defects." },
  { code: "Y", title: "Function", detail: "Engine-related observations, electrical systems, steering, brakes and controls." },
  { code: "Z", title: "Frame", detail: "Frame and structural inspection observations recorded by component." }
];

const workflow = [
  { number: "01", title: "Choose the inspection", detail: "New PDI, pre-owned inspection or coaching.", icon: ClipboardCheck },
  { number: "02", title: "Record each check", detail: "Use the relevant checklist and condition code.", icon: CheckCircle2 },
  { number: "03", title: "Attach evidence", detail: "Add photos, videos and supporting files.", icon: Camera },
  { number: "04", title: "Review the report", detail: "Check observations, valuation and attachments.", icon: FileCheck2 }
];

export default function PublicLanding() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[activeSlide];

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % slides.length), 3600);
    return () => window.clearInterval(timer);
  }, [paused, activeSlide]);

  function chooseSlide(index: number) {
    setActiveSlide(index);
    setPaused(true);
    window.setTimeout(() => setPaused(false), 8000);
  }

  return (
    <div className="marketing-site home-page luxury-home luxury-motion-site">
      <ScrollMotion />
      <SiteNavigation />
      <main>
        <section className="lux-editorial-hero" aria-labelledby="lux-hero-title">
          <div className="lux-editorial-hero-head">
            <div className="lux-editorial-headline" key={slide.id + "-heading"}>
              <p className="lux-eyebrow lux-race-eyebrow"><span /> VEHICLE PDI · PRE-OWNED INSPECTION · COACHING</p>
              <p className="lux-slide-kicker">{slide.kicker}</p>
              <h1 id="lux-hero-title" className="lux-racing-title">
                <span>{slide.title}</span>
                <span className="lux-racing-accent">{slide.accent}</span>
              </h1>
            </div>
            <div className="lux-editorial-headline-side" key={slide.id + "-copy"}>
              <p>{slide.description}</p>
              <Link href={slide.href as any} className="lux-button lux-button-gold">{slide.cta} <ArrowRight size={16} /></Link>
              <Link href="#services" className="lux-text-link">View all services <ArrowDownRight size={15} /></Link>
            </div>
          </div>

          <div className="lux-hero-carousel-controls" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <div className="lux-carousel-tabs" role="tablist" aria-label="Featured services">
              {slides.map((item, index) => (
                <button key={item.id} type="button" role="tab" aria-selected={activeSlide === index} className={activeSlide === index ? "is-active" : ""} onClick={() => chooseSlide(index)}>
                  <span>{item.index}</span>{item.tab}
                </button>
              ))}
            </div>
            <div className="lux-carousel-status"><span>{slide.index}</span><i /><span>03</span></div>
          </div>

          <div className="lux-hero-fullbleed" key={slide.id + "-image"} aria-label={slide.alt}>
            <img src={slide.image} alt={slide.alt} fetchPriority="high" />
            <div className="lux-image-caption">
              <span className="lux-image-caption-marker"><Check size={15} /></span>
              <div><b>{slide.imageTag}</b><small>{slide.imageNote}</small></div>
            </div>
            <div className="lux-image-index">OM / {slide.index}</div>
          </div>
          <div className="lux-hero-underbar">
            <span><BadgeCheck size={15} /> Clear scope before inspection</span>
            <span><ShieldCheck size={15} /> Evidence-led reporting</span>
            <span><GraduationCap size={16} /> Practical PDI coaching</span>
          </div>
        </section>

        <section className="lux-service-section" id="services">
          <div className="lux-section-title-row" data-gsap-reveal>
            <div><p className="lux-eyebrow"><span /> INSPECTION & LEARNING</p><h2>Choose what you need.</h2></div>
            <p>Choose a service to see its scope, typical checks and the next step.</p>
          </div>
          <div className="lux-service-grid">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article className="lux-service-card lux-service-featured" key={service.number} data-gsap-reveal>
                  <Link href={service.href as any} className="lux-service-img-link" aria-label={"Explore " + service.title}>
                    <img src={service.image} alt="" loading="lazy" data-gsap-image />
                    <span className="lux-service-index">{service.number}</span>
                    <span className="lux-service-arrow"><ArrowRight size={17} /></span>
                  </Link>
                  <div className="lux-service-card-body">
                    <span className="lux-service-tag">{service.label}</span>
                    <h3>{service.title}</h3>
                    <p>{service.intro}</p>
                    <ul>{service.points.map((point) => <li key={point}><Check size={13} />{point}</li>)}</ul>
                    <Link href={service.href as any} className="lux-service-link">Explore service <ArrowRight size={15} /></Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="lux-worksheet-section" id="valuation-reports">
          <div className="lux-worksheet-copy" data-gsap-reveal>
            <p className="lux-eyebrow"><span /> INSPECTION WORKSHEET</p>
            <h2>One inspection. Four clearly marked areas.</h2>
            <p>For valuation workflows, keep the findings grouped by the same worksheet references used in the form.</p>
            <Link href="/services/inspection-report" className="lux-button lux-button-white">See report details <ArrowRight size={15} /></Link>
          </div>
          <div className="lux-code-grid">
            {checkSystems.map((item) => <article className="lux-code-card" key={item.code} data-gsap-reveal><div><span>{item.code}</span><h3>{item.title}</h3></div><p>{item.detail}</p><ArrowRight size={15} /></article>)}
          </div>
        </section>

        <section className="lux-training-section" id="coaching">
          <div className="lux-training-image" data-gsap-image><img src={INSPECTION_IMAGE} alt="An inspector checking vehicle body condition in a bright workshop" loading="lazy" /><div className="lux-training-photo-label">PRACTICAL PDI COACHING</div></div>
          <div className="lux-training-copy" data-gsap-reveal>
            <p className="lux-eyebrow"><span /> TRAINING & COACHING</p>
            <h2>Learn the inspection sequence. Build your confidence through practice.</h2>
            <p>Coaching focuses on the practical workflow: where to look, how to record a finding, when to capture evidence and how to explain what could not be verified.</p>
            <div className="lux-training-list">
              <span><Check size={14} /> Exterior and interior checks</span>
              <span><Check size={14} /> Function and condition observations</span>
              <span><Check size={14} /> Evidence and report writing</span>
            </div>
            <div className="lux-training-actions"><Link href="/masterclass" className="lux-button lux-button-gold">Training outline <ArrowRight size={15} /></Link><a href="#coaching-enquiry" className="lux-text-link">Ask about a batch <ArrowDownRight size={15} /></a></div>
          </div>
        </section>

        <section className="lux-process-section">
          <div className="lux-section-title-row" data-gsap-reveal>
            <div><p className="lux-eyebrow"><span /> THE WORKFLOW</p><h2>From check to report.</h2></div>
            <p>Each stage has a purpose, from recording an observation to reviewing the final document.</p>
          </div>
          <div className="lux-process-grid">
            {workflow.map((item) => {
              const Icon = item.icon;
              return <article className="lux-process-step" key={item.number} data-gsap-reveal><span className="lux-step-number">{item.number}</span><span className="lux-step-icon"><Icon size={21} /></span><h3>{item.title}</h3><p>{item.detail}</p></article>;
            })}
          </div>
        </section>

        <CoachingInquiryForm />

        <section className="lux-final-contact">
          <div data-gsap-reveal><p className="lux-eyebrow"><span /> NEXT STEP</p><h2>Vehicle to inspect? Skills to learn?</h2><p>Select a service or enquire about practical coaching. The team will need to confirm the scope, availability, location and any fees before a booking is final.</p></div>
          <div className="lux-final-contact-actions"><Link href="/services/new-car-pdi" className="lux-button lux-button-gold">New Vehicle PDI <ArrowRight size={15} /></Link><Link href="/services/used-car-inspection" className="lux-button lux-button-white">Pre-Owned Inspection <ArrowRight size={15} /></Link><Link href="/login" className="lux-separate-login"><ShieldCheck size={15} /> Team sign in</Link></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

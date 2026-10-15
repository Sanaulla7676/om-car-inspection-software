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

const VERNA_IMAGE = "https://htcms-prod-images.s3.ap-south-1.amazonaws.com/htmobile1/hyundai_new-verna/images/colours_hyundai-verna_titan-grey_1920x1033.jpg";
const FORTUNER_IMAGE = "https://imgd.aeplcdn.com/0X0/n/cw/ec/44709/fortuner-exterior-right-front-three-quarter-20.jpeg?isig=0&q=80";
const THAR_IMAGE = "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/40087/thar-exterior-right-front-three-quarter-37.jpeg?isig=0&q=80";
const MERCEDES_IMAGE = "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/178525/glc-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80";
const XUV700_IMAGE = "https://cdn-s3.autocarindia.com/Mahindra/xuv700/_KMC0974.JPG";
const INSPECTION_IMAGE = "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/9ded0ab3-2c6c-4815-b563-d0a46c973a66.png";
const REPORT_IMAGE = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=90";
const REFERENCE_HERO_IMAGE = "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/1a208753-0e6c-434b-b10f-ded45c12cfa0.png";

const vehicleLineup = [
  { name: "Hyundai Verna", type: "SEDAN · NEW VEHICLE PDI", image: VERNA_IMAGE, alt: "Hyundai Verna sedan in Titan Grey" },
  { name: "Toyota Fortuner", type: "SUV · HANDOVER INSPECTION", image: FORTUNER_IMAGE, alt: "Toyota Fortuner SUV front three-quarter view" },
  { name: "Mahindra Thar", type: "SUV · PRE-OWNED INSPECTION", image: THAR_IMAGE, alt: "Mahindra Thar off-road SUV" },
  { name: "Mercedes-Benz GLC", type: "PREMIUM VEHICLE INSPECTION", image: MERCEDES_IMAGE, alt: "Mercedes-Benz GLC SUV front three-quarter view" },
  { name: "Mahindra XUV700", type: "SUV · CONDITION REVIEW", image: XUV700_IMAGE, alt: "Mahindra XUV700 SUV on Indian roads" }
];

const slides = [
  {
    id: "verna-pdi", index: "01", tab: "New Vehicle PDI",
    kicker: "BEFORE YOU ACCEPT DELIVERY",
    title: "NEW VEHICLE PDI", accent: "INSPECT BEFORE HANDOVER.",
    description: "A structured new-car handover check for visible paint and panel condition, cabin finish, accessible functions and delivery documents.",
    cta: "Explore New Vehicle PDI", href: "/services/new-car-pdi",
    image: VERNA_IMAGE, alt: "Hyundai Verna sedan in Titan Grey",
    imageTag: "HYUNDAI VERNA · NEW PDI", imageNote: "Check fit, finish and handover details"
  },
  {
    id: "fortuner-pdi", index: "02", tab: "SUV Inspection",
    kicker: "CHECK THE DETAILS, NOT THE ASSUMPTIONS",
    title: "SUV INSPECTION", accent: "LOOK BEYOND THE SHINE.",
    description: "Review visible bodywork, glass, wheels, cabin condition and accessible features before accepting or purchasing an SUV such as a Fortuner.",
    cta: "Explore Vehicle Inspection", href: "/services/used-car-inspection",
    image: FORTUNER_IMAGE, alt: "Toyota Fortuner SUV front three-quarter view",
    imageTag: "TOYOTA FORTUNER", imageNote: "Structured exterior and function checks"
  },
  {
    id: "thar-preowned", index: "03", tab: "Pre-Owned PDI / PDA",
    kicker: "BEFORE YOU COMMIT",
    title: "PRE-OWNED PDI", accent: "KNOW THE CONDITION.",
    description: "Record visible wear and damage, tyre and wheel condition, cabin observations and items that need closer assessment before a used-car purchase.",
    cta: "Explore Pre-Owned Inspection", href: "/services/used-car-inspection",
    image: THAR_IMAGE, alt: "Mahindra Thar SUV in an outdoor setting",
    imageTag: "MAHINDRA THAR · PRE-OWNED", imageNote: "Capture observations and follow-up points"
  },
  {
    id: "mercedes-premium", index: "04", tab: "Premium Vehicles",
    kicker: "DETAILS DESERVE A CLOSER LOOK",
    title: "PREMIUM CAR PDI", accent: "EVERY DETAIL MATTERS.",
    description: "A consistent inspection method for premium cars, documenting visible condition, accessible functions, equipment and areas requiring specialist verification.",
    cta: "See Inspection Scope", href: "/services/new-car-pdi",
    image: MERCEDES_IMAGE, alt: "Mercedes-Benz GLC SUV front three-quarter view",
    imageTag: "MERCEDES-BENZ GLC", imageNote: "Document condition clearly and consistently"
  },
  {
    id: "pdi-coaching", index: "05", tab: "PDI Coaching",
    kicker: "LEARN THE METHOD. PRACTISE THE CHECKS.",
    title: "PDI COACHING", accent: "BUILT THROUGH PRACTICE.",
    description: "Practical coaching in inspection order, condition marking, evidence capture and writing reports that separate observation from assumption.",
    cta: "Explore PDI Coaching", href: "/masterclass",
    image: INSPECTION_IMAGE, alt: "Vehicle inspector checking paint condition beside an SUV in a workshop",
    imageTag: "PDI COACHING & TRAINING", imageNote: "Observe, mark, document and explain"
  }
];
const services = [
  {
    number: "01", label: "NEW VEHICLE", title: "New Vehicle PDI",
    intro: "Inspect a factory-new vehicle before handover sign-off.",
    points: ["Exterior fit and finish", "Cabin and accessible functions", "Handover items and evidence"],
    href: "/services/new-car-pdi", image: VERNA_IMAGE, icon: CarFront
  },
  {
    number: "02", label: "PRE-OWNED VEHICLE", title: "Pre-Owned PDI / PDA",
    intro: "Record visible condition before you commit to a used vehicle.",
    points: ["Panels, paint, glass and lights", "Tyres, cabin and visible concerns", "Findings that need follow-up"],
    href: "/services/used-car-inspection", image: THAR_IMAGE, icon: Gauge
  },
  {
    number: "03", label: "PRACTICAL LEARNING", title: "PDI Coaching",
    intro: "Learn a repeatable PDI checklist and evidence workflow.",
    points: ["Walk-through inspection sequence", "Condition codes and observation", "Evidence and report writing"],
    href: "/masterclass", image: INSPECTION_IMAGE, icon: GraduationCap
  },
  {
    number: "04", label: "DOCUMENTATION", title: "Valuation & Reports",
    intro: "Keep condition findings and documents together.",
    points: ["W / X / Y / Z worksheet", "Photo and video evidence", "Report PDF and supporting files"],
    href: "/services/inspection-report", image: REPORT_IMAGE, icon: FileText
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
  // Open with the exact hero reference supplied by the user, then transition to the live PDI slides.
  const [activeSlide, setActiveSlide] = useState(-1);
  const [previousSlide, setPreviousSlide] = useState(-1);
  const [isChangingSlide, setIsChangingSlide] = useState(false);
  const [paused, setPaused] = useState(false);
  const isReferenceOpening = activeSlide < 0;
  const slide = slides[activeSlide < 0 ? 0 : activeSlide];

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => {
      setPreviousSlide(activeSlide);
      setActiveSlide((current) => current < 0 ? 0 : (current + 1) % slides.length);
      setIsChangingSlide(true);
      window.setTimeout(() => setIsChangingSlide(false), 680);
    }, isReferenceOpening ? 4500 : 3600);
    return () => window.clearTimeout(timer);
  }, [paused, activeSlide, isReferenceOpening]);

  function chooseSlide(index: number) {
    if (index !== activeSlide) {
      setPreviousSlide(activeSlide);
      setActiveSlide(index);
      setIsChangingSlide(true);
      window.setTimeout(() => setIsChangingSlide(false), 680);
    }
    setPaused(true);
    window.setTimeout(() => setPaused(false), 8000);
  }

  return () => window.clearInterval(timer);
  }, [paused, activeSlide]);

  function chooseSlide(index: number) {
    if (index !== activeSlide) {
      setPreviousSlide(activeSlide);
      setActiveSlide(index);
      setIsChangingSlide(true);
      window.setTimeout(() => setIsChangingSlide(false), 680);
    }
    setPaused(true);
    window.setTimeout(() => setPaused(false), 8000);
  }

  return (
    <div className="marketing-site home-page luxury-home luxury-motion-site">
      <ScrollMotion />
      <SiteNavigation />
      <main>
        <section className={"lux-editorial-hero" + (isReferenceOpening ? " is-reference-opening" : "")} aria-labelledby="lux-hero-title">
          {isReferenceOpening ? (
            <div className="lux-reference-opening-banner" key="reference-opening-banner">
              <img src={REFERENCE_HERO_IMAGE} alt="OMKAR Car Inspection hero with the message Know Your Car Before You Buy and a Toyota Fortuner, featuring inspection services and PDI coaching" fetchPriority="high" />
            </div>
          ) : (
          <div className="lux-live-hero" key={"live-hero-" + slide.id}>
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
            <div className="lux-carousel-status"><span>{slide.index}</span><i /><span>{String(slides.length).padStart(2, "0")}</span></div>
          </div>

          <div className="lux-scroll-expand-story" data-gsap-scroll-story>
            <div className="lux-scroll-expand-sticky">
              <div className="lux-hero-fullbleed" data-gsap-scroll-expand aria-label={slide.alt}>
                <img className="lux-hero-active-image" src={slide.image} alt={slide.alt} fetchPriority="high" />
                {previousSlide >= 0 && previousSlide !== activeSlide && <img className={"lux-hero-previous-image" + (isChangingSlide ? " is-fading" : "")} src={slides[previousSlide].image} alt="" aria-hidden="true" />}
                <div className="lux-scroll-expanded-copy" data-gsap-scroll-copy>
                  <p>{slide.imageTag} <span> / {slide.index}</span></p>
                  <h2>{slide.accent}</h2>
                  <small>{slide.imageNote}</small>
                  <Link href={slide.href as any}>{slide.cta} <ArrowRight size={15} /></Link>
                </div>
                <div className="lux-image-index">OM / {slide.index} — {String(slides.length).padStart(2, "0")}</div>
              </div>
            </div>
          </div>
          <div className="lux-hero-underbar">
            <span><BadgeCheck size={15} /> Clear scope before inspection</span>
            <span><ShieldCheck size={15} /> Evidence-led reporting</span>
            <span><GraduationCap size={16} /> Practical PDI coaching</span>
          </div>
          </div>
          )}
        </section>

        <section className="lux-model-lineup" aria-labelledby="lux-model-lineup-title">
          <div className="lux-model-lineup-head">
            <div><p className="lux-eyebrow"><span /> VEHICLE TYPES WE COVER</p><h2 id="lux-model-lineup-title">Indian roads. Real inspection needs.</h2></div>
            <span className="lux-model-lineup-note">ILLUSTRATIVE MODEL GALLERY</span>
          </div>
          <div className="lux-model-lineup-track">
            {vehicleLineup.map((vehicle, index) => (
              <article className="lux-model-card" key={vehicle.name} data-gsap-reveal>
                <div className="lux-model-image"><img src={vehicle.image} alt={vehicle.alt} loading={index < 2 ? "eager" : "lazy"} /></div>
                <div className="lux-model-meta"><span>{vehicle.type}</span><h3>{vehicle.name}</h3></div>
                <span className="lux-model-index">{String(index + 1).padStart(2, "0")}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="lux-service-section" id="services">
          <div className="lux-section-title-row" data-gsap-reveal>
            <div><p className="lux-eyebrow"><span /> INSPECTION & LEARNING</p><h2>Vehicle PDI and coaching.</h2></div>
            <p>New-car handover checks, pre-owned vehicle inspection, practical PDI coaching and reporting.</p>
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
            <h2>Four worksheet sections.</h2>
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
            <h2>Learn the inspection process hands-on.</h2>
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
            <p>Choose the service, complete the relevant checks, attach evidence and review the report.</p>
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

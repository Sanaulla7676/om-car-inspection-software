"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  BookOpen,
  Camera,
  CarFront,
  CheckCircle2,
  CircleHelp,
  ClipboardCheck,
  FileCheck2,
  FileText,
  GraduationCap,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Wrench
} from "lucide-react";
import { HomeHero } from "@/components/home-hero";
import { HeroIntro } from "@/components/hero-intro";
import { PdiPathwayHub } from "@/components/pdi-pathway-hub";
import { RoadJourney } from "@/components/road-journey";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteEffects } from "@/components/site-effects";
import { ScrollMotion } from "@/components/scroll-motion";

const WHATSAPP_URL = "https://wa.me/918880339999";
const INSPECTION_IMAGE = "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/18971d42-3c84-4532-b232-c7a29e9ac3dd.png";
const NEW_CAR_IMAGE = "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/fad6e2f9-5ecd-460d-a37b-53ce7f3b6bfb.png";
const TRAINING_IMAGE = "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/cc9e2296-b59d-45ec-ba87-f6af4cf87d45.png";

const services = [
  {
    number: "01",
    label: "NEW VEHICLE",
    title: "Pre-delivery inspection",
    text: "Review visible finish, panels, glass, cabin details, accessible functions and delivery documents before accepting a new car.",
    image: NEW_CAR_IMAGE,
    alt: "Vehicle prepared for a new-car pre-delivery inspection",
    href: "/services/new-car-pdi",
    link: "Explore new-car PDI"
  },
  {
    number: "02",
    label: "PRE-OWNED VEHICLE",
    title: "Used-car condition review",
    text: "Document visible body condition, wear, tyres, cabin details and issues that may warrant a specialist follow-up.",
    image: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/40087/thar-exterior-right-front-three-quarter-37.jpeg?isig=0&q=80",
    alt: "Pre-owned vehicle shown for a condition review",
    href: "/services/used-car-inspection",
    link: "Explore pre-owned inspection"
  },
  {
    number: "03",
    label: "REPORTS & EVIDENCE",
    title: "Clear inspection reporting",
    text: "Understand how observations, relevant photographs, inspection scope and limitations are brought together in a report.",
    image: INSPECTION_IMAGE,
    alt: "Inspector documenting vehicle condition",
    href: "/services/inspection-report",
    link: "Explore reporting"
  },
  {
    number: "04",
    label: "PDI TRAINING",
    title: "Learn the inspection method",
    text: "Explore a guided six-day learning path covering inspection sequence, visible checks, evidence capture and report writing.",
    image: TRAINING_IMAGE,
    alt: "Practical vehicle PDI training",
    href: "/masterclass",
    link: "Explore PDI training"
  }
];

const steps = [
  { n: "01", title: "Tell us what you need", text: "Choose an inspection or training path and share the vehicle, location or learning details." },
  { n: "02", title: "Confirm the scope", text: "The team confirms availability, inspection scope, location and fees before finalizing the booking." },
  { n: "03", title: "Inspect and document", text: "Relevant observations and available photo evidence are recorded within the agreed scope." }
];

const faqs = [
  {
    q: "Is my appointment confirmed when I submit a request?",
    a: "No. A request starts the conversation. The team confirms availability, location, scope and fees with you before the booking is final."
  },
  {
    q: "What does a new-car PDI cover?",
    a: "The agreed scope may include visible finish and panels, glass, cabin details, accessible functions and delivery documents. Confirm the exact scope with the team before booking."
  },
  {
    q: "Can I request an inspection before buying a used car?",
    a: "You can submit a request for a pre-owned vehicle condition review. Availability, access to the vehicle and the agreed scope must be confirmed before the appointment."
  },
  {
    q: "Does an inspection guarantee that a car has no faults?",
    a: "No. An inspection records observations within an agreed scope at a point in time. Hidden, inaccessible or intermittent issues may not be identified, and some concerns require a qualified specialist assessment."
  },
  {
    q: "How much does an inspection cost?",
    a: "The fee depends on factors such as vehicle type, location, access and the requested scope. The team confirms the applicable fee before a booking is finalized."
  },
  {
    q: "Where are inspections available?",
    a: "Share your vehicle's location when enquiring. The team will confirm whether the requested location and timing can be supported before you commit."
  },
  {
    q: "What does the six-day PDI training include?",
    a: "The current learning outline covers inspection foundations and exterior checks, cabin and accessible-system observations, evidence and reporting, and guided practice. Batch dates, venue, fees and completion criteria must be confirmed before enrolment."
  },
  {
    q: "Does the training guarantee a job or inspection business income?",
    a: "No. The training is intended to build foundational knowledge and reporting habits. It does not guarantee a job, customers, business outcomes or income."
  }
];

function openWhatsAppEnquiry(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = String(form.get("name") || "").trim();
  const path = String(form.get("path") || "").trim();
  const location = String(form.get("location") || "").trim();
  const vehicle = String(form.get("vehicle") || "").trim();
  const details = String(form.get("details") || "").trim();
  const message = [
    "Hello OMKAR Car Inspection, I would like to enquire.",
    "Name: " + name,
    "Interested in: " + path,
    "Location: " + location,
    vehicle ? "Vehicle details: " + vehicle : "",
    details ? "Additional details: " + details : "",
    "Please confirm availability, scope and fees before booking."
  ].filter(Boolean).join("\n");
  window.open(WHATSAPP_URL + "?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
}

export default function PublicLanding() {
  return (
    <div className="marketing-site om-editorial-home om17-home">
      <HeroIntro />
      <SiteEffects />
      <ScrollMotion />
      {/* 01 / Header and primary navigation */}
      <SiteNavigation />

      <main>
        {/* 02 / Hero: the main value proposition and next action */}
        <HomeHero />

        {/* Animated PDI pathways sit directly beside the hero journey. */}
        <PdiPathwayHub />
        <RoadJourney />

        {/* 03 / Trust strip: factual service principles, not invented statistics */}
        <section className="om17-trust" aria-label="OMKAR inspection principles">
          <div className="om17-trust-inner">
            <div className="om17-trust-intro"><span className="om17-kicker">THE OMKAR APPROACH</span><strong>Clear scope. Relevant evidence. Honest limits.</strong></div>
            <div className="om17-trust-item"><ClipboardCheck size={20} /><span><b>Scope first</b><small>Agree what will be checked</small></span></div>
            <div className="om17-trust-item"><Camera size={20} /><span><b>Evidence-led</b><small>Photos support observations</small></span></div>
            <div className="om17-trust-item"><ShieldCheck size={20} /><span><b>Clear limitations</b><small>Unverified items stay visible</small></span></div>
          </div>
        </section>

        {/* 04 / Customer needs and problems */}
        <section className="om17-section om17-problems" aria-labelledby="om17-problems-title">
          <div className="om17-container om17-problem-layout">
            <div className="om17-section-heading">
              <p className="om17-kicker"><span /> BEFORE YOU MAKE THE DECISION</p>
              <h2 id="om17-problems-title">A car can look right. The details still matter.</h2>
              <p>Whether you are accepting a new car or considering a pre-owned one, you need a clear view of what can be observed and what needs another check.</p>
            </div>
            <div className="om17-problem-list">
              <article><span>01</span><div><h3>Taking delivery of a new car</h3><p>Visible finish, panels, glass, cabin details and available delivery documents deserve a structured review before handover.</p></div></article>
              <article><span>02</span><div><h3>Considering a pre-owned car</h3><p>Document visible wear and condition, then identify questions that may need a deeper mechanical or specialist assessment.</p></div></article>
              <article><span>03</span><div><h3>Trying to interpret a finding</h3><p>A photograph is more useful when it is connected to a specific observation, a scope and a clear explanation.</p></div></article>
            </div>
          </div>
        </section>

        {/* 05 / Services, products and training pathways */}
        <section className="om17-section om17-services" aria-labelledby="om17-services-title">
          <div className="om17-container">
            <div className="om17-section-heading om17-heading-split">
              <div><p className="om17-kicker"><span /> SERVICES & LEARNING</p><h2 id="om17-services-title">The right checks for the right moment.</h2></div>
              <p>Explore the service that matches your goal. Exact inspection coverage is agreed before the appointment.</p>
            </div>
            <div className="om17-pathway-grid" aria-label="Choose your OMKAR pathway">
              <Link href="/book-inspection" className="om17-pathway-card">
                <span className="om17-pathway-icon"><CarFront size={22} /></span>
                <span className="om17-pathway-copy"><small>FOR CAR OWNERS & BUYERS</small><b>Need a vehicle inspected?</b><span>Request new-car PDI or a pre-owned condition review.</span></span>
                <ArrowRight className="om17-pathway-arrow" size={18} />
              </Link>
              <Link href="/masterclass" className="om17-pathway-card om17-pathway-training">
                <span className="om17-pathway-icon"><GraduationCap size={22} /></span>
                <span className="om17-pathway-copy"><small>FOR STUDENTS & ASPIRING INSPECTORS</small><b>Want to learn PDI?</b><span>Explore the six-day practical learning path.</span></span>
                <ArrowRight className="om17-pathway-arrow" size={18} />
              </Link>
            </div>
            <div className="om17-service-grid">
              {services.map((service) => (
                <article className="om17-service-card" key={service.number}>
                  <Link href={service.href as any} className="om17-service-image" aria-label={service.link}>
                    <img src={service.image} alt={service.alt} loading="lazy" data-gsap-image />
                    <span className="om17-image-number">{service.number}</span>
                    <span className="om17-image-arrow" aria-hidden="true"><ArrowDownRight size={21} /></span>
                  </Link>
                  <div className="om17-service-copy">
                    <p className="om17-card-kicker">{service.label}</p>
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>
                    <Link href={service.href as any} className="om17-text-link">{service.link} <ArrowRight size={15} /></Link>
                  </div>
                </article>
              ))}
            </div>
            <div className="om17-training-outline">
              <div><p className="om17-kicker"><span /> SIX-DAY PDI LEARNING PATH</p><h3>Learn the sequence, not just the checklist.</h3><p>Training details are confirmed before enrolment. This outline describes the intended learning topics, not a job or income promise.</p></div>
              <div className="om17-learning-steps">
                <article><span>DAYS 01–02</span><b>Foundations & exterior</b><p>Inspection order, vehicle identity, panels, paint, glass, lights, tyres and wheels.</p></article>
                <article><span>DAYS 03–04</span><b>Cabin & accessible systems</b><p>Cabin controls, safe visual observations and diagnostic-code awareness.</p></article>
                <article><span>DAY 05</span><b>Evidence & reporting</b><p>Record observations, connect photographs and describe uncertainty.</p></article>
                <article><span>DAY 06</span><b>Guided practice</b><p>Review an inspection sequence and practise customer-ready reporting.</p></article>
              </div>
              <p className="om17-disclaimer">Confirm batch dates, venue, fees, equipment and completion criteria with the team. Training does not guarantee employment or income.</p>
            </div>
          </div>
        </section>

        {/* 06 / Benefits and differentiators */}
        <section className="om17-section om17-benefits" aria-labelledby="om17-benefits-title">
          <div className="om17-container">
            <div className="om17-section-heading">
              <p className="om17-kicker"><span /> WHY THIS APPROACH MATTERS</p>
              <h2 id="om17-benefits-title">Useful information is specific, traceable and honest.</h2>
              <p>OMKAR's stated approach is built around clarity rather than blanket promises. The value is in understanding what was observed and what remains uncertain.</p>
            </div>
            <div className="om17-benefit-grid">
              <article><span><ClipboardCheck size={21} /></span><h3>An agreed scope</h3><p>Know the intended checks before booking, including boundaries and access limitations.</p></article>
              <article><span><Camera size={21} /></span><h3>Evidence with context</h3><p>Relevant photographs help explain a finding instead of acting as decoration.</p></article>
              <article><span><FileCheck2 size={21} /></span><h3>Facts vs. uncertainty</h3><p>Separate direct observations from assumptions, inaccessible areas and items needing follow-up.</p></article>
              <article><span><Wrench size={21} /></span><h3>Practical next questions</h3><p>Use documented observations to decide whether to ask for a specialist check or more information.</p></article>
            </div>
          </div>
        </section>

        {/* 07 / Featured work and report preview */}
        <section className="om17-section om17-featured" aria-labelledby="om17-featured-title">
          <div className="om17-container om17-feature-layout">
            <div className="om17-report-preview" aria-label="Illustrative report layout preview">
              <div className="om17-report-top"><span>OMKAR / REPORT FORMAT</span><span>EXAMPLE LAYOUT</span></div>
              <div className="om17-report-meta"><div><small>REPORT TYPE</small><b>Vehicle condition review</b></div><div><small>RECORD STYLE</small><b>Observation + evidence</b></div></div>
              <div className="om17-report-row"><span className="om17-report-index">01</span><div><b>Observed item</b><p>Describe the visible condition in plain, specific language.</p></div><span className="om17-report-tag">OBSERVED</span></div>
              <div className="om17-report-row"><span className="om17-report-index">02</span><div><b>Photo reference</b><p>Attach the relevant photograph to the related observation.</p></div><span className="om17-report-tag">EVIDENCE</span></div>
              <div className="om17-report-row"><span className="om17-report-index">03</span><div><b>Scope limitation</b><p>Record what could not be verified and what may need follow-up.</p></div><span className="om17-report-tag">LIMIT</span></div>
              <div className="om17-report-bottom"><ShieldCheck size={18} /><span>This is a layout illustration, not an actual vehicle report.</span></div>
            </div>
            <div className="om17-section-heading">
              <p className="om17-kicker"><span /> SEE HOW FINDINGS ARE PRESENTED</p>
              <h2 id="om17-featured-title">A report should explain, not overwhelm.</h2>
              <p>Review the sample report format to understand how observations, relevant evidence and limitations can be presented together.</p>
              <Link href="/sample-report" className="om17-button om17-button-dark">View sample report <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>

        {/* 08 / How the process works */}
        <section className="om17-section om17-process" aria-labelledby="om17-process-title">
          <div className="om17-container">
            <div className="om17-section-heading">
              <p className="om17-kicker"><span /> HOW IT WORKS</p>
              <h2 id="om17-process-title">Three steps. No booking guesswork.</h2>
              <p>A request is not a confirmed appointment. Scope, availability, location and fees must be agreed first.</p>
            </div>
            <div className="om17-process-grid">
              {steps.map((step) => <article key={step.n}><span>{step.n}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}
            </div>
            <div className="om17-centered-link"><Link href="/book-inspection" className="om17-text-link">Request an inspection <ArrowRight size={16} /></Link><Link href="/book-masterclass" className="om17-text-link">Ask about training <ArrowRight size={16} /></Link></div>
          </div>
        </section>

        {/* 09 / Testimonials: honest status until verified customer permission is available */}
        <section className="om17-section om17-testimonials" aria-labelledby="om17-testimonials-title">
          <div className="om17-container om17-testimonial-panel">
            <div className="om17-section-heading">
              <p className="om17-kicker"><span /> CUSTOMER FEEDBACK</p>
              <h2 id="om17-testimonials-title">Trust is earned. Reviews should be real.</h2>
              <p>Customer reviews will be shown here only when genuine feedback is available and the customer has agreed to its use. We will not invent names, quotations or star ratings.</p>
              <div className="om17-feedback-status"><ShieldCheck size={18} /><span><b>Verified feedback only</b><small>Ask the team for the current scope and sample report while customer feedback is being gathered.</small></span></div>
              <Link href="/sample-report" className="om17-text-link">Review the sample report instead <ArrowRight size={15} /></Link>
            </div>
            <div className="om17-quote-mark" aria-hidden="true">“</div>
          </div>
        </section>

        {/* 10 / Case study format: clearly marked illustrative example, never presented as customer evidence */}
        <section className="om17-section om17-case-study" aria-labelledby="om17-case-title">
          <div className="om17-container">
            <div className="om17-section-heading om17-heading-split">
              <div><p className="om17-kicker"><span /> AN EXAMPLE OF THE METHOD</p><h2 id="om17-case-title">From an observation to a clear next step.</h2></div>
              <span className="om17-example-label">ILLUSTRATIVE EXAMPLE · NOT A CUSTOMER CASE</span>
            </div>
            <div className="om17-case-grid">
              <article><span className="om17-case-step">01 / OBSERVE</span><h3>Describe what is visible</h3><p>Example: a visible scuff is noted on an exterior panel. The description should stay factual and avoid guessing its cause.</p></article>
              <article><span className="om17-case-step">02 / DOCUMENT</span><h3>Link supporting evidence</h3><p>Record a clear photo from a useful angle and connect it to the written observation in the report.</p></article>
              <article><span className="om17-case-step">03 / EXPLAIN</span><h3>State the limitation</h3><p>Explain that a visual observation alone does not establish underlying damage. Recommend further assessment when appropriate.</p></article>
            </div>
            <p className="om17-case-note">This example explains a reporting method. It is not evidence from an actual OMKAR inspection and does not describe a real customer's vehicle or outcome.</p>
          </div>
        </section>

        {/* 11 / About the company */}
        <section className="om17-section om17-about" aria-labelledby="om17-about-title">
          <div className="om17-container om17-about-layout">
            <div className="om17-about-mark"><img src="/car-assets/01_dark_blue_SUV.png" alt="Dark blue SUV representing vehicles reviewed by OMKAR" loading="lazy" /><span>OM / INSPECTION</span></div>
            <div className="om17-section-heading">
              <p className="om17-kicker"><span /> ABOUT OMKAR</p>
              <h2 id="om17-about-title">Built around practical checks, not confident guesses.</h2>
              <p>OMKAR brings a process-first approach to vehicle condition reviews: a repeatable checklist, relevant photo evidence, clear findings and an honest record of what still needs verification. The same principles shape the PDI learning roadmap.</p>
              <p>From planning a new-car handover to asking better questions before a used-car purchase, the aim is straightforward: help people make informed decisions with a clearer view of the evidence, the limitations and the next step.</p>
              <div className="om17-about-principles" aria-label="OMKAR approach">
                <span><b>01</b><strong>Observe</strong><small>Use a repeatable sequence</small></span>
                <span><b>02</b><strong>Document</strong><small>Keep context with evidence</small></span>
                <span><b>03</b><strong>Clarify</strong><small>Separate fact from follow-up</small></span>
              </div>
              <Link href="/about" className="om17-text-link">Learn more about OMKAR <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>

        {/* 12 / Pricing and quotation guidance without fabricated rates */}
        <section className="om17-section om17-pricing" aria-labelledby="om17-pricing-title">
          <div className="om17-container">
            <div className="om17-section-heading">
              <p className="om17-kicker"><span /> PRICING & SCOPE</p>
              <h2 id="om17-pricing-title">Know the fee before confirming.</h2>
              <p>We do not display an unverified fixed price here. Request a quote for your vehicle and location; the applicable fee should be confirmed before the booking is finalized.</p>
            </div>
            <div className="om17-price-grid">
              <article><span>01</span><h3>Vehicle and service</h3><p>New-car PDI, pre-owned condition review or a reporting-related request may require different scopes.</p></article>
              <article><span>02</span><h3>Location and access</h3><p>Availability, travel and access to the vehicle affect what can be arranged.</p></article>
              <article><span>03</span><h3>Agreed scope</h3><p>Confirm the checks included, limits, deliverable and any follow-up expectations before committing.</p></article>
            </div>
            <div className="om17-quote-cta"><span><b>Need an exact fee?</b><small>Share the vehicle and location so the team can confirm scope and availability.</small></span><Link href="/book-inspection" className="om17-button om17-button-dark">Request a quote <ArrowRight size={16} /></Link></div>
          </div>
        </section>

        {/* 13 / Frequently asked questions */}
        <section className="om17-section om17-faq" aria-labelledby="om17-faq-title">
          <div className="om17-container om17-faq-layout">
            <div className="om17-section-heading">
              <p className="om17-kicker"><span /> QUESTIONS, ANSWERED</p>
              <h2 id="om17-faq-title">Before you book.</h2>
              <p>Still unsure about the service, scope or training? Start with these practical answers, then confirm your specific requirements with the team.</p>
              <Link href="/faq" className="om17-text-link">Visit the full FAQ page <ArrowRight size={15} /></Link>
            </div>
            <div className="om17-faq-list">
              {faqs.map((item) => <details className="om17-faq-item" key={item.q}><summary><span>{item.q}</span><CircleHelp size={18} /></summary><p>{item.a}</p></details>)}
            </div>
          </div>
        </section>

        {/* 14 / Resources and guides */}
        <section className="om17-section om17-resources" aria-labelledby="om17-resources-title">
          <div className="om17-container">
            <div className="om17-section-heading om17-heading-split">
              <div><p className="om17-kicker"><span /> EXPLORE & UNDERSTAND</p><h2 id="om17-resources-title">Useful information before you decide.</h2></div>
              <p>Start with the report format, learn about inspection services or read the common questions before sending a request.</p>
            </div>
            <div className="om17-resource-grid">
              <Link href="/sample-report" className="om17-resource-card"><span><FileText size={22} /></span><small>REPORT EXAMPLE</small><b>Understand the report layout</b><p>See how observations, evidence and limitations can be organized.</p><i>Open sample report <ArrowRight size={15} /></i></Link>
              <Link href="/guides" className="om17-resource-card"><span><BookOpen size={22} /></span><small>INSPECTION GUIDES</small><b>Prepare better questions</b><p>Explore the available inspection guides and supporting information.</p><i>Explore guides <ArrowRight size={15} /></i></Link>
              <Link href="/faq" className="om17-resource-card"><span><CircleHelp size={22} /></span><small>HELP & CLARITY</small><b>Resolve the practical details</b><p>Review common questions about booking, scope and training.</p><i>Read FAQs <ArrowRight size={15} /></i></Link>
              <Link href="/guides/car-maintenance-checklist" className="om17-resource-card"><span><Wrench size={22} /></span><small>OWNER'S FIELD GUIDE</small><b>Keep your car in better shape</b><p>Track routine checks, notice new warning signs and know when to use a qualified workshop.</p><i>Open maintenance checklist <ArrowRight size={15} /></i></Link>
            </div>
          </div>
        </section>

        {/* 15 / Location and contact */}
        <section className="om17-section om17-contact" aria-labelledby="om17-contact-title">
          <div className="om17-container om17-contact-layout">
            <div className="om17-section-heading">
              <p className="om17-kicker"><span /> LOCATION & AVAILABILITY</p>
              <h2 id="om17-contact-title">Tell us where the vehicle is.</h2>
              <p>Inspection coverage and appointment availability must be confirmed for your location. Share the city or area when enquiring; do not assume every location is currently covered.</p>
            </div>
            <div className="om17-contact-actions">
              <a href="tel:+918880339999" className="om17-contact-link"><Phone size={20} /><span><b>Call OMKAR</b><small>8880339999</small></span><ArrowRight size={17} /></a>
              <a href={WHATSAPP_URL + "?text=" + encodeURIComponent("Hello OMKAR Car Inspection, please confirm inspection availability for my location.")} target="_blank" rel="noopener noreferrer" className="om17-contact-link"><MessageCircle size={20} /><span><b>WhatsApp enquiry</b><small>Ask about scope and availability</small></span><ArrowRight size={17} /></a>
              <div className="om17-contact-note"><MapPin size={18} /><p><b>Service area confirmation</b><br />Location, timing and access are confirmed with you before a booking is finalized.</p></div>
            </div>
          </div>
        </section>

        {/* 16 / Final conversion CTA with a functional WhatsApp enquiry form */}
        <section id="vehicle-inquiry" className="om17-section om17-final" aria-labelledby="om17-final-title">
          <div className="om17-container om17-final-layout">
            <div className="om17-final-copy">
              <p className="om17-kicker om17-kicker-light"><span /> START WITH THE RIGHT DETAILS</p>
              <h2 id="om17-final-title">Make your next move with clearer information.</h2>
              <p>Tell us what you need. Your details will be placed into a WhatsApp message so the team can discuss availability, scope and fees with you.</p>
              <div className="om17-final-reassurance"><CheckCircle2 size={18} /><span>No automatic booking confirmation. The team confirms the details first.</span></div>
            </div>
            <form className="om17-enquiry-form" onSubmit={openWhatsAppEnquiry}>
              <h3>Start an enquiry</h3>
              <label htmlFor="om17-name">Your name</label>
              <input id="om17-name" name="name" autoComplete="name" required maxLength={100} placeholder="Enter your name" />
              <label htmlFor="om17-path">What do you need?</label>
              <select id="om17-path" name="path" required defaultValue="">
                <option value="" disabled>Select a service</option>
                <option>New-car PDI inspection</option>
                <option>Pre-owned vehicle inspection</option>
                <option>Inspection report information</option>
                <option>Six-day PDI training</option>
              </select>
              <label htmlFor="om17-location">Vehicle or course location</label>
              <input id="om17-location" name="location" required maxLength={120} placeholder="City or area" />
              <label htmlFor="om17-vehicle">Vehicle make / model (optional)</label>
              <input id="om17-vehicle" name="vehicle" maxLength={160} placeholder="e.g. make, model and year" />
              <label htmlFor="om17-details">Anything else we should know? (optional)</label>
              <textarea id="om17-details" name="details" rows={3} maxLength={800} placeholder="Share your preferred timing or question" />
              <button type="submit" className="om17-button om17-button-dark">Continue on WhatsApp <MessageCircle size={17} /></button>
              <small>Submitting opens WhatsApp with your message pre-filled. Nothing is sent until you review and send it in WhatsApp.</small>
            </form>
          </div>
        </section>
      </main>

      {/* 17 / Footer and essential navigation */}
      <SiteFooter />
    </div>
  );
}

"use client";

import Link from "next/link";
import {
  ArrowRight, Camera, CarFront, CheckCircle2, ClipboardCheck,
  FileText, GraduationCap, ShieldCheck
} from "lucide-react";
import { HomeHero } from "@/components/home-hero";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteEffects } from "@/components/site-effects";
import { ScrollMotion } from "@/components/scroll-motion";

const services = [
  {
    number: "01",
    label: "NEW VEHICLE",
    title: "Before the handover.",
    text: "Review visible finish, panels, glass, cabin details, accessible functions and delivery documents before accepting your new car.",
    image: "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/fad6e2f9-5ecd-460d-a37b-53ce7f3b6bfb.png",
    alt: "SUV prepared for a new vehicle pre-delivery inspection",
    href: "/services/new-car-pdi",
    link: "Explore new-car PDI"
  },
  {
    number: "02",
    label: "PRE-OWNED VEHICLE",
    title: "Know before you buy.",
    text: "Document visible wear, body condition, tyres, cabin details and issues that may need a closer specialist assessment.",
    image: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/40087/thar-exterior-right-front-three-quarter-37.jpeg?isig=0&q=80",
    alt: "Pre-owned vehicle shown for condition inspection",
    href: "/services/used-car-inspection",
    link: "Explore pre-owned inspection"
  },
  {
    number: "03",
    label: "REPORTS & EVIDENCE",
    title: "Make every finding clear.",
    text: "Connect observations to relevant photographs, explain the agreed inspection scope and make limitations visible.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=90",
    alt: "Report documents arranged on a desk",
    href: "/sample-report",
    link: "View sample report"
  }
];

const steps = [
  { n: "01", title: "Tell us what you need", text: "Choose new-car PDI, pre-owned inspection or training and share the key details." },
  { n: "02", title: "Confirm the scope", text: "The team confirms availability, location, scope and fees before a booking is final." },
  { n: "03", title: "Inspect and document", text: "Relevant observations and available photo evidence are recorded in a clear report." }
];

export default function PublicLanding() {
  return (
    <div className="marketing-site om-editorial-home">
      <SiteEffects />
      <ScrollMotion />
      <SiteNavigation />
      <main>
        <HomeHero />

        <section className="om-editorial-intro site-container-v2" aria-labelledby="om-editorial-intro-title">
          <div className="om-editorial-intro-main" data-gsap-reveal>
            <p className="om-editorial-kicker"><span /> A CLEARER VIEW OF YOUR NEXT CAR</p>
            <h2 id="om-editorial-intro-title">Confidence starts with a closer look.</h2>
          </div>
          <div className="om-editorial-intro-side" data-gsap-reveal>
            <p>A vehicle can look perfect in a showroom or in a listing. A structured inspection helps you record what is visible, what needs attention and what still cannot be confirmed.</p>
            <Link href="/book-inspection" className="om-editorial-text-link">Arrange an inspection <ArrowRight size={16} /></Link>
          </div>
        </section>

        <section className="om-editorial-services" aria-labelledby="om-editorial-services-title">
          <div className="om-editorial-section-head site-container-v2">
            <div data-gsap-reveal>
              <p className="om-editorial-kicker"><span /> OUR SERVICES</p>
              <h2 id="om-editorial-services-title">The right checks for the right moment.</h2>
            </div>
            <p data-gsap-reveal>From the day you collect a new car to the moment you consider a pre-owned one, start with a clear process and evidence you can understand.</p>
          </div>
          <div className="om-editorial-service-grid site-container-v2">
            {services.map((service) => (
              <article className="om-editorial-service-card" key={service.number} data-reveal>
                <Link href={service.href as any} className="om-editorial-service-image">
                  <img src={service.image} alt={service.alt} loading="lazy" data-gsap-image />
                  <span className="om-editorial-image-number">{service.number}</span>
                  <span className="om-editorial-image-arrow"><ArrowRight size={18} /></span>
                </Link>
                <div className="om-editorial-service-copy">
                  <p className="om-editorial-card-kicker">{service.label}</p>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <Link href={service.href as any} className="om-editorial-text-link">{service.link} <ArrowRight size={15} /></Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="om-editorial-story" data-gsap-scroll-story aria-label="Our inspection approach">
          <div className="om-editorial-story-frame" data-gsap-scroll-expand>
            <img src="https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/936fcbb7-1c2c-420f-ab93-c8a897dfb549.png" alt="Vehicle in a professional inspection environment" loading="lazy" />
            <div className="om-editorial-story-copy" data-gsap-scroll-copy>
              <p className="om-editorial-kicker om-editorial-kicker-light"><span /> LOOK CLOSER. DECIDE CLEARER.</p>
              <h2>See the details before you make the decision.</h2>
              <p>An inspection is not a promise that a vehicle is perfect. It is a structured view of its observed condition, the available evidence and the next questions worth asking.</p>
              <Link href="/book-inspection" className="om-editorial-light-link">Plan an inspection <ArrowRight size={16} /></Link>
            </div>
            <span className="om-editorial-story-stamp">OMKAR / INSPECTION NOTES</span>
          </div>
        </section>

        <section className="om-editorial-process site-container-v2" aria-labelledby="om-editorial-process-title">
          <div className="om-editorial-process-heading" data-gsap-reveal>
            <p className="om-editorial-kicker"><span /> HOW IT WORKS</p>
            <h2 id="om-editorial-process-title">A simple process. Clear expectations.</h2>
            <p>Know what happens after you send a request. Your request is not treated as a confirmed booking until details are agreed.</p>
          </div>
          <div className="om-editorial-process-layout">
            <div className="om-editorial-steps">
              {steps.map((step) => (
                <article className="om-editorial-step" key={step.n} data-reveal>
                  <span>{step.n}</span>
                  <div><h3>{step.title}</h3><p>{step.text}</p></div>
                  <ArrowRight size={17} />
                </article>
              ))}
              <Link href="/book-inspection" className="om-editorial-dark-button">Request an inspection <ArrowRight size={16} /></Link>
            </div>
            <div className="om-editorial-process-photo" data-gsap-image>
              <img src="https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/18971d42-3c84-4532-b232-c7a29e9ac3dd.png" alt="Inspector carrying out a practical vehicle check" loading="lazy" />
              <div className="om-editorial-photo-caption"><ShieldCheck size={18} /><span><b>Evidence-led reporting</b><small>Observed facts, limitations and next steps.</small></span></div>
            </div>
          </div>
        </section>

        <section className="om-editorial-training">
          <div className="om-editorial-training-photo" data-gsap-image>
            <img src="https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/cc9e2296-b59d-45ec-ba87-f6af4cf87d45.png" alt="Practical PDI training visual" loading="lazy" />
          </div>
          <div className="om-editorial-training-copy" data-gsap-reveal>
            <p className="om-editorial-kicker"><span /> FOR ASPIRING INSPECTORS</p>
            <h2>Learn the method behind a good inspection.</h2>
            <p>Build foundational skills in inspection sequence, visible condition checks, evidence capture and professional reporting through a guided six-day PDI learning path.</p>
            <div className="om-editorial-training-points">
              <span><CheckCircle2 size={16} /> Practical inspection sequence</span>
              <span><CheckCircle2 size={16} /> Evidence and report writing</span>
              <span><CheckCircle2 size={16} /> Guided practice and feedback</span>
            </div>
            <Link href="/masterclass" className="om-editorial-dark-button">Explore PDI training <ArrowRight size={16} /></Link>
            <p className="om-editorial-note">Batch dates, venue, fees and completion criteria are confirmed before enrolment. Training does not guarantee a job or income.</p>
          </div>
        </section>

        <section className="om-editorial-report site-container-v2">
          <div className="om-editorial-report-copy" data-gsap-reveal>
            <p className="om-editorial-kicker"><span /> WHAT A REPORT SHOULD DO</p>
            <h2>Not just a checklist. A useful record.</h2>
            <p>Relevant photos should support the observations they relate to. A good report also separates what was observed from uncertainty and anything outside the agreed inspection scope.</p>
            <Link href="/sample-report" className="om-editorial-text-link">Explore the sample report <ArrowRight size={16} /></Link>
          </div>
          <div className="om-editorial-report-points">
            <article data-reveal><Camera size={20} /><b>Relevant evidence</b><p>Photographs tied to the finding they help explain.</p></article>
            <article data-reveal><ClipboardCheck size={20} /><b>Structured checks</b><p>A repeatable sequence that makes the scope clearer.</p></article>
            <article data-reveal><FileText size={20} /><b>Clear limitations</b><p>Visible boundaries and practical next steps.</p></article>
          </div>
        </section>

        <section className="om-editorial-last">
          <div className="site-container-v2 om-editorial-last-inner" data-gsap-reveal>
            <p className="om-editorial-kicker om-editorial-kicker-light"><span /> YOUR NEXT STEP</p>
            <h2>Make your next car decision with clearer information.</h2>
            <div><Link href="/book-inspection" className="om-editorial-light-link">Book an inspection <ArrowRight size={16} /></Link><Link href="/masterclass" className="om-editorial-outline-link">Learn PDI <ArrowRight size={16} /></Link></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

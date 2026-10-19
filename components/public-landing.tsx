"use client";

import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CarFront,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  ShieldCheck
} from "lucide-react";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteFooter } from "@/components/site-footer";
import { ScrollMotion } from "@/components/scroll-motion";

const INSPECTION_IMAGE = "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/18971d42-3c84-4532-b232-c7a29e9ac3dd.png";
const TRAINING_IMAGE = "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/cc9e2296-b59d-45ec-ba87-f6af4cf87d45.png";

const learningBlocks = [
  { label: "DAYS 01–02", title: "Foundations and exterior checks", detail: "Inspection order, vehicle identity, safety, panels, paint, glass, lights, tyres and wheels." },
  { label: "DAYS 03–04", title: "Cabin, engine bay and functions", detail: "Safe visual observations, accessible systems, cabin controls and diagnostic-code awareness." },
  { label: "DAY 05", title: "Evidence and reporting", detail: "Record findings clearly, connect relevant photos to observations and explain what still needs checking." },
  { label: "DAY 06", title: "Guided practice and business readiness", detail: "Review a supervised inspection, practise customer-ready reporting and discuss the fundamentals of offering an inspection service." }
];

export default function PublicLanding() {
  return (
    <div className="marketing-site om-home-v2">
      <ScrollMotion />
      <SiteNavigation />
      <main>
        <section className="om-home-hero" aria-labelledby="om-home-title">
          <div className="om-home-hero-copy">
            <p className="om-home-eyebrow"><span /> OMKAR CAR INSPECTION & PDI TRAINING</p>
            <h1 id="om-home-title">Inspect with evidence.<br /><em>Learn the method.</em></h1>
            <p className="om-home-lead">
              We help vehicle owners make clearer decisions with structured new-car PDI and pre-owned inspections. We also train aspiring inspectors in practical checks, evidence capture and professional report writing.
            </p>
            <div className="om-home-hero-actions">
              <Link href="/book-inspection" className="om-home-button om-home-button-primary">Book a vehicle inspection <ArrowRight size={17} /></Link>
              <Link href="/masterclass" className="om-home-button om-home-button-secondary">Explore PDI training <ArrowRight size={17} /></Link>
            </div>
            <div className="om-home-proof-points" aria-label="Our approach">
              <span><CheckCircle2 size={15} /> Clear inspection scope</span>
              <span><Camera size={15} /> Evidence-led findings</span>
              <span><GraduationCap size={15} /> Hands-on learning</span>
            </div>
          </div>
          <div className="om-home-hero-visual">
            <img src={INSPECTION_IMAGE} alt="Automotive inspector demonstrating practical vehicle inspection in a workshop" fetchPriority="high" />
            <div className="om-home-visual-note">
              <span className="om-home-visual-icon"><ShieldCheck size={20} /></span>
              <div><b>Inspect. Document. Explain.</b><small>Make observations clear and traceable.</small></div>
            </div>
            <span className="om-home-visual-index">OM / FIELDWORK</span>
          </div>
        </section>

        <section className="om-home-pathways" aria-labelledby="om-pathways-title">
          <div className="om-home-section-heading">
            <p className="om-home-eyebrow"><span /> START WITH YOUR GOAL</p>
            <h2 id="om-pathways-title">What brings you here?</h2>
            <p>Choose the path that matches what you need. No guessing which menu item is meant for you.</p>
          </div>
          <div className="om-home-path-grid">
            <article className="om-home-path-card">
              <div className="om-home-path-icon"><CarFront size={25} /></div>
              <span className="om-home-card-label">FOR CAR OWNERS & BUYERS</span>
              <h3>Need a car inspected?</h3>
              <p>Request a new-car pre-delivery inspection or a pre-owned vehicle condition review before you make a decision.</p>
              <ul>
                <li><CheckCircle2 size={15} /> Structured checks for the agreed scope</li>
                <li><CheckCircle2 size={15} /> Clear observations and relevant photo evidence</li>
                <li><CheckCircle2 size={15} /> Limitations and follow-up questions made clear</li>
              </ul>
              <Link href="/book-inspection" className="om-home-card-link">Request an inspection <ArrowRight size={16} /></Link>
            </article>
            <article className="om-home-path-card om-home-path-card-training">
              <div className="om-home-path-icon"><GraduationCap size={25} /></div>
              <span className="om-home-card-label">FOR STUDENTS & ASPIRING INSPECTORS</span>
              <h3>Want to learn PDI?</h3>
              <p>Build practical vehicle inspection skills through a guided six-day learning path, from the checklist to evidence and reporting.</p>
              <ul>
                <li><CheckCircle2 size={15} /> Learn a repeatable inspection sequence</li>
                <li><CheckCircle2 size={15} /> Practise recording and explaining findings</li>
                <li><CheckCircle2 size={15} /> Explore the fundamentals of starting an inspection service</li>
              </ul>
              <Link href="/masterclass" className="om-home-card-link">Explore the 6-day masterclass <ArrowRight size={16} /></Link>
            </article>
          </div>
        </section>

        <section className="om-home-evidence" aria-labelledby="om-evidence-title">
          <div className="om-home-evidence-copy">
            <p className="om-home-eyebrow"><span /> EVIDENCE OVER CLAIMS</p>
            <h2 id="om-evidence-title">A useful inspection explains what was found, not just what was checked.</h2>
            <p>A clear report should connect important observations to relevant evidence, explain the inspection scope and identify anything that could not be verified. Photos support the findings; they do not replace a qualified assessment.</p>
            <Link href="/services/inspection-report" className="om-home-button om-home-button-light">Explore reporting approach <ArrowRight size={16} /></Link>
          </div>
          <div className="om-home-evidence-grid">
            <article><span><ClipboardCheck size={20} /></span><b>Structured checks</b><p>A repeatable sequence helps reduce missed steps.</p></article>
            <article><span><Camera size={20} /></span><b>Relevant evidence</b><p>Capture photos that help explain an observation.</p></article>
            <article><span><FileText size={20} /></span><b>Clear reporting</b><p>Separate observed facts, uncertainty and next steps.</p></article>
          </div>
        </section>

        <section className="om-home-training" aria-labelledby="om-training-title">
          <div className="om-home-training-visual">
            <img src={TRAINING_IMAGE} alt="Promotional visual for the six-day practical vehicle PDI masterclass" loading="lazy" />
          </div>
          <div className="om-home-training-copy">
            <p className="om-home-eyebrow"><span /> PRACTICAL TRAINING · SIX DAYS</p>
            <h2 id="om-training-title">Learn to inspect cars. Understand how the work runs.</h2>
            <p>The masterclass is designed to build foundational inspection skills and reporting habits, with guided practice and an introduction to the practical considerations involved in offering inspection services.</p>
            <div className="om-home-learning-list">
              {learningBlocks.map((block) => (
                <article key={block.label}>
                  <span>{block.label}</span>
                  <div><b>{block.title}</b><p>{block.detail}</p></div>
                </article>
              ))}
            </div>
            <div className="om-home-training-actions">
              <Link href="/masterclass" className="om-home-button om-home-button-primary">View the course outline <ArrowRight size={16} /></Link>
              <Link href="/book-masterclass" className="om-home-text-link">Request the next batch details</Link>
            </div>
            <p className="om-home-disclaimer">Batch dates, venue, fees, equipment and completion criteria must be confirmed before enrolling. Training does not guarantee a job, customers or income.</p>
          </div>
        </section>

        <section className="om-home-booking-flow" aria-labelledby="om-booking-flow-title">
          <div className="om-home-section-heading">
            <p className="om-home-eyebrow"><span /> SIMPLE NEXT STEPS</p>
            <h2 id="om-booking-flow-title">Know what happens after you click.</h2>
          </div>
          <div className="om-home-flow-grid">
            <article><span>01</span><b>Choose a path</b><p>Inspection request or practical PDI training.</p></article>
            <article><span>02</span><b>Share the details</b><p>Tell the team about your vehicle or learning goals.</p></article>
            <article><span>03</span><b>Confirm before committing</b><p>The team confirms availability, scope, fees and next steps. A request is not a confirmed booking.</p></article>
          </div>
          <div className="om-home-final-actions">
            <Link href="/book-inspection" className="om-home-button om-home-button-primary">Request vehicle inspection <ArrowRight size={16} /></Link>
            <Link href="/book-masterclass" className="om-home-button om-home-button-secondary">Request training details <ArrowRight size={16} /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

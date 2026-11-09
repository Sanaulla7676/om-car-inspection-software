import Link from "next/link";
import { ArrowUpRight, ArrowDown } from "lucide-react";

const courseSteps = [
  ["01", "IDENTITY", "Vehicle & records"],
  ["02", "EXTERIOR", "Body, paint & glass"],
  ["03", "MECHANICAL", "Engine-bay observations"],
  ["04", "SYSTEMS", "Cabin, controls & OBD"],
  ["05", "ROAD TEST", "Safe, authorised checks"],
  ["06", "REPORT", "Evidence & clear findings"],
];

export function PdiTrainingHeroAnimation() {
  return (
    <section className="pdi-motion-hero" aria-labelledby="pdi-motion-heading">
      <div className="pdi-motion-topbar">
        <div className="pdi-motion-brand" aria-label="OMCAR inspection academy">
          <span className="pdi-motion-brand-mark">OM</span>
          <span className="pdi-motion-brand-type"><b>OMCAR</b><small>INSPECTION ACADEMY</small></span>
        </div>
        <div className="pdi-motion-top-meta"><i /> SIX-DAY PRACTICAL TRAINING <span>·</span> FIELD METHOD 01—06</div>
      </div>

      <div className="pdi-motion-copy">
        <p className="pdi-motion-kicker"><i /> BUILD REAL INSPECTION SKILLS</p>
        <h1 id="pdi-motion-heading">INSPECT WITH<br /><em>CONFIDENCE.</em></h1>
        <p className="pdi-motion-lead">Learn to assess a vehicle methodically, capture the evidence and explain every finding with clarity.</p>
        <div className="pdi-motion-actions">
          <Link href="/book-masterclass" className="pdi-motion-primary">Enquire about training <ArrowUpRight size={16} /></Link>
          <a href="#masterclass-schedule-heading" className="pdi-motion-secondary">Explore the six-day course <ArrowDown size={14} /></a>
        </div>
      </div>

      <div className="pdi-motion-visual" aria-hidden="true">
        <div className="pdi-motion-visual-halo" />
        <div className="pdi-motion-visual-glow" />
        <div className="pdi-motion-grid" />
        <div className="pdi-motion-orbit pdi-motion-orbit--one" />
        <div className="pdi-motion-orbit pdi-motion-orbit--two" />
        <svg className="pdi-motion-radar" viewBox="0 0 700 420" fill="none">
          <path d="M94 253H606M350 62V354" stroke="rgba(178,215,230,.12)" strokeDasharray="3 9" />
          <ellipse cx="350" cy="250" rx="260" ry="104" stroke="rgba(143,201,224,.25)" strokeDasharray="4 8" />
          <ellipse cx="350" cy="250" rx="205" ry="77" stroke="rgba(34,191,208,.38)" />
          <path d="M120 250a230 230 0 0 1 460 0" stroke="#35c5d5" strokeWidth="2" strokeDasharray="70 24 16 28" className="pdi-motion-radar-arc" />
          <path d="M155 250a195 195 0 0 0 390 0" stroke="rgba(158,203,255,.48)" strokeWidth="1.5" strokeDasharray="3 8" />
          <circle cx="350" cy="250" r="4" fill="#42d1df" />
        </svg>
        <div className="pdi-motion-platform"><i /></div>
        <div className="pdi-motion-scan" />
        <img
          className="pdi-motion-car"
          src="/car-assets/01_dark_blue_SUV.png"
          alt=""
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
        <span className="pdi-motion-hotspot pdi-motion-hotspot--body"><i /> BODY / PAINT</span>
        <span className="pdi-motion-hotspot pdi-motion-hotspot--engine"><i /> ENGINE BAY</span>
        <span className="pdi-motion-hotspot pdi-motion-hotspot--cabin"><i /> CABIN / OBD</span>
        <span className="pdi-motion-hotspot pdi-motion-hotspot--tyres"><i /> TYRES / WHEELS</span>
        <span className="pdi-motion-visual-index">OM / PDI 006 <b>LIVE SCAN</b></span>
      </div>

      <div className="pdi-motion-course-rail" aria-label="Six-day practical learning sequence">
        {courseSteps.map(([number, title, detail]) => (
          <div className="pdi-motion-course-step" key={number}>
            <i className="pdi-motion-course-signal" aria-hidden="true" />
            <span>{number}</span>
            <div><b>{title}</b><small>{detail}</small></div>
          </div>
        ))}
      </div>
      <div className="pdi-motion-edge-label">OBSERVE <i /> DOCUMENT <i /> REPORT</div>
    </section>
  );
}

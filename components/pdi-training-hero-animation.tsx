"use client";

const inspectionChecks = [
  { number: "01", title: "Vehicle identity", detail: "VIN · records · scope", status: "START HERE" },
  { number: "02", title: "Body & paint", detail: "Panels · finish · glass", status: "EXTERIOR" },
  { number: "03", title: "Engine bay", detail: "Visible checks · fluid clues", status: "MECHANICAL" },
  { number: "04", title: "Cabin & systems", detail: "Controls · warning lamps · OBD", status: "INTERIOR" },
  { number: "05", title: "Road-test planning", detail: "Permission · safe observations", status: "ASSESSMENT" },
  { number: "06", title: "Evidence & report", detail: "Photos · priorities · next steps", status: "OUTPUT" },
];

const learningDays = [
  ["01", "SAFETY", "Scope & identity"],
  ["02", "EXTERIOR", "Body & finish"],
  ["03", "ENGINE", "Visual checks"],
  ["04", "CABIN", "Controls & OBD"],
  ["05", "ROAD TEST", "Observe & record"],
  ["06", "REPORT", "Guided practice"],
];

export function PdiTrainingHeroAnimation() {
  return (
    <section className="pdi-motion-hero" aria-labelledby="pdi-motion-heading">
      <div className="pdi-motion-shell">
        <div className="pdi-motion-topline">
          <span className="pdi-motion-kicker"><i /> OMCAR / PRACTICAL PDI TRAINING</span>
          <span className="pdi-motion-edition">THE SIX-DAY METHOD <b>•</b> 01—06</span>
        </div>

        <div className="pdi-motion-layout">
          <div className="pdi-motion-vehicle-stage" aria-label="Animated vehicle inspection illustration">
            <div className="pdi-motion-stage-grid" aria-hidden="true" />
            <div className="pdi-motion-stage-glow" aria-hidden="true" />
            <div className="pdi-motion-stage-heading">
              <span>INSPECTION SEQUENCE / 001</span>
              <strong id="pdi-motion-heading">SEE THE DETAILS.<br /><em>UNDERSTAND THE CAR.</em></strong>
            </div>
            <div className="pdi-motion-orbit pdi-motion-orbit--outer" aria-hidden="true" />
            <div className="pdi-motion-orbit pdi-motion-orbit--inner" aria-hidden="true" />
            <div className="pdi-motion-scan-plane" aria-hidden="true" />
            <div className="pdi-motion-platform" aria-hidden="true"><span /><i /></div>
            <img className="pdi-motion-car" src="/car-assets/01_dark_blue_SUV.png" alt="" aria-hidden="true" fetchPriority="high" />
            <svg className="pdi-motion-radar" viewBox="0 0 700 420" fill="none" aria-hidden="true">
              <path d="M94 253H606M350 62V354" stroke="rgba(178,215,230,.12)" strokeDasharray="3 9" />
              <ellipse cx="350" cy="250" rx="260" ry="104" stroke="rgba(143,201,224,.25)" strokeDasharray="4 8" />
              <ellipse cx="350" cy="250" rx="205" ry="77" stroke="rgba(34,191,208,.38)" />
              <path d="M120 250a230 230 0 0 1 460 0" stroke="#35c5d5" strokeWidth="2" strokeDasharray="70 24 16 28" className="pdi-motion-radar-arc" />
              <path d="M155 250a195 195 0 0 0 390 0" stroke="rgba(158,203,255,.48)" strokeWidth="1.5" strokeDasharray="3 8" />
              <circle cx="350" cy="250" r="4" fill="#42d1df" />
            </svg>
            <div className="pdi-motion-hotspot pdi-motion-hotspot--body"><span /><b>BODY / PAINT</b></div>
            <div className="pdi-motion-hotspot pdi-motion-hotspot--engine"><span /><b>ENGINE BAY</b></div>
            <div className="pdi-motion-hotspot pdi-motion-hotspot--cabin"><span /><b>CABIN / OBD</b></div>
            <div className="pdi-motion-hotspot pdi-motion-hotspot--tyres"><span /><b>TYRES / WHEELS</b></div>
            <div className="pdi-motion-stage-foot">
              <span>OBSERVE <i /> DOCUMENT <i /> REPORT</span>
              <b>SAFE. STRUCTURED. EVIDENCE-LED.</b>
            </div>
            <span className="pdi-motion-coord pdi-motion-coord--left">12° / PDI</span>
            <span className="pdi-motion-coord pdi-motion-coord--right">OM—06 / FIELD</span>
          </div>

          <aside className="pdi-motion-console" aria-label="Six practical inspection learning modules">
            <div className="pdi-motion-console-head">
              <div><span>THE FIELD CHECKLIST</span><strong>Learn the sequence.</strong></div>
              <b className="pdi-motion-live"><i /> 6 MODULES</b>
            </div>
            <div className="pdi-motion-checks">
              {inspectionChecks.map((check, index) => (
                <div className="pdi-motion-check" key={check.number}>
                  <span className="pdi-motion-check-number">{check.number}</span>
                  <div className="pdi-motion-check-copy"><b>{check.title}</b><small>{check.detail}</small></div>
                  <span className="pdi-motion-check-state">{check.status}</span>
                  <span className="pdi-motion-check-mark" aria-hidden="true">✓</span>
                </div>
              ))}
            </div>
            <div className="pdi-motion-report">
              <div className="pdi-motion-report-head">
                <span className="pdi-motion-report-icon" aria-hidden="true">✓</span>
                <div><small>THE FINAL OUTPUT</small><b>Clear inspection report</b></div>
                <span className="pdi-motion-report-pdf">REPORT</span>
              </div>
              <div className="pdi-motion-report-lines" aria-hidden="true"><i /><i /><i /></div>
              <div className="pdi-motion-report-foot"><span>Photo evidence</span><span>Prioritised findings</span><span>Next steps</span></div>
            </div>
          </aside>
        </div>

        <div className="pdi-motion-timeline" aria-label="Six-day learning path">
          <div className="pdi-motion-timeline-label"><span>THE LEARNING PATH</span><b>ONE METHOD. SIX DAYS.</b></div>
          <div className="pdi-motion-days">
            {learningDays.map(([day, title, detail]) => (
              <div className="pdi-motion-day" key={day}>
                <span className="pdi-motion-day-number">{day}</span>
                <div><b>{title}</b><small>{detail}</small></div>
              </div>
            ))}
          </div>
        </div>
        <div className="pdi-motion-bottomline">
          <span>FOUNDATION SKILLS / SUPERVISED PRACTICE / HONEST REPORTING</span>
          <b>LEARN THE METHOD <i>↗</i></b>
        </div>
      </div>
    </section>
  );
}

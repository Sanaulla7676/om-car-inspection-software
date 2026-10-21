"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowRight, BookOpenCheck, ChevronDown, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AnimatedContent from "@/components/AnimatedContent";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Module = { id: number; day: number; title: string; summary: string; practice: string; marker: string };

const modules: Module[] = [
  { id: 1, day: 1, title: "Workplace safety and inspection boundaries", summary: "Set safe work habits, identify hazards and know when to stop or refer a job to a qualified technician.", practice: "Build a pre-check safety and access routine. No unsupported underbody work or high-voltage intervention.", marker: "FOUNDATION" },
  { id: 2, day: 1, title: "Vehicle identity and handover records", summary: "Locate and cross-check available identifiers and compare the vehicle presented with the booking and paperwork.", practice: "Record identifiers and document discrepancies without making legal conclusions.", marker: "IDENTITY" },
  { id: 3, day: 1, title: "Inspection scope, sequence and checklist discipline", summary: "Create a repeatable walk-around, distinguish in-scope from out-of-scope tasks and avoid skipped areas.", practice: "Follow a fixed sequence and mark items as observed, not checked, inaccessible or requiring follow-up.", marker: "WORKFLOW" },
  { id: 4, day: 2, title: "Paint, panels and surface condition", summary: "Observe visible scratches, dents, finish variation, panel gaps and signs that may warrant a specialist body assessment.", practice: "Use consistent light, viewing angles and neutral language; avoid claiming a definitive repair history from one clue.", marker: "EXTERIOR" },
  { id: 5, day: 2, title: "Glass, lamps and exterior fittings", summary: "Review visible glass condition, lamps, mirrors, wipers, seals, closures and external fittings within safe access.", practice: "Check function only where safe and accessible, then capture clear close-up and context photos.", marker: "EXTERIOR" },
  { id: 6, day: 2, title: "Tyres, wheels and visible running-gear clues", summary: "Record tyre condition, visible wear patterns, wheel damage and accessible warning signs that may require a technician.", practice: "Separate an observed wear pattern from a diagnosis; escalate safety-critical concerns.", marker: "RUNNING GEAR" },
  { id: 7, day: 3, title: "Engine-bay visual overview", summary: "Learn a non-invasive visual sequence for accessible components, obvious damage, missing covers and irregular conditions.", practice: "Observe with the vehicle safely parked and follow manufacturer/OEM restrictions; do not touch moving or hot components.", marker: "MECHANICAL" },
  { id: 8, day: 3, title: "Accessible fluids, leaks, hoses and belts", summary: "Recognize visible signs of leakage, deterioration or missing components while respecting heat, pressure and access limits.", practice: "Photograph the location, describe the appearance and recommend expert confirmation instead of diagnosing beyond scope.", marker: "MECHANICAL" },
  { id: 9, day: 3, title: "Underbody and structural observation limits", summary: "Understand the kinds of damage or corrosion that may warrant a closer look and the equipment or authorization required.", practice: "Never work under an unsupported vehicle. Record inaccessible areas as limitations and request a qualified inspection when needed.", marker: "SAFETY" },
  { id: 10, day: 4, title: "Cabin, comfort features and controls", summary: "Use a repeatable cabin checklist for seats, restraints, trim, windows, locks, infotainment, climate controls and visible wear.", practice: "Distinguish fitted equipment, observed condition and items not tested; protect customer property during checks.", marker: "INTERIOR" },
  { id: 11, day: 4, title: "Electrical functions and warning lamps", summary: "Observe accessible lights, switches, displays and warning indicators, with care not to interpret a lamp as a complete diagnosis.", practice: "Record the condition and context, including vehicle state, and note any checks that require specialist equipment.", marker: "ELECTRICAL" },
  { id: 12, day: 4, title: "OBD and modern vehicle-system awareness", summary: "Understand what a diagnostic scan can and cannot tell you, including stored codes, status and context.", practice: "Use approved tools only when trained and authorized; never clear codes to hide evidence or treat a code as a verdict.", marker: "DIAGNOSTICS" },
  { id: 13, day: 5, title: "Road-test planning and observations", summary: "Understand permissions, route planning and conditions for a road test, plus observations such as unusual noise or vibration.", practice: "Only a suitably licensed, insured and authorized person may conduct a road test; escalate unsafe conditions and avoid risky manoeuvres.", marker: "ROAD TEST" },
  { id: 14, day: 5, title: "Photo evidence and repeatable angles", summary: "Capture identifying context and the detail needed to explain a finding, without misleading crops or dramatic filters.", practice: "Pair an overview with a close-up, label the related observation and preserve images securely.", marker: "EVIDENCE" },
  { id: 15, day: 5, title: "Severity, uncertainty and report writing", summary: "Turn observations into a readable report with clear priorities, evidence links, limitations and recommended next steps.", practice: "Write what is seen, what is not confirmed and who should examine the item next.", marker: "REPORTING" },
  { id: 16, day: 6, title: "Guided inspection and quality review", summary: "Apply the sequence to a guided vehicle exercise, review omissions and improve the clarity of the report.", practice: "Compare a checklist with photos and written observations, then correct gaps with trainer feedback.", marker: "PRACTICE" },
  { id: 17, day: 6, title: "Customer communication and service-business basics", summary: "Explore enquiry intake, scope confirmation, transparent quotations, consent, record handling, referrals and follow-up.", practice: "Draft a clear service scope and customer explanation. Business setup, legal, insurance and tax requirements must be checked locally.", marker: "PRACTICE" },
];

const dayLabels = [
  { day: 0, label: "All 17 modules" },
  { day: 1, label: "Day 01" },
  { day: 2, label: "Day 02" },
  { day: 3, label: "Day 03" },
  { day: 4, label: "Day 04" },
  { day: 5, label: "Day 05" },
  { day: 6, label: "Day 06" },
];

export function TrainingCurriculum() {
  const root = useRef<HTMLElement>(null);
  const [activeDay, setActiveDay] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(1);
  const visibleModules = useMemo(
    () => activeDay === 0 ? modules : modules.filter((item) => item.day === activeDay),
    [activeDay],
  );

  useGSAP(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = gsap.utils.toArray<HTMLElement>(".training-module-card", el);
    if (reduced) {
      gsap.set(cards, { clearProps: "all", autoAlpha: 1 });
      return;
    }
    gsap.fromTo(cards,
      { autoAlpha: 0, y: 22, rotateX: 2, transformPerspective: 900 },
      { autoAlpha: 1, y: 0, rotateX: 0, duration: 0.65, stagger: 0.055, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true } },
    );
  }, { scope: root, dependencies: [activeDay] });

  return (
    <section ref={root} className="training-curriculum" aria-labelledby="training-curriculum-heading">
      <div className="training-curriculum-inner">
        <AnimatedContent className="training-curriculum-intro" distance={38} duration={0.9} blur={3} wipe="left" threshold={0.18}>
          <div>
            <p className="training-curriculum-kicker"><BookOpenCheck size={15} /> THE LEARNING ROADMAP</p>
            <h2 id="training-curriculum-heading">17 practical modules. One repeatable inspection method.</h2>
          </div>
          <div className="training-curriculum-explainer">
            <p>Start with safety and scope, learn the visible checks, practise evidence and reporting, then look at how to explain and organise an inspection service.</p>
            <small>This is a proposed learning outline. Confirm the delivered syllabus, access to vehicles, trainer supervision, assessment, equipment and batch details before enrolment.</small>
          </div>
        </AnimatedContent>

        <div className="training-day-filters" role="group" aria-label="Filter training modules by day">
          {dayLabels.map(({ day, label }) => (
            <button type="button" key={day} className={activeDay === day ? "is-active" : ""} aria-pressed={activeDay === day} onClick={() => { setActiveDay(day); setExpanded(null); }}>
              {label}
            </button>
          ))}
        </div>

        <div className="training-module-grid" aria-live="polite">
          {visibleModules.map((item) => {
            const isOpen = expanded === item.id;
            return (
              <article key={item.id} className={"training-module-card" + (isOpen ? " is-expanded" : "")}>
                <button type="button" className="training-module-toggle" aria-expanded={isOpen} aria-controls={"training-module-detail-" + item.id} onClick={() => setExpanded(isOpen ? null : item.id)}>
                  <span className="training-module-number">{String(item.id).padStart(2, "0")}</span>
                  <span className="training-module-title-group"><small>{ "DAY " + String(item.day).padStart(2, "0") + " / " + item.marker }</small><b>{item.title}</b></span>
                  <ChevronDown size={17} className="training-module-chevron" />
                </button>
                <div id={"training-module-detail-" + item.id} className="training-module-details" hidden={!isOpen}>
                  <p>{item.summary}</p>
                  <div><CheckCircle2 size={15} /><span>{item.practice}</span></div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="training-roadmap-note">
          <span>REALISTIC EXPECTATIONS</span>
          <p>Training can build a foundation for more confident practice; it cannot guarantee employment, customers, certification or earnings. Independent work also requires suitable competence, permissions, equipment, insurance and compliance with local requirements.</p>
          <Link href="/book-masterclass">Ask about the current training batch <ArrowRight size={15} /></Link>
        </div>
      </div>
    </section>
  );
}

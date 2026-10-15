"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";

const heroSlides = [
  {
    id: "new-pdi",
    number: "01",
    label: "NEW VEHICLE PDI",
    eyebrow: "BEFORE YOU ACCEPT DELIVERY",
    title: "INSPECT BEFORE",
    accent: "HANDOVER.",
    description: "A structured new-car handover check for visible paint and panel condition, cabin finish, accessible functions and delivery documents.",
    image: "https://htcms-prod-images.s3.ap-south-1.amazonaws.com/htmobile1/hyundai_new-verna/images/colours_hyundai-verna_titan-grey_1920x1033.jpg",
    alt: "Hyundai Verna in Titan Grey for new vehicle pre-delivery inspection",
    cta: "Explore New Vehicle PDI",
    href: "/services/new-car-pdi"
  },
  {
    id: "preowned-pdi",
    number: "02",
    label: "PRE-OWNED VEHICLE PDI",
    eyebrow: "CHECK THE CONDITION BEFORE YOU COMMIT",
    title: "KNOW BEFORE",
    accent: "YOU BUY.",
    description: "Record visible wear, bodywork, tyres, cabin condition and items that need closer assessment before purchasing a pre-owned vehicle.",
    image: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/40087/thar-exterior-right-front-three-quarter-37.jpeg?isig=0&q=80",
    alt: "Mahindra Thar used as a pre-owned vehicle inspection example",
    cta: "Explore Pre-Owned PDI",
    href: "/services/used-car-inspection"
  },
  {
    id: "pdi-coaching",
    number: "03",
    label: "PDI COACHING & TRAINING",
    eyebrow: "SIX DAYS OF PRACTICAL LEARNING",
    title: "LEARN THE",
    accent: "INSPECTION METHOD.",
    description: "Build practical skills in inspection order, condition marking, evidence capture and clear report writing with guided vehicle checks.",
    image: "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/18971d42-3c84-4532-b232-c7a29e9ac3dd.png",
    alt: "Automotive inspector demonstrating hands-on vehicle inspection skills",
    cta: "Explore 6-Day Masterclass",
    href: "/masterclass"
  }
];

export function HomeHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = heroSlides[activeIndex];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (paused || media.matches) return;
    // A single active index controls photo, label, heading, copy and CTA together.
    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [activeIndex, paused]);

  useEffect(() => {
    // Preload the two next photographs so transitions never blend unrelated frames.
    heroSlides.forEach((item) => {
      const image = new Image();
      image.src = item.image;
    });
  }, []);

  return (
    <section className="lux-car-image-hero lux-synchronized-hero" aria-label="OMKAR vehicle inspection services">
      <div className="lux-reference-opening-banner lux-car-hero-frame lux-sync-frame">
        <img key={slide.id} className="lux-sync-image" src={slide.image} alt={slide.alt} fetchPriority="high" />
        <div className="lux-car-hero-copy lux-sync-copy" key={slide.id + "-copy"}>
          <p className="lux-car-hero-eyebrow"><span /> {slide.label}</p>
          <p className="lux-sync-kicker">{slide.eyebrow}</p>
          <h1 className="lux-car-hero-title lux-sync-title" aria-live="polite">
            <span className="lux-car-hero-title-line lux-car-title-line-one">{slide.title}</span>
            <span className="lux-car-hero-title-line lux-car-title-line-two"><em>{slide.accent}</em></span>
          </h1>
          <p className="lux-car-hero-description">{slide.description}</p>
          <div className="lux-car-hero-actions">
            <Link href={slide.href as any} className="lux-car-hero-primary">{slide.cta} <ArrowRight size={15} /></Link>
            <a href="#vehicle-inquiry" className="lux-car-hero-secondary">Book an Inspection</a>
          </div>
          <p className="lux-car-hero-proof"><CheckCircle2 size={12} /> EVIDENCE-LED CHECKS <span /> CLEAR REPORTING <span /> PRACTICAL COACHING</p>
        </div>
        <div className="lux-sync-counter" aria-hidden="true">OM / {slide.number} — 03</div>
        <div className="lux-sync-progress" aria-hidden="true"><span key={slide.id} /></div>
      </div>
      <div className="lux-sync-slide-nav" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-label="Choose a featured service">
        {heroSlides.map((item, index) => (
          <button key={item.id} type="button" className={activeIndex === index ? "is-active" : ""} aria-pressed={activeIndex === index} onClick={() => setActiveIndex(index)}>
            <span>{item.number}</span>
            <b>{item.label}</b>
            <ChevronRight size={14} />
          </button>
        ))}
      </div>
    </section>
  );
}

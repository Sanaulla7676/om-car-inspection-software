"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, CarFront, Footprints, Gauge, ShieldCheck, TriangleAlert } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function RoadJourney() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const element = root.current;
    if (!element) return;

    const animatedElements = element.querySelectorAll(".road-sign, .road-crossing, .road-hero-car, .road-story-copy");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      gsap.set(animatedElements, { clearProps: "all", autoAlpha: 1 });
      return;
    }

    const signs = gsap.utils.toArray<HTMLElement>(".road-sign", element);
    const crossing = element.querySelector<HTMLElement>(".road-crossing");
    const car = element.querySelector<HTMLElement>(".road-hero-car");
    const copy = element.querySelector<HTMLElement>(".road-story-copy");

    gsap.set(signs, { y: 28, scale: .96, rotateY: 0, autoAlpha: .45 });
    if (crossing) gsap.set(crossing, { y: 24, scaleY: .94, autoAlpha: .55 });
    if (car) gsap.set(car, { xPercent: -7, y: 18, scale: .95, rotate: -.5 });
    if (copy) gsap.set(copy, { y: 22, autoAlpha: 0 });

    const entrance = gsap.timeline({ paused: true });
    entrance.to(signs, {
      y: 0, scale: 1, autoAlpha: 1, duration: .68, stagger: .08, ease: "power3.out"
    }, 0);
    if (crossing) entrance.to(crossing, {
      y: 0, scaleY: 1, autoAlpha: 1, duration: .8, ease: "power3.out"
    }, .05);
    if (car) entrance.to(car, {
      xPercent: 0, y: 0, scale: 1, rotate: 0, duration: .9, ease: "power3.out"
    }, .08);
    if (copy) entrance.to(copy, {
      y: 0, autoAlpha: 1, duration: .7, ease: "power3.out"
    }, .14);

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        entrance.play(0);
        observer.disconnect();
      }
    }, { threshold: .16, rootMargin: "0px 0px -8% 0px" });
    observer.observe(element);

    return () => {
      observer.disconnect();
      entrance.kill();
    };
  }, { scope: root });

  return (
    <section ref={root} className="road-journey" aria-labelledby="road-journey-heading">
      <div className="road-journey-scene" aria-hidden="true">
        <div className="road-sky-glow" />
        <div className="road-hill road-hill--far" />
        <div className="road-hill road-hill--near" />
        <div className="road-roadbed">
          <div className="road-lane-marker road-lane-marker--left" />
          <div className="road-lane-marker road-lane-marker--center" />
          <div className="road-lane-marker road-lane-marker--right" />
          <div className="road-crossing" />
          <div className="road-road-edge road-road-edge--left" />
          <div className="road-road-edge road-road-edge--right" />
        </div>

        <div className="road-sign road-sign--speed">
          <div className="road-sign-pole" />
          <div className="road-speed-limit"><b>40</b><small>km/h</small></div>
        </div>
        <div className="road-sign road-sign--pdi">
          <div className="road-sign-pole" />
          <div className="road-sign-board"><CarFront size={21} /><b>PDI CHECK</b><small>BEFORE HANDOVER</small></div>
        </div>
        <div className="road-sign road-sign--crossing">
          <div className="road-sign-pole" />
          <div className="road-crossing-board"><Footprints size={24} /><b>ZEBRA</b><small>CROSSING AHEAD</small></div>
        </div>
        <div className="road-sign road-sign--warning">
          <div className="road-sign-pole" />
          <div className="road-warning-board"><TriangleAlert size={21} /><b>CHECK AHEAD</b><small>NOT GUESSWORK</small></div>
        </div>
        <img className="road-hero-car" src="/car-assets/10_black_Toyota_Prado.png" alt="" />
        <span className="road-road-caption">SAFE ROUTE <i /> CLEAR EVIDENCE <i /> BETTER DECISIONS</span>
      </div>

      <div className="road-story-copy">
        <div className="road-copy-inner">
          <p className="road-copy-eyebrow"><span /> THE INSPECTION JOURNEY</p>
          <h2 id="road-journey-heading">Slow down at the signs. Look closer before the turn.</h2>
          <p>From a new-car handover to a used-car purchase, every stop is a chance to record what you can see, ask what still needs checking and avoid treating a guess as a fact.</p>
          <div className="road-copy-points">
            <span><Gauge size={16} /> A repeatable check sequence</span>
            <span><ShieldCheck size={16} /> Safety and clear limitations</span>
            <span><CarFront size={16} /> Evidence you can revisit</span>
          </div>
          <Link href="/guides/what-to-check-before-buying-used-car" className="road-copy-cta">Read the buyer checklist <ArrowRight size={16} /></Link>
        </div>
      </div>
      <div className="road-journey-tail"><ArrowDownRight size={17} /><span>KEEP SCROLLING · THERE IS MORE TO CHECK</span></div>
    </section>
  );
}

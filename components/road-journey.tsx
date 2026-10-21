"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, CarFront, Footprints, Gauge, ShieldCheck, TriangleAlert } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AnimatedContent from "@/components/AnimatedContent";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function RoadJourney() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const element = root.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(element.querySelectorAll(".road-sign, .road-crossing, .road-hero-car, .road-story-copy"), {
        clearProps: "all",
        autoAlpha: 1,
      });
      return;
    }

    const signs = gsap.utils.toArray<HTMLElement>(".road-sign", element);
    signs.forEach((sign, index) => {
      gsap.fromTo(sign,
        { y: 84 + index * 25, scale: .74, rotateY: index % 2 ? -8 : 8, autoAlpha: .15 },
        {
          y: -34 - index * 10,
          scale: index % 2 ? 1.05 : 1,
          rotateY: 0,
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: .55,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    gsap.fromTo(".road-crossing",
      { y: 110, scaleY: .64, autoAlpha: .25 },
      {
        y: -82,
        scaleY: 1.06,
        autoAlpha: 1,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: .5,
          invalidateOnRefresh: true,
        },
      },
    );

    gsap.fromTo(".road-hero-car",
      { xPercent: -13, y: 42, scale: .78, rotate: -1.5 },
      {
        xPercent: 0,
        y: -4,
        scale: 1,
        rotate: 0,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "center 40%",
          scrub: .6,
          invalidateOnRefresh: true,
        },
      },
    );

    gsap.fromTo(".road-story-copy",
      { autoAlpha: 0, y: 34, filter: "blur(8px)" },
      {
        autoAlpha: 1, y: 0, filter: "blur(0px)", duration: .95, ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 72%", once: true },
      },
    );
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
        <img className="road-hero-car" src="/car-assets/08_blue_Tata_Nexon.png" alt="" />
        <span className="road-road-caption">SAFE ROUTE <i /> CLEAR EVIDENCE <i /> BETTER DECISIONS</span>
      </div>

      <div className="road-story-copy">
        <AnimatedContent className="road-copy-inner" distance={28} duration={.9} blur={4} wipe="up" threshold={.12}>
          <p className="road-copy-eyebrow"><span /> THE INSPECTION JOURNEY</p>
          <h2 id="road-journey-heading">Slow down at the signs. Look closer before the turn.</h2>
          <p>From a new-car handover to a used-car purchase, every stop is a chance to record what you can see, ask what still needs checking and avoid treating a guess as a fact.</p>
          <div className="road-copy-points">
            <span><Gauge size={16} /> A repeatable check sequence</span>
            <span><ShieldCheck size={16} /> Safety and clear limitations</span>
            <span><CarFront size={16} /> Evidence you can revisit</span>
          </div>
          <Link href="/guides/what-to-check-before-buying-used-car" className="road-copy-cta">Read the buyer checklist <ArrowRight size={16} /></Link>
        </AnimatedContent>
      </div>
      <div className="road-journey-tail"><ArrowDownRight size={17} /><span>KEEP SCROLLING · THERE IS MORE TO CHECK</span></div>
    </section>
  );
}

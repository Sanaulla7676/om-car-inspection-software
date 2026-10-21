"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, CarFront, GraduationCap, ShieldCheck } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AnimatedContent from "@/components/AnimatedContent";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const pathways = [
  {
    number: "01",
    title: "New Car PDI",
    detail: "Review delivery condition, equipment, visible finish and handover records before accepting the vehicle.",
    href: "/services/new-car-pdi",
    tag: "BEFORE HANDOVER",
    Icon: CarFront,
    signalLabel: "Delivery signal",
  },
  {
    number: "02",
    title: "Used Car PDI",
    detail: "Document visible wear, body condition, cabin functions and questions that may need specialist follow-up.",
    href: "/services/used-car-pdi",
    tag: "BEFORE YOU BUY",
    Icon: ShieldCheck,
    signalLabel: "Condition signal",
  },
  {
    number: "03",
    title: "Enquire About Training",
    detail: "Explore the six-day learning path, ask about current batches and confirm what practical sessions include.",
    href: "/book-masterclass",
    tag: "LEARN THE METHOD",
    Icon: GraduationCap,
    signalLabel: "Training signal",
  },
];

export function PdiPathwayHub() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const root = sectionRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = gsap.utils.toArray<HTMLElement>(".pdi-pathway-card", root);
    const cars = gsap.utils.toArray<HTMLElement>(".pdi-speed-car", root);

    if (reduced) {
      gsap.set([...cards, ...cars], { clearProps: "all", autoAlpha: 1 });
      root.querySelectorAll<HTMLElement>(".pdi-signal-light").forEach((lamp) => {
        if (lamp.dataset.signalLight === "green") gsap.set(lamp, { autoAlpha: 1, scale: 1.06 });
      });
      return;
    }

    gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 38, rotateX: 4, transformPerspective: 850 },
      {
        autoAlpha: 1,
        y: 0,
        rotateX: 0,
        duration: 0.85,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 88%", once: true },
      },
    );

    root.querySelectorAll<HTMLElement>(".pdi-traffic-signal").forEach((signal, signalIndex) => {
      const lamps = gsap.utils.toArray<HTMLElement>(".pdi-signal-light", signal);
      const activate = (index: number) => {
        lamps.forEach((lamp) => gsap.set(lamp, { autoAlpha: 0.28, scale: 0.88, boxShadow: "none" }));
        const lamp = lamps[index];
        if (!lamp) return;
        const colors = ["#ff4c57", "#ffb43d", "#4ee5a3"];
        gsap.to(lamp, {
          autoAlpha: 1,
          scale: 1.12,
          duration: 0.2,
          ease: "back.out(2)",
          boxShadow: "0 0 16px " + colors[index] + "85, 0 0 3px " + colors[index],
          overwrite: true,
        });
      };

      activate((signalIndex + Math.floor(Math.random() * 3)) % 3);
      gsap.to(signal, {
        duration: 0.95 + Math.random() * 0.45,
        repeat: -1,
        repeatDelay: 0.15 + Math.random() * 0.55,
        onRepeat: () => activate(Math.floor(Math.random() * 3)),
      });
    });

    cars.forEach((car, index) => {
      gsap.fromTo(
        car,
        { x: -270, autoAlpha: 0, scaleX: -0.86, scaleY: 0.86 },
        {
          x: () => (root.clientWidth || window.innerWidth) + 300,
          autoAlpha: 1,
          scaleX: -1,
          scaleY: 1,
          duration: index === 0 ? 3.7 : 4.35,
          delay: index === 0 ? 0.6 : 3.2,
          repeat: -1,
          repeatDelay: index === 0 ? 2.7 : 3.3,
          ease: "none",
          repeatRefresh: true,
        },
      );
    });

    gsap.to(".pdi-speed-streak", {
      xPercent: 145,
      duration: 1.05,
      ease: "none",
      stagger: { each: 0.2, repeat: -1 },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="pdi-pathway-hub" aria-labelledby="pdi-pathways-heading">
      <div className="pdi-pathway-inner">
        <AnimatedContent className="pdi-pathway-heading" distance={34} duration={0.85} blur={3} wipe="up" threshold={0.18}>
          <div>
            <p className="pdi-hub-eyebrow"><span /> YOUR NEXT MOVE</p>
            <h2 id="pdi-pathways-heading">Pick your inspection lane.</h2>
          </div>
          <p>Three clear paths. Start with the vehicle or start learning the method.</p>
        </AnimatedContent>

        <div className="pdi-speedway" aria-hidden="true">
          <div className="pdi-speedway-track" />
          <span className="pdi-speed-streak pdi-speed-streak--one" />
          <span className="pdi-speed-streak pdi-speed-streak--two" />
          <span className="pdi-speed-streak pdi-speed-streak--three" />
          <img className="pdi-speed-car pdi-speed-car--one" src="/car-assets/08_blue_Tata_Nexon.png" alt="" />
          <img className="pdi-speed-car pdi-speed-car--two" src="/car-assets/03_red_WagonR.png" alt="" />
          <span className="pdi-speedway-label">CHECK BEFORE YOU COMMIT <i /> CLEAR REPORTS, BETTER QUESTIONS</span>
        </div>

        <div className="pdi-pathway-grid">
          {pathways.map(({ number, title, detail, href, tag, Icon, signalLabel }) => (
            <Link key={number} href={href as any} className="pdi-pathway-card">
              <div className="pdi-pathway-card-top">
                <span className="pdi-pathway-number">{number}</span>
                <span className="pdi-pathway-tag">{tag}</span>
              </div>
              <div className="pdi-pathway-title-row">
                <span className="pdi-pathway-icon"><Icon size={21} strokeWidth={1.65} /></span>
                <h3>{title}</h3>
                <span className="pdi-traffic-wrap">
                  <span className="pdi-traffic-signal" role="img" aria-label={signalLabel}>
                    <span className="pdi-signal-light" data-signal-light="red" />
                    <span className="pdi-signal-light" data-signal-light="amber" />
                    <span className="pdi-signal-light" data-signal-light="green" />
                  </span>
                </span>
              </div>
              <p className="pdi-pathway-detail">{detail}</p>
              <span className="pdi-pathway-action">Explore this path <ArrowUpRight size={17} /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

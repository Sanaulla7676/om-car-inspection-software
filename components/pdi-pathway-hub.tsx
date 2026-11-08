"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, CarFront, GraduationCap, ShieldCheck } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const pathways = [
  {
    number: "01",
    title: "New Car PDI",
    detail: "Review delivery condition, equipment, visible finish and handover records before accepting the car.",
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
    const cards = gsap.utils.toArray<HTMLElement>(".pdi-pathway-card", root);
    const cars = gsap.utils.toArray<HTMLElement>(".pdi-speed-car", root);
    const signals = gsap.utils.toArray<HTMLElement>(".pdi-traffic-signal", root);
    const streaks = gsap.utils.toArray<HTMLElement>(".pdi-speed-streak", root);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      gsap.set([...cards, ...cars], { clearProps: "all", autoAlpha: 1 });
      root.querySelectorAll<HTMLElement>(".pdi-signal-light").forEach((lamp) => {
        if (lamp.dataset.signalLight === "green") gsap.set(lamp, { autoAlpha: 1, scale: 1.06 });
      });
      return;
    }

    const cardReveal = gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 24, rotateX: 0 },
      {
        autoAlpha: 1,
        y: 0,
        rotateX: 0,
        duration: 0.68,
        stagger: 0.11,
        ease: "power3.out",
        paused: true,
      },
    );

    const loops: gsap.core.Animation[] = [];

    signals.forEach((signal, signalIndex) => {
      const lamps = gsap.utils.toArray<HTMLElement>(".pdi-signal-light", signal);
      const colors = ["#ff4c57", "#ffb43d", "#4ee5a3"];
      const activate = (index: number, animate = true) => {
        lamps.forEach((lamp) => gsap.set(lamp, { autoAlpha: 0.28, scale: 0.88, boxShadow: "none" }));
        const lamp = lamps[index];
        if (!lamp) return;
        const glow = {
          autoAlpha: 1,
          scale: 1.1,
          duration: 0.18,
          ease: "back.out(2)",
          boxShadow: "0 0 12px " + colors[index] + "75, 0 0 3px " + colors[index],
          overwrite: true as const,
        };
        if (animate) gsap.to(lamp, glow);
        else gsap.set(lamp, { autoAlpha: 1, scale: 1.06 });
      };

      activate((signalIndex + Math.floor(Math.random() * 3)) % 3, false);
      loops.push(gsap.to(signal, {
        duration: 1.05,
        repeat: -1,
        repeatDelay: 0.3,
        paused: true,
        onRepeat: () => activate(Math.floor(Math.random() * 3)),
      }));
    });

    cars.forEach((car, index) => {
      loops.push(gsap.fromTo(
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
          paused: true,
        },
      ));
    });

    if (streaks.length) {
      loops.push(gsap.to(streaks, {
        xPercent: 145,
        duration: 1.05,
        ease: "none",
        stagger: { each: 0.2, repeat: -1 },
        paused: true,
      }));
    }

    let sectionVisible = false;
    let cardsRevealed = false;
    const syncPlayback = () => {
      const shouldRun = sectionVisible && !document.hidden;
      if (shouldRun && !cardsRevealed) {
        cardsRevealed = true;
        cardReveal.play(0);
      }
      loops.forEach((animation) => {
        if (shouldRun) animation.play();
        else animation.pause();
      });
    };

    const observer = new IntersectionObserver((entries) => {
      sectionVisible = Boolean(entries[0]?.isIntersecting);
      syncPlayback();
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    observer.observe(root);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      cardReveal.kill();
      loops.forEach((animation) => animation.kill());
    };
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="pdi-pathway-hub" aria-labelledby="pdi-pathways-heading">
      <div className="pdi-pathway-inner">
        <div className="pdi-pathway-heading">
          <div>
            <p className="pdi-hub-eyebrow"><span /> YOUR NEXT MOVE</p>
            <h2 id="pdi-pathways-heading">Pick your inspection lane.</h2>
          </div>
          <p>Three clear paths. Start with the car or start learning the method.</p>
        </div>

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

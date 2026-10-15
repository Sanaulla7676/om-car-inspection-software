"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ScrollMotion() {
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("[data-gsap-reveal], [data-gsap-image]").forEach((element) => {
        (element as HTMLElement).style.opacity = "1";
        (element as HTMLElement).style.transform = "none";
        (element as HTMLElement).style.clipPath = "none";
        (element as HTMLElement).style.filter = "none";
      });
      return;
    }

    const copy = gsap.utils.toArray<HTMLElement>("[data-gsap-reveal]");
    copy.forEach((element) => {
      gsap.fromTo(element,
        { autoAlpha: 0, y: 26, filter: "blur(5px)" },
        {
          autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.82,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 86%", once: true }
        }
      );
    });

    const images = gsap.utils.toArray<HTMLElement>("[data-gsap-image]");
    images.forEach((element) => {
      gsap.fromTo(element,
        { clipPath: "inset(0 100% 0 0)", scale: 1.025 },
        {
          clipPath: "inset(0 0% 0 0)", scale: 1, duration: 1.12,
          ease: "power3.inOut",
          scrollTrigger: { trigger: element, start: "top 88%", once: true }
        }
      );
    });

    const headings = gsap.utils.toArray<HTMLElement>(".marketing-hero-title, .marketing-index-hero h1, .marketing-faq-shell h2");
    headings.forEach((element) => {
      gsap.fromTo(element,
        { autoAlpha: 0, y: 30, filter: "blur(8px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.95, ease: "power3.out", delay: 0.12,
          scrollTrigger: { trigger: element, start: "top 94%", once: true } }
      );
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());
  });

  return null;
}

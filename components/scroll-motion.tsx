"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ScrollMotion() {
  useGSAP(() => {
    // The controller is rendered alongside the page. Use document-level targets,
    // not a scope attached to an empty controller element.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      document.querySelectorAll<HTMLElement>("[data-gsap-reveal], [data-gsap-image], [data-gsap-scroll-expand], [data-gsap-page-expand]").forEach((element) => {
        element.style.opacity = "1";
        element.style.visibility = "visible";
        element.style.transform = "none";
        element.style.clipPath = "none";
        element.style.filter = "none";
      });
      return;
    }

    // Clean word/section entrances on scroll.
    gsap.utils.toArray<HTMLElement>("[data-gsap-reveal]").forEach((element) => {
      gsap.fromTo(element,
        { autoAlpha: 0, y: 28, filter: "blur(5px)" },
        {
          autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true }
        }
      );
    });

    // Supporting images reveal with a simple horizontal mask.
    gsap.utils.toArray<HTMLElement>("[data-gsap-image]:not([data-gsap-scroll-expand])").forEach((element) => {
      gsap.fromTo(element,
        { clipPath: "inset(0 100% 0 0)", scale: 1.018 },
        {
          clipPath: "inset(0 0% 0 0)", scale: 1, duration: 1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: element, start: "top 89%", once: true }
        }
      );
    });

    // Pinned hero image expands from a framed crop to full bleed as scroll advances.
    gsap.utils.toArray<HTMLElement>("[data-gsap-scroll-story]").forEach((story) => {
      const frame = story.querySelector<HTMLElement>("[data-gsap-scroll-expand]");
      if (!frame) return;
      const image = frame.querySelector<HTMLImageElement>("img");
      const overlay = frame.querySelector<HTMLElement>("[data-gsap-scroll-copy]");
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: story,
          start: "top top+=76",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true
        }
      });

      timeline.fromTo(frame,
        { clipPath: "inset(9% 8% 9% 8% round 18px)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", duration: 1 },
        0
      );

      if (image) timeline.fromTo(image,
        { scale: 1.105, transformOrigin: "center center" },
        { scale: 1, ease: "none", duration: 1 },
        0
      );

      if (overlay) timeline.fromTo(overlay,
        { autoAlpha: 0, y: 24, filter: "blur(6px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", ease: "none", duration: 0.48 },
        0.43
      );
    });

    // Detail pages get the same scroll-linked edge-to-edge photo reveal.
    gsap.utils.toArray<HTMLElement>("[data-gsap-page-expand]").forEach((element) => {
      gsap.fromTo(element,
        { clipPath: "inset(8% 7% 8% 7% round 15px)", scale: 1.015 },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)", scale: 1, ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            end: "top 22%",
            scrub: 0.55,
            invalidateOnRefresh: true
          }
        }
      );
    });

    // Extra hero headline fade/blur on service, guide and FAQ pages.
    gsap.utils.toArray<HTMLElement>(".marketing-hero-title, .marketing-index-hero h1, .marketing-faq-shell h2").forEach((element) => {
      gsap.fromTo(element,
        { autoAlpha: 0, y: 22, filter: "blur(6px)" },
        {
          autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.85, ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 94%", once: true }
        }
      );
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh, { once: true });
    const timeout = window.setTimeout(refresh, 500);
    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(timeout);
    };
  });

  return null;
}

"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ScrollMotion() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const refresh = () => ScrollTrigger.refresh();

    if (reduceMotion) {
      document.querySelectorAll<HTMLElement>("[data-gsap-reveal], [data-gsap-image], [data-gsap-scroll-expand], [data-gsap-page-expand]").forEach((element) => {
        element.style.opacity = "1";
        element.style.visibility = "visible";
        element.style.transform = "none";
        element.style.clipPath = "none";
        element.style.filter = "none";
      });
      return;
    }

    // Crisp word-and-section entrances, similar to React Bits Animated Content / Blur Text.
    gsap.utils.toArray<HTMLElement>("[data-gsap-reveal]").forEach((element) => {
      gsap.fromTo(element,
        { autoAlpha: 0, y: 30, filter: "blur(6px)" },
        {
          autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 87%", once: true }
        }
      );
    });

    // One-time, clean image mask reveal for cards and supporting imagery.
    gsap.utils.toArray<HTMLElement>("[data-gsap-image]:not([data-gsap-scroll-expand])").forEach((element) => {
      gsap.fromTo(element,
        { clipPath: "inset(0 100% 0 0)", scale: 1.025 },
        {
          clipPath: "inset(0 0% 0 0)", scale: 1, duration: 1.05,
          ease: "power3.inOut",
          scrollTrigger: { trigger: element, start: "top 88%", once: true }
        }
      );
    });

    // Scroll-expand: keep the stage sticky while the image expands from a framed crop
    // to the full viewport width. The overlay resolves later in the same scroll timeline.
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
          scrub: 0.65,
          invalidateOnRefresh: true
        }
      });
      timeline.fromTo(frame,
        { clipPath: "inset(10% 9% 10% 9% round 18px)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", duration: 1 },
        0
      );
      if (image) timeline.fromTo(image,
        { scale: 1.12, transformOrigin: "center center" },
        { scale: 1, ease: "none", duration: 1 },
        0
      );
      if (overlay) timeline.fromTo(overlay,
        { autoAlpha: 0, y: 26, filter: "blur(5px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", ease: "none", duration: 0.52 },
        0.38
      );
    });

    // Detail-page hero photos reveal in response to scroll instead of a detached
    // page-load wipe. This preserves a different image for each service/guide route.
    gsap.utils.toArray<HTMLElement>("[data-gsap-page-expand]").forEach((element) => {
      gsap.fromTo(element,
        { clipPath: "inset(8% 7% 8% 7% round 17px)", scale: 1.015 },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)", scale: 1, ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top 94%",
            end: "top 24%",
            scrub: 0.55,
            invalidateOnRefresh: true
          }
        }
      );
    });

    // Subtle text reveal on existing service, guide and FAQ headings.
    gsap.utils.toArray<HTMLElement>(".marketing-hero-title, .marketing-index-hero h1, .marketing-faq-shell h2").forEach((element) => {
      gsap.fromTo(element,
        { autoAlpha: 0, y: 25, filter: "blur(7px)" },
        {
          autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 94%", once: true }
        }
      );
    });

    window.addEventListener("load", refresh, { once: true });
    const refreshTimer = window.setTimeout(refresh, 450);
    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(refreshTimer);
    };
  }, { scope: root });

  return <div ref={root} className="scroll-motion-controller" aria-hidden="true" />;
}

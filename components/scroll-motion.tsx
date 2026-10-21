"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MOTION_PRESETS } from "@/lib/motion-presets";

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

    // Varied scroll reveals: iris, diagonal wipe, split curtain, and diamond.
    // Each image gets a different mask so the whole page does not repeat one trick.
    const imageRevealMasks = [
      "circle(0% at 50% 52%)",
      "polygon(0 0, 0 0, 0 100%, 0 100%)",
      "inset(0 50% 0 50% round 18px)",
      "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
      "circle(0% at 78% 48%)",
    ];
    gsap.utils.toArray<HTMLElement>("[data-gsap-image]:not([data-gsap-scroll-expand])").forEach((element, index) => {
      const mask = imageRevealMasks[index % imageRevealMasks.length];
      const target = mask.startsWith("circle")
        ? mask.replace("circle(0%", "circle(155%")
        : mask.startsWith("inset")
          ? "inset(0 0 0 0 round 0px)"
          : "inset(0 0 0 0)";
      gsap.fromTo(element,
        { clipPath: mask, scale: 1.045, transformOrigin: "center center" },
        {
          clipPath: target, scale: 1, duration: 1.1 + (index % 3) * .12,
          ease: "power3.inOut",
          scrollTrigger: { trigger: element, start: "top 91%", once: true }
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

    // Full-screen public detail/index heroes animate as a page-specific photo
    // on entry, then receive a restrained scrubbed parallax. This follows the
    // Animated Content / Scroll Expand pattern documented by React Bits.
    gsap.utils.toArray<HTMLElement>(".marketing-page-hero-photo, .marketing-index-hero-photo").forEach((frame) => {
      const image = frame.querySelector<HTMLElement>("img");
      const label = frame.querySelector<HTMLElement>(".marketing-page-photo-label");
      if (image) {
        gsap.fromTo(image,
          {
            clipPath: "circle(0% at 73% 48%)",
            scale: 1.12,
            autoAlpha: 0.58,
            filter: "brightness(.78) saturate(.84)",
            transformOrigin: "center center"
          },
          {
            clipPath: "circle(155% at 73% 48%)",
            scale: 1.015,
            autoAlpha: 1,
            filter: "brightness(1.08) saturate(1.12)",
            duration: 1.65,
            delay: .08,
            ease: "power3.out",
            scrollTrigger: { trigger: frame, start: "top 90%", once: true }
          }
        );
        gsap.to(image, {
          yPercent: 4.5,
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
            invalidateOnRefresh: true
          }
        });
      }
      if (label) gsap.fromTo(label,
        { autoAlpha: 0, y: 14, filter: "blur(5px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: .68, delay: .5, ease: "power3.out" }
      );
    });

    // Supporting media frames can still use the framed-to-full-width scroll reveal.
    gsap.utils.toArray<HTMLElement>("[data-gsap-page-expand]:not(.marketing-page-hero-photo):not(.marketing-index-hero-photo)").forEach((element) => {
      gsap.fromTo(element,
        { clipPath: "inset(8% 7% 8% 7% round 15px)", scale: 1.015 },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          scale: 1,
          ease: "none",
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

    // A second mask rhythm for cards: each content block gets an iris,
    // curtain, slat-like wipe or diagonal reveal as it reaches the viewport.
    const cardMaskStarts = [
      "circle(0% at 50% 50%)",
      "inset(0 0 100% 0 round 14px)",
      "inset(0 50% 0 50% round 14px)",
      "polygon(0 0, 0 0, 0 100%, 0 100%)",
      "circle(0% at 80% 50%)",
    ];
    const cardMaskTargets = [
      "circle(155% at 50% 50%)",
      "inset(0 0 0 0 round 14px)",
      "inset(0 0 0 0 round 14px)",
      "inset(0 0 0 0 round 14px)",
      "circle(155% at 80% 50%)",
    ];
    gsap.utils.toArray<HTMLElement>(".marketing-index-card, .masterclass-schedule-card").forEach((element, index) => {
      const maskIndex = index % cardMaskStarts.length;
      gsap.fromTo(element,
        { clipPath: cardMaskStarts[maskIndex], scale: .985, transformOrigin: "center center" },
        {
          clipPath: cardMaskTargets[maskIndex],
          scale: 1,
          duration: 1.05 + (index % 3) * .12,
          ease: "power3.inOut",
          scrollTrigger: { trigger: element, start: "top 91%", once: true }
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

    // Every top-level homepage section starts behind a distinct mask and
    // opens as it enters the viewport. The homepage contains 17 such sections.
    const sectionMaskPairs: Array<{ from: string; to: string }> = [
      { from: "inset(0% 100% 0% 0% round 22px)", to: "inset(0% 0% 0% 0% round 0px)" },
      { from: "inset(100% 0% 0% 0% round 22px)", to: "inset(0% 0% 0% 0% round 0px)" },
      { from: "circle(0% at 50% 50%)", to: "circle(155% at 50% 50%)" },
      { from: "inset(0% 0% 0% 100% round 22px)", to: "inset(0% 0% 0% 0% round 0px)" },
      { from: "inset(0% 50% 0% 50% round 22px)", to: "inset(0% 0% 0% 0% round 0px)" },
      { from: "polygon(0% 0%,0% 0%,0% 100%,0% 100%)", to: "polygon(0% 0%,100% 0%,100% 100%,0% 100%)" },
      { from: "inset(50% 0% 50% 0% round 22px)", to: "inset(0% 0% 0% 0% round 0px)" },
      { from: "circle(0% at 12% 45%)", to: "circle(155% at 12% 45%)" },
      { from: "inset(0% 0% 100% 0% round 22px)", to: "inset(0% 0% 0% 0% round 0px)" },
      { from: "polygon(50% 50%,50% 50%,50% 50%,50% 50%)", to: "polygon(0% 0%,100% 0%,100% 100%,0% 100%)" },
    ];

    const homepageSections = gsap.utils.toArray<HTMLElement>(".om17-home main > section");

    // The hero remains open on first paint, but its content changes with scroll
    // to lead the visitor into the next scene instead of acting like a static poster.
    const hero = homepageSections[0];
    if (hero) {
      const heroCopy = hero.querySelector<HTMLElement>(".om-car-showcase__copy");
      const heroVehicleLabel = hero.querySelector<HTMLElement>(".om-car-showcase__vehicle-label");
      const heroGlow = hero.querySelector<HTMLElement>(".om-car-showcase__glow");
      if (heroCopy) {
        gsap.to(heroCopy, {
          y: -56,
          autoAlpha: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      }
      if (heroVehicleLabel) {
        gsap.to(heroVehicleLabel, {
          x: 28,
          autoAlpha: 0.18,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      }
      if (heroGlow) {
        gsap.to(heroGlow, {
          xPercent: -11,
          opacity: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      }
    }

    homepageSections.forEach((section, index) => {
      // Index zero is the visible hero above. The next four scenes stay masked
      // until the visitor scrolls into them, and the reveal follows scroll
      // progress in reverse too, creating one continuous story rather than an
      // entrance animation that has already finished before it is seen.
      if (index === 0) return;

      const mask = sectionMaskPairs[index % sectionMaskPairs.length];
      const isStoryScene = index <= 4;
      section.dataset.motionMask = String(index % sectionMaskPairs.length);
      section.dataset.scrollStory = isStoryScene ? String(index) : "standard";

      gsap.fromTo(section,
        { clipPath: mask.from, autoAlpha: 0.94, scale: 0.992, transformOrigin: "center center" },
        {
          clipPath: mask.to,
          autoAlpha: 1,
          scale: 1,
          duration: 1,
          ease: isStoryScene ? "none" : "power3.inOut",
          scrollTrigger: isStoryScene
            ? {
                trigger: section,
                start: "top 82%",
                end: "top 24%",
                scrub: 0.8,
                invalidateOnRefresh: true,
              }
            : {
                trigger: section,
                start: "top 82%",
                once: true,
                invalidateOnRefresh: true,
              },
          ...(isStoryScene
            ? {}
            : { onComplete: () => gsap.set(section, { clearProps: "clipPath,opacity,visibility,transform" }) }),
        },
      );
    });

    // Fifty-nine reusable React/GSAP motion presets are assigned to distinct
    // inner elements across the homepage. Sections keep their own mask reveals;
    // inner headings, cards, report previews and actions then get varied motion.
    const motionSelectors = [
      ".om17-home .om17-section-heading h2",
      ".om17-home .om17-trust-item",
      ".om17-home .om17-problem-list article",
      ".om17-home .om17-pathway-card",
      ".om17-home .om17-service-card",
      ".om17-home .om17-benefit-grid > *",
      ".om17-home .om17-learning-steps > *",
      ".om17-home .om17-case-grid > *",
      ".om17-home .om17-about-principles > *",
      ".om17-home .om17-price-grid > *",
      ".om17-home .om17-faq-item",
      ".om17-home .om17-resource-card",
      ".om17-home .om17-contact-link",
      ".om17-home .om17-contact-note",
      ".om17-home .om17-report-preview",
      ".om17-home .om17-about-mark",
      ".om17-home .om17-process-grid > *",
      ".om17-home .om17-final-copy",
      ".om17-home .om17-enquiry-form",
      ".road-copy-points > *",
      ".road-copy-cta",
      ".road-journey-tail",
    ];

    const motionTargets = new Set<HTMLElement>();
    motionSelectors.forEach((selector) => {
      gsap.utils.toArray<HTMLElement>(selector).forEach((element) => {
        if (!element.matches("[data-gsap-reveal], [data-gsap-image], [data-reveal], [data-motion-static]")) {
          motionTargets.add(element);
        }
      });
    });

    Array.from(motionTargets).forEach((element, index) => {
      const motion = MOTION_PRESETS[index % MOTION_PRESETS.length];
      element.dataset.motionPreset = motion.name;
      gsap.fromTo(element,
        { ...motion.from, transformOrigin: motion.from.transformOrigin || "center center" },
        {
          ...motion.to,
          duration: motion.duration,
          ease: motion.ease,
          delay: (index % 4) * 0.035,
          scrollTrigger: {
            trigger: element,
            start: "top 92%",
            once: true,
            invalidateOnRefresh: true,
          },
          onComplete: () => gsap.set(element, {
            clearProps: "clipPath,opacity,visibility,transform,filter,letterSpacing",
          }),
        },
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

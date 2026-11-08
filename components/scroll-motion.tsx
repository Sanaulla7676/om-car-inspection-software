"use client";

import { useEffect } from "react";

const REVEAL_TARGETS = [
  "[data-gsap-reveal]",
  "[data-gsap-image]",
  "[data-gsap-scroll-expand]",
  "[data-gsap-page-expand]",
  ".marketing-index-card",
  ".masterclass-schedule-card",
  ".marketing-hero-title",
  ".marketing-index-hero h1",
  ".marketing-faq-shell h2",
  ".om17-home .om17-section-heading",
  ".om17-home .om17-trust-item",
  ".om17-home .om17-problem-list article",
  ".om17-home .om17-pathway-card",
  ".om17-home .om17-service-card",
  ".om17-home .om17-benefit-grid > *",
  ".om17-home .om17-learning-steps > *",
  ".om17-home .om17-report-preview",
  ".om17-home .om17-process-grid > *",
  ".om17-home .om17-testimonial-panel",
  ".om17-home .om17-case-grid > *",
  ".om17-home .om17-about-mark",
  ".om17-home .om17-price-grid > *",
  ".om17-home .om17-faq-item",
  ".om17-home .om17-resource-card",
  ".om17-home .om17-contact-link",
  ".om17-home .om17-contact-note",
  ".om17-home .om17-final-copy",
  ".om17-home .om17-enquiry-form",
  ".pdi-pathway-heading",
  ".road-copy-points > *",
  ".road-copy-cta",
  ".road-journey-tail"
].join(",");

export function ScrollMotion() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_TARGETS));
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("om-scroll-reveal--visible");
        activeObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -7% 0px", threshold: 0.08 });

    targets.forEach((element) => {
      const siblings = element.parentElement ? Array.from(element.parentElement.children) : [];
      const siblingIndex = siblings.length > 1 ? Math.max(0, siblings.indexOf(element)) : 0;
      element.style.setProperty("--om-scroll-reveal-delay", Math.min(siblingIndex * 45, 135) + "ms");
      element.classList.add("om-scroll-reveal");
      if (element.matches("img[data-gsap-image]")) element.classList.add("om-scroll-reveal--image");
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

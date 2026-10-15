"use client";

import { useEffect } from "react";

export function SiteEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = Array.from(document.querySelectorAll("[data-reveal]"));
    let observer: IntersectionObserver | null = null;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("reveal-in"));
    } else {
      const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const rawDelay = element.dataset.revealDelay || "0";
            element.style.setProperty("--reveal-delay", rawDelay + "ms");
            element.classList.add("reveal-in");
            activeObserver.unobserve(element);
          }
        });
      }, { rootMargin: "0px 0px -45px 0px", threshold: 0.08 });
      observer = activeObserver;
      elements.forEach((element) => activeObserver.observe(element));
    }

    let ticking = false;
    const updateProgress = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? window.scrollY / max : 0;
        root.style.setProperty("--site-scroll", String(Math.min(1, Math.max(0, ratio))));
        const bar = document.getElementById("site-scroll-progress-fill");
        if (bar) bar.style.transform = "scaleX(" + ratio + ")";
        ticking = false;
      });
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    const pointerCards = Array.from(document.querySelectorAll<HTMLElement>(".site-spotlight"));
    const movePointer = (event: PointerEvent) => {
      for (const card of pointerCards) {
        const rect = card.getBoundingClientRect();
        if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) {
          card.style.setProperty("--spot-x", (event.clientX - rect.left) + "px");
          card.style.setProperty("--spot-y", (event.clientY - rect.top) + "px");
        }
      }
    };
    window.addEventListener("pointermove", movePointer, { passive: true });
    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      window.removeEventListener("pointermove", movePointer);
    };
  }, []);

  return null;
}

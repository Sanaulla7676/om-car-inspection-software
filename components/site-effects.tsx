"use client";

import { useEffect } from "react";

export function SiteEffects() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    let observer: IntersectionObserver | null = null;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("reveal-in"));
    } else {
      observer = new IntersectionObserver((entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          const rawDelay = element.dataset.revealDelay || "0";
          element.style.setProperty("--reveal-delay", rawDelay + "ms");
          element.classList.add("reveal-in");
          activeObserver.unobserve(element);
        });
      }, { rootMargin: "0px 0px -45px 0px", threshold: 0.08 });
      elements.forEach((element) => observer?.observe(element));
    }

    const progressBar = document.getElementById("site-scroll-progress-fill");
    let maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    let frame = 0;

    const updateProgress = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
        if (progressBar) progressBar.style.transform = "scaleX(" + ratio + ")";
      });
    };

    const measureScrollRange = () => {
      maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      updateProgress();
    };

    measureScrollRange();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", measureScrollRange, { passive: true });

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(measureScrollRange)
      : null;
    resizeObserver?.observe(document.documentElement);
    resizeObserver?.observe(document.body);

    const movePointer = (event: PointerEvent) => {
      const target = event.target instanceof Element
        ? event.target.closest<HTMLElement>(".site-spotlight")
        : null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--spot-x", (event.clientX - rect.left) + "px");
      target.style.setProperty("--spot-y", (event.clientY - rect.top) + "px");
    };

    window.addEventListener("pointermove", movePointer, { passive: true });

    return () => {
      observer?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", measureScrollRange);
      window.removeEventListener("pointermove", movePointer);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}

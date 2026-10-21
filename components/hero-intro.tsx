"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { X } from "lucide-react";

export function HeroIntro() {
  const [visible, setVisible] = useState(true);
  const [mobile, setMobile] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closingRef = useRef(false);

  const finish = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    try {
      window.sessionStorage.setItem("omkar-intro-seen", "1");
    } catch {
      // Private browsing may block storage; the intro still closes normally.
    }
    const overlay = overlayRef.current;
    if (!overlay) {
      setVisible(false);
      return;
    }
    gsap.to(overlay, {
      autoAlpha: 0,
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.72,
      ease: "power2.inOut",
      onComplete: () => setVisible(false),
    });
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 760px), (pointer: coarse) and (max-width: 1024px)");
    setMobile(mobileQuery.matches);

    if (preference.matches) {
      setVisible(false);
      return;
    }

    try {
      if (window.sessionStorage.getItem("omkar-intro-seen") === "1") {
        setVisible(false);
        return;
      }
    } catch {
      // Continue without persistence.
    }

    const handleMobile = (event: MediaQueryListEvent) => setMobile(event.matches);
    mobileQuery.addEventListener("change", handleMobile);
    const failsafe = window.setTimeout(finish, 6500);
    return () => {
      mobileQuery.removeEventListener("change", handleMobile);
      window.clearTimeout(failsafe);
    };
  }, [finish]);

  useGSAP(() => {
    if (!visible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const video = videoRef.current;
    if (video) {
      gsap.fromTo(video,
        { scale: 1.12, filter: "brightness(.55) saturate(.8)", clipPath: "inset(4% 7% 4% 7% round 24px)" },
        {
          scale: 1,
          filter: "brightness(1) saturate(1.06)",
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          duration: 1.35,
          ease: "power3.out",
        },
      );
    }
  }, { dependencies: [visible, mobile], scope: overlayRef });

  if (!visible) return null;

  const introVideo = mobile ? "/videos/omkar-intro-mobile.mp4" : "/videos/omkar-intro-desktop.mp4";

  return (
    <div ref={overlayRef} className="omkar-intro-overlay" role="dialog" aria-label="OMKAR Car Inspection introduction">
      <video
        key={introVideo}
        ref={videoRef}
        className="omkar-intro-video"
        src={introVideo}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-label={mobile ? "Vertical OMKAR introduction video" : "Landscape OMKAR introduction video"}
        onCanPlay={() => {
          const video = videoRef.current;
          if (video) void video.play().catch(finish);
        }}
        onEnded={finish}
        onError={finish}
      />
      <div className="omkar-intro-vignette" aria-hidden="true" />
      <button type="button" className="omkar-intro-skip" onClick={finish} aria-label="Skip introduction">
        Skip intro <X size={15} />
      </button>
      <span className="omkar-intro-progress" aria-hidden="true" />
    </div>
  );
}

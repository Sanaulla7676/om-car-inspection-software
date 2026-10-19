"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X, Search, UserRound, PhoneCall, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  { label: "Vehicle Inspections", href: "/services" },
  { label: "PDI Training", href: "/masterclass" },
  { label: "Reports & Evidence", href: "/services/inspection-report" },
  { label: "About", href: "/about" }
];

export function SiteNavigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [enquiryInView, setEnquiryInView] = useState(false);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("#vehicle-inquiry, .lux-coaching-enquiry"));
    if (!targets.length || !("IntersectionObserver" in window)) return;
    const visibleTargets = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleTargets.add(entry.target);
        else visibleTargets.delete(entry.target);
      });
      setEnquiryInView(visibleTargets.size > 0);
    }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      <div className="site-scroll-progress" aria-hidden="true"><span id="site-scroll-progress-fill" /></div>
      <header className="site-header-v2 luxury-header">
        <Link href="/" className="site-brand-v2 luxury-brand" aria-label="OM Car Inspection home" onClick={() => setMobileOpen(false)}>
          <img className="lux-brand-logo-img" src="https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/a526dc36-b0a0-4787-bbc3-bed064b316c1.png" alt="OMKAR Inspection" width={120} height={46} />
        </Link>

        <nav className={"capsule-nav luxury-capsule-nav" + (mobileOpen ? " capsule-nav-open" : "")} aria-label="Main navigation">
          <span className="capsule-glass-highlight" aria-hidden="true" />
          {links.map((item) => {
            const hashless = item.href.split("#")[0];
            const active = item.href === "/" ? pathname === "/" : item.href.includes("#") ? false : pathname === hashless || pathname.startsWith(hashless + "/");
            return (
              <Link
                href={item.href as any}
                key={item.href}
                className={"capsule-nav-link luxury-nav-link" + (active ? " is-current" : "")}
                onClick={() => setMobileOpen(false)}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="lux-header-actions">
          <Link href="/services" className="lux-header-icon" aria-label="Explore services"><Search size={17} /></Link>
          <Link href="/login" className="lux-header-icon" aria-label="Open sign-in"><UserRound size={17} /></Link>
          <Link href="/book-inspection" className="lux-header-login">Book Inspection <ArrowRight size={14} /></Link>
        </div>

        <button className="site-mobile-toggle" type="button" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-label={mobileOpen ? "Close navigation" : "Open navigation"}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <div className={"lux-floating-contact" + (enquiryInView ? " is-hidden-for-enquiry" : "")} aria-label="Contact OMKAR Car Inspection">
        <a className="lux-floating-whatsapp" href="https://wa.me/918880339999?text=Hello%20OMKAR%20Car%20Inspection%2C%20I%20would%20like%20to%20enquire%20about%20your%20services." target="_blank" rel="noopener noreferrer" aria-label="Chat with OMKAR on WhatsApp">
          <MessageCircle size={19} strokeWidth={2.4} />
          <span>WhatsApp</span>
        </a>
        <a className="lux-floating-call" href="tel:+918880339999" aria-label="Call OMKAR Car Inspection at 8880339999">
          <PhoneCall size={18} strokeWidth={2.4} />
          <span>Call <b>8880339999</b></span>
        </a>
      </div>
    </>
  );
}

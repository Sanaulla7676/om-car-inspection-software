"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X, Search, UserRound } from "lucide-react";
import { useState } from "react";

const links = [
  { label: "Home", href: "/" },
  { label: "New Vehicle PDI", href: "/services/new-car-pdi" },
  { label: "Pre-Owned PDI", href: "/services/used-car-inspection" },
  { label: "PDI Coaching", href: "/masterclass" },
  { label: "Valuation", href: "/#valuation-reports" },
  { label: "Reports", href: "/services/inspection-report" }
];

export function SiteNavigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="site-scroll-progress" aria-hidden="true"><span id="site-scroll-progress-fill" /></div>
      <header className="site-header-v2 luxury-header">
        <Link href="/" className="site-brand-v2 luxury-brand" aria-label="OM Car Inspection home" onClick={() => setMobileOpen(false)}>
          <span className="lux-brand-mark" aria-hidden="true"><span className="lux-brand-car">⌒</span><span className="lux-brand-word">OMKAR</span><small>CAR INSPECTION</small></span>
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
          <Link href="/login" className="lux-header-login">Login / Sign in <ArrowRight size={14} /></Link>
        </div>

        <button className="site-mobile-toggle" type="button" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-label={mobileOpen ? "Close navigation" : "Open navigation"}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, ShieldCheck, X, Search, UserRound } from "lucide-react";
import { useState } from "react";

const links = [
  { label: "Home", href: "/" },
  { label: "New PDI", href: "/services/new-car-pdi" },
  { label: "Old PDA", href: "/services/used-car-inspection" },
  { label: "Valuation", href: "/#valuation" },
  { label: "Reports", href: "/services/inspection-report" },
  { label: "Customers", href: "/#customers" }
];

export function SiteNavigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="site-scroll-progress" aria-hidden="true"><span id="site-scroll-progress-fill" /></div>
      <header className="site-header-v2 luxury-header">
        <Link href="/" className="site-brand-v2 luxury-brand" aria-label="Omkar Car Inspection home" onClick={() => setMobileOpen(false)}>
          <span className="lux-brand-mark" aria-hidden="true"><span className="lux-brand-car">⌒</span><span className="lux-brand-word">OMKAR</span><small>CAR INSPECTION</small></span>
        </Link>

        <nav className={"capsule-nav luxury-capsule-nav" + (mobileOpen ? " capsule-nav-open" : "")} aria-label="Main navigation">
          <span className="capsule-glass-highlight" aria-hidden="true" />
          {links.map((item) => {
            const hashless = item.href.split("#")[0];
            const active = item.href === "/" ? pathname === "/" : hashless ? pathname === hashless || pathname.startsWith(hashless + "/") : false;
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
          <Link href="/dashboard" className="capsule-nav-link luxury-nav-admin" onClick={() => setMobileOpen(false)}>
            <ShieldCheck size={13} /><span>Admin</span>
          </Link>
        </nav>

        <div className="lux-header-actions">
          <Link href="/services" className="lux-header-icon" aria-label="Explore services"><Search size={17} /></Link>
          <Link href="/dashboard" className="lux-header-icon" aria-label="Open administrator sign-in"><UserRound size={17} /></Link>
          <Link href="/dashboard" className="lux-header-login">Login / Sign in <ArrowRight size={14} /></Link>
        </div>

        <button className="site-mobile-toggle" type="button" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-label={mobileOpen ? "Close navigation" : "Open navigation"}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>
    </>
  );
}

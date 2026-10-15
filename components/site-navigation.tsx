"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";

const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Used-car PDI", href: "/services/used-car-pdi" },
  { label: "New-car PDI", href: "/services/new-car-pdi" },
  { label: "Masterclass", href: "/masterclass" },
  { label: "Guides", href: "/guides" },
  { label: "Inspection software", href: "/dashboard", software: true }
];

export function SiteNavigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="site-scroll-progress" aria-hidden="true"><span id="site-scroll-progress-fill" /></div>
      <header className="site-header-v2">
        <Link href="/" className="site-brand-v2" aria-label="OM Car Inspection home" onClick={() => setMobileOpen(false)}>
          <span className="site-brand-mark">OM<span>.</span></span>
          <span className="site-brand-copy"><b>OM CAR INSPECTION</b><small>INSPECT · LEARN · BUILD</small></span>
        </Link>

        <nav className={"capsule-nav" + (mobileOpen ? " capsule-nav-open" : "")} aria-label="Main navigation">
          <span className="capsule-glass-highlight" aria-hidden="true" />
          {links.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                href={item.href}
                key={item.href}
                className={"capsule-nav-link" + (active ? " is-current" : "") + (item.software ? " software-link" : "")}
                onClick={() => setMobileOpen(false)}
              >
                {item.software && <ShieldCheck size={14} />}
                <span>{item.label}</span>
                {item.software && <ArrowRight size={13} />}
              </Link>
            );
          })}
          <Link href="/book-inspection" className="capsule-nav-link capsule-book-link" onClick={() => setMobileOpen(false)}>
            Book an inspection <ArrowRight size={14} />
          </Link>
        </nav>

        <button className="site-mobile-toggle" type="button" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-label={mobileOpen ? "Close navigation" : "Open navigation"}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>
    </>
  );
}

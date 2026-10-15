import Link from "next/link";
import { ArrowUpRight, ArrowRight, ShieldCheck } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer-v2">
      <div className="site-footer-inner">
        <div className="site-footer-brand-block">
          <Link href="/" className="site-brand-v2 footer-brand-v2">
            <span className="site-brand-mark">OM<span>.</span></span>
            <span className="site-brand-copy"><b>OM CAR INSPECTION</b><small>INSPECT · LEARN · BUILD</small></span>
          </Link>
          <p>Structured vehicle condition reviews and practical learning, built around clear observations and evidence-led reporting.</p>
          <Link className="footer-dashboard-link" href="/dashboard"><ShieldCheck size={15} /> Open the inspection software <ArrowUpRight size={14} /></Link>
        </div>
        <div className="site-footer-col">
          <h3>INSPECTION SERVICES</h3>
          <Link href="/services/used-car-inspection">Used-car inspection</Link>
          <Link href="/services/new-car-pdi">New-car PDI</Link>
          <Link href="/services/used-car-pdi">Used-vehicle PDI</Link>
          <Link href="/services/vehicle-diagnostics">Vehicle diagnostics</Link>
          <Link href="/services/inspection-report">Inspection reports</Link>
          <Link href="/services">All services <ArrowRight size={13} /></Link>
        </div>
        <div className="site-footer-col">
          <h3>LEARN & EXPLORE</h3>
          <Link href="/masterclass">Six-day masterclass</Link>
          <Link href="/guides">Inspection guides</Link>
          <Link href="/guides/used-car-inspection-checklist">Used-car checklist</Link>
          <Link href="/guides/new-car-pdi-checklist">New-car PDI checklist</Link>
          <Link href="/about">About</Link>
          <Link href="/faq">FAQs</Link>
        </div>
        <div className="site-footer-col">
          <h3>GET IN TOUCH</h3>
          <p>Share your vehicle details or learning goals. Timing, scope and fees are confirmed before a booking is final.</p>
          <Link className="footer-contact-link" href="/contact">Contact and bookings <ArrowRight size={14} /></Link>
          <Link href="/book-masterclass">Request a masterclass slot</Link>
          <Link href="/book-inspection">Request an inspection</Link>
        </div>
      </div>
      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} OM Car Inspection</span>
        <span>Evidence first. Clearer decisions.</span>
        <Link href="/privacy">Privacy information <ArrowUpRight size={12} /></Link>
      </div>
    </footer>
  );
}

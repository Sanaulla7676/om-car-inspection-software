import Link from "next/link";
import { ArrowRight, ShieldCheck, ArrowUpRight } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer-v2 luxury-footer">
      <div className="lux-footer-main">
        <div className="lux-footer-brand">
          <Link href="/" className="lux-footer-logo" aria-label="Omkar Car Inspection home">
            <img className="lux-footer-logo-img" src="https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/a526dc36-b0a0-4787-bbc3-bed064b316c1.png" alt="OMKAR Inspection" width={150} height={58} />
          </Link>
          <p>Professional vehicle inspection, structured valuation and evidence-led reporting for clearer decisions.</p>
          <Link className="lux-footer-admin" href="/login"><ShieldCheck size={15} /> Team sign-in <ArrowUpRight size={13} /></Link>
        </div>
        <div className="lux-footer-col">
          <h3>INSPECTION SERVICES</h3>
          <Link href="/services/new-car-pdi">New Vehicle PDI</Link>
          <Link href="/services/used-car-inspection">Old Vehicle PDA</Link>
          <Link href="/#valuation-reports">Vehicle valuation</Link>
          <Link href="/services/inspection-report">Reports & documentation</Link>
          <Link href="/services">Explore all services <ArrowRight size={13} /></Link>
        </div>
        <div className="lux-footer-col">
          <h3>RESOURCES</h3>
          <Link href="/guides">Inspection guides</Link>
          <Link href="/faq">Frequently asked questions</Link>
          <Link href="/about">About Omkar</Link>
          <Link href="/contact">Contact & bookings</Link>
          <Link href="/privacy">Privacy information</Link>
        </div>
        <div className="lux-footer-col lux-footer-contact">
          <h3>READY TO BEGIN?</h3>
          <p>Choose a service or ask the team about scope, timing and available booking options.</p>
          <Link className="lux-footer-contact-cta" href="/book-inspection">Request an inspection <ArrowRight size={14} /></Link>
          <Link href="/login">Team sign-in <ShieldCheck size={13} /></Link>
        </div>
      </div>
      <div className="lux-footer-bottom">
        <span>© {new Date().getFullYear()} Omkar Car Inspection</span>
        <span>Inspect clearly. Decide confidently.</span>
        <Link href="/privacy">Privacy & terms <ArrowUpRight size={12} /></Link>
      </div>
    </footer>
  );
}

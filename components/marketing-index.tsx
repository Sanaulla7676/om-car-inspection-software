import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { MarketingPageContent } from "@/lib/marketing-content";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteEffects } from "@/components/site-effects";

export function MarketingIndexPage({ kind, pages }: { kind: "service" | "guide"; pages: MarketingPageContent[] }) {
  const isGuide = kind === "guide";
  return (
    <div className="marketing-site page-fade-in">
      <SiteEffects />
      <SiteNavigation />
      <main>
        <section className="marketing-index-hero">
          <div className="marketing-hero-content">
            <p className="eyebrow eyebrow-on-dark"><span className="eyebrow-live-dot" /> {isGuide ? "KNOWLEDGE LIBRARY" : "INSPECTION SERVICES"}</p>
            <h1>{isGuide ? "Learn what to check." : "Choose the right inspection."}<span>{isGuide ? "Understand what it can prove." : "Know the scope before you book."}</span></h1>
            <p>{isGuide ? "Practical vehicle inspection guides on condition checks, PDI, photos, diagnostics, reports and the limits of a visual assessment." : "Separate service pages explain the purpose, typical checks and limitations of each option. The final scope, availability and fees are confirmed before booking."}</p>
            <div className="marketing-hero-actions"><Link href={isGuide ? "/services" : "/book-inspection"} className="site-button-v2 button-bright">{isGuide ? "Explore inspection services" : "Request a booking"} <ArrowRight size={15} /></Link>{isGuide && <Link href="/masterclass" className="site-button-v2 button-glass">Learn inspection skills <ArrowRight size={15} /></Link>}</div>
          </div>
        </section>
        <section className="marketing-index-section">
          <div className="site-container-v2">
            <div className="marketing-index-grid">
              {pages.map((page, index) => <article key={page.slug} className="marketing-index-card site-spotlight" data-reveal data-reveal-delay={(index % 6) * 45}>
                <span className="index-card-number">{isGuide ? "FIELD GUIDE" : "SERVICE"} / {String(index + 1).padStart(2, "0")}</span>
                <h2>{page.title}</h2>
                <p>{page.intro}</p>
                <Link href={((isGuide ? "/guides/" : "/services/") + page.slug) as any} className="index-card-link">Read details <ArrowRight size={14} /></Link>
              </article>)}
            </div>
            {pages.length === 0 && <div className="marketing-empty-state">Content is being prepared.</div>}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

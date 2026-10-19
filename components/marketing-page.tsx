import Link from "next/link";
import { ArrowRight, ChevronRight, ShieldCheck } from "lucide-react";
import type { MarketingPageContent } from "@/lib/marketing-content";
import { servicePages, guidePages } from "@/lib/marketing-content";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteEffects } from "@/components/site-effects";
import { ScrollMotion } from "@/components/scroll-motion";
import { CoachingInquiryForm } from "@/components/coaching-inquiry-form";

const trainingDays = [
  ["DAY 01", "Inspection workflow and safety", "Vehicle identity, scope, safe work habits and the order of checks."],
  ["DAY 02", "Exterior and body condition", "Panels, paint, glass, lights, tyres, wheels and visible condition clues."],
  ["DAY 03", "Engine-bay observations", "Safe visual checks, accessible fluids, hoses, belts and signs that need follow-up."],
  ["DAY 04", "Cabin and diagnostic basics", "Interior controls, warning lamps and the context behind OBD codes."],
  ["DAY 05", "Road test and report writing", "Authorised road-test observations, evidence photos, severity and clear reporting."],
  ["DAY 06", "Guided practice and business readiness", "Review a supervised inspection, practise customer-ready reporting and discuss the fundamentals of offering an inspection service."]
];

export function MarketingPage({ content }: { content: MarketingPageContent }) {
  const isGuide = content.kind === "guide";
  const isMasterclass = content.slug === "masterclass";
  const nearby = isGuide
    ? guidePages.filter((page) => page.slug !== content.slug).slice(0, 3)
    : servicePages.filter((page) => page.slug !== content.slug).slice(0, 3);
const PAGE_HERO_IMAGES: Record<string, { image: string; label: string; alt: string }> = {
  "used-car-inspection": { image: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/40087/thar-exterior-right-front-three-quarter-37.jpeg?isig=0&q=80", label: "PRE-OWNED VEHICLE INSPECTION", alt: "Mahindra Thar displayed for used-vehicle inspection" },
  "new-car-pdi": { image: "https://htcms-prod-images.s3.ap-south-1.amazonaws.com/htmobile1/hyundai_new-verna/images/colours_hyundai-verna_titan-grey_1920x1033.jpg", label: "NEW VEHICLE PDI", alt: "Hyundai Verna in a bright vehicle showroom" },
  "used-car-pdi": { image: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/40087/thar-exterior-right-front-three-quarter-37.jpeg?isig=0&q=80", label: "PRE-OWNED VEHICLE PDI", alt: "Mahindra Thar for pre-owned PDI" },
  "pre-purchase-inspection": { image: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/178525/glc-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80", label: "PRE-PURCHASE INSPECTION", alt: "Mercedes-Benz GLC in a clean vehicle bay" },
  "vehicle-diagnostics": { image: "https://cdn-s3.autocarindia.com/Mahindra/xuv700/_KMC0974.JPG", label: "VEHICLE DIAGNOSTICS", alt: "Mahindra XUV700 in an automotive inspection setting" },
  "inspection-report": { image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=90", label: "INSPECTION REPORTS", alt: "Vehicle inspection report and documentation" },
  "vehicle-condition-assessment": { image: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/178525/glc-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80", label: "VEHICLE CONDITION ASSESSMENT", alt: "Vehicle condition assessment example vehicle" },
  "fleet-vehicle-inspection": { image: "https://cdn-s3.autocarindia.com/Mahindra/xuv700/_KMC0974.JPG", label: "FLEET VEHICLE INSPECTION", alt: "Mahindra XUV700 representing fleet inspection" },
  "dealer-inspection-support": { image: "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/936fcbb7-1c2c-420f-ab93-c8a897dfb549.png", label: "DEALER INSPECTION SUPPORT", alt: "Toyota Fortuner in a professional inspection workshop" },
  "independent-car-inspection": { image: "https://htcms-prod-images.s3.ap-south-1.amazonaws.com/htmobile1/hyundai_new-verna/images/colours_hyundai-verna_titan-grey_1920x1033.jpg", label: "INDEPENDENT CAR INSPECTION", alt: "Hyundai Verna for independent vehicle inspection" },
  "used-car-inspection-checklist": { image: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/40087/thar-exterior-right-front-three-quarter-37.jpeg?isig=0&q=80", label: "USED-CAR INSPECTION CHECKLIST", alt: "Mahindra Thar for used-car checklist" },
  "new-car-pdi-checklist": { image: "https://htcms-prod-images.s3.ap-south-1.amazonaws.com/htmobile1/hyundai_new-verna/images/colours_hyundai-verna_titan-grey_1920x1033.jpg", label: "NEW-CAR PDI CHECKLIST", alt: "Hyundai Verna for new-car delivery checks" },
  "tyre-and-wheel-checks": { image: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/178525/glc-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80", label: "TYRE & WHEEL CHECKS", alt: "Mercedes-Benz GLC with visible wheels and tyres" },
  "paint-and-bodywork-checks": { image: "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/936fcbb7-1c2c-420f-ab93-c8a897dfb549.png", label: "PAINT & BODYWORK CHECKS", alt: "Toyota Fortuner reflecting body-panel condition" },
  "engine-bay-inspection-guide": { image: "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/18971d42-3c84-4532-b232-c7a29e9ac3dd.png", label: "ENGINE-BAY INSPECTION", alt: "Vehicle under inspection in a workshop" },
  "underbody-inspection-checks": { image: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/40087/thar-exterior-right-front-three-quarter-37.jpeg?isig=0&q=80", label: "UNDERBODY INSPECTION", alt: "Mahindra Thar for underbody inspection context" },
  "road-test-observations": { image: "https://cdn-s3.autocarindia.com/Mahindra/xuv700/_KMC0974.JPG", label: "ROAD-TEST OBSERVATIONS", alt: "Mahindra XUV700 representing vehicle assessment" },
  "documents-and-vehicle-identity": { image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=90", label: "DOCUMENTS & VEHICLE IDENTITY", alt: "Vehicle inspection documentation and report" },
  "understanding-obd-codes": { image: "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/18971d42-3c84-4532-b232-c7a29e9ac3dd.png", label: "UNDERSTANDING OBD CODES", alt: "Automotive inspection in a workshop" },
  "what-goes-in-inspection-report": { image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=90", label: "WHAT GOES IN A REPORT", alt: "Vehicle inspection report paperwork" },
  "how-long-does-inspection-take": { image: "https://htcms-prod-images.s3.ap-south-1.amazonaws.com/htmobile1/hyundai_new-verna/images/colours_hyundai-verna_titan-grey_1920x1033.jpg", label: "INSPECTION TIMING", alt: "Hyundai Verna being prepared for inspection" },
  "inspection-vs-regular-service": { image: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/178525/glc-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80", label: "INSPECTION VS SERVICE", alt: "Mercedes-Benz GLC in a professional vehicle bay" },
  "used-car-buying-checklist": { image: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/40087/thar-exterior-right-front-three-quarter-37.jpeg?isig=0&q=80", label: "USED-CAR BUYING CHECKLIST", alt: "Mahindra Thar before a used-car purchase" },
  "accident-damage-signs": { image: "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/936fcbb7-1c2c-420f-ab93-c8a897dfb549.png", label: "ACCIDENT-DAMAGE SIGNS", alt: "Toyota Fortuner shown for exterior condition review" },
  "water-damage-signs": { image: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/40087/thar-exterior-right-front-three-quarter-37.jpeg?isig=0&q=80", label: "WATER-DAMAGE SIGNS", alt: "Mahindra Thar for condition inspection guidance" },
  "how-to-review-vehicle-photos": { image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=90", label: "REVIEWING VEHICLE PHOTOS", alt: "Vehicle inspection photography and reporting" },
  "vehicle-inspection-scoring-explained": { image: "https://cdn-s3.autocarindia.com/Mahindra/xuv700/_KMC0974.JPG", label: "INSPECTION SCORING", alt: "Mahindra XUV700 for inspection scoring context" },
  "how-to-prepare-car-for-pdi": { image: "https://htcms-prod-images.s3.ap-south-1.amazonaws.com/htmobile1/hyundai_new-verna/images/colours_hyundai-verna_titan-grey_1920x1033.jpg", label: "PREPARE FOR PDI", alt: "Hyundai Verna in a bright inspection environment" },
  "inspection-for-first-time-buyers": { image: "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/936fcbb7-1c2c-420f-ab93-c8a897dfb549.png", label: "FIRST-TIME BUYER GUIDE", alt: "Toyota Fortuner before purchase inspection" },
  "car-inspector-career-guide": { image: "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/18971d42-3c84-4532-b232-c7a29e9ac3dd.png", label: "CAR INSPECTOR CAREER", alt: "Hands-on automotive inspection training" },
  "pre-delivery-inspection-basics": { image: "https://htcms-prod-images.s3.ap-south-1.amazonaws.com/htmobile1/hyundai_new-verna/images/colours_hyundai-verna_titan-grey_1920x1033.jpg", label: "PRE-DELIVERY INSPECTION BASICS", alt: "Hyundai Verna for pre-delivery inspection basics" },
  "visual-inspection-limits": { image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=90", label: "VISUAL INSPECTION LIMITS", alt: "Vehicle inspection report and documentation" },
  "vehicle-inspection-photo-checklist": { image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=90", label: "PHOTO EVIDENCE CHECKLIST", alt: "Vehicle inspection photo and report documentation" },
  "service-history-review": { image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=90", label: "SERVICE HISTORY REVIEW", alt: "Automotive records and report review" },
  "brakes-and-suspension-observations": { image: "https://imgd-ct.aeplcdn.com/1056x660/n/cw/ec/178525/glc-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80", label: "BRAKES & SUSPENSION", alt: "Mercedes-Benz GLC for vehicle-system inspection" },
  "interior-and-electrical-checks": { image: "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/18971d42-3c84-4532-b232-c7a29e9ac3dd.png", label: "INTERIOR & ELECTRICAL CHECKS", alt: "Automotive inspection in a professional workshop" },
  "inspection-priority-levels": { image: "https://cdn-s3.autocarindia.com/Mahindra/xuv700/_KMC0974.JPG", label: "INSPECTION PRIORITY LEVELS", alt: "Mahindra XUV700 for inspection evaluation" },
  "preparing-for-independent-inspection": { image: "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/936fcbb7-1c2c-420f-ab93-c8a897dfb549.png", label: "PREPARE FOR INDEPENDENT INSPECTION", alt: "Toyota Fortuner before inspection" },
  "vehicle-inspection-for-fleet-managers": { image: "https://cdn-s3.autocarindia.com/Mahindra/xuv700/_KMC0974.JPG", label: "FLEET INSPECTION FOR MANAGERS", alt: "Mahindra XUV700 for fleet inspection" },
  "masterclass": { image: "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/2f1faea6-1140-4625-9abe-5ef915fdea93.png", label: "PDI COACHING & TRAINING", alt: "Hands-on vehicle PDI masterclass training" },
  "about": { image: "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/18971d42-3c84-4532-b232-c7a29e9ac3dd.png", label: "ABOUT OMKAR INSPECTION", alt: "Professional automotive inspection workshop" },
  "contact": { image: "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/936fcbb7-1c2c-420f-ab93-c8a897dfb549.png", label: "CONTACT OMKAR INSPECTION", alt: "Toyota Fortuner in an inspection workshop" },
  "faq": { image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=90", label: "VEHICLE INSPECTION FAQ", alt: "Vehicle inspection reporting and documentation" },
};

const DEFAULT_PAGE_HERO = {
  image: "https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/936fcbb7-1c2c-420f-ab93-c8a897dfb549.png",
  label: "VEHICLE INSPECTION",
  alt: "Toyota Fortuner in a professional inspection workshop"
};
  const pageHero = PAGE_HERO_IMAGES[content.slug] || DEFAULT_PAGE_HERO;
  const heroImage = pageHero.image;
  const heroImageLabel = pageHero.label;
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: isGuide ? "Guides" : (content.kind === "static" ? "Explore" : "Services"), href: isGuide ? "/guides" : (content.kind === "static" ? "/" : "/services") },
    { label: content.title, href: isGuide ? "/guides/" + content.slug : (content.slug === "masterclass" ? "/masterclass" : (content.kind === "static" ? "/" + content.slug : "/services/" + content.slug)) }
  ];
  const canonicalPath = isGuide ? "/guides/" + content.slug : (content.slug === "masterclass" ? "/masterclass" : (content.kind === "static" ? "/" + content.slug : "/services/" + content.slug));
  const structuredData = {
    "@context": "https://schema.org",
    "@type": isGuide ? "Article" : (content.kind === "static" ? "WebPage" : "Service"),
    name: content.title,
    headline: content.title,
    description: content.metaDescription,
    url: "https://om-car-inspection-software.vercel.app" + canonicalPath,
    publisher: { "@type": "Organization", name: "OM Car Inspection", url: "https://om-car-inspection-software.vercel.app" },
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://om-car-inspection-software.vercel.app" + canonicalPath }
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer }
    }))
  };

  return (
    <div className="marketing-site page-fade-in">
      <SiteEffects />
      <ScrollMotion />
      <SiteNavigation />
      <main>
        <section className="marketing-hero">
          <div className="marketing-hero-content">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, index) => <span key={crumb.label} className="breadcrumb-item">{index > 0 && <ChevronRight size={12} />}<Link href={crumb.href as any}>{crumb.label}</Link></span>)}
            </nav>
            <div className="marketing-hero-grid">
              <div>
                <p className="eyebrow eyebrow-on-dark"><span className="eyebrow-live-dot" /> {isGuide ? "INSPECTION LEARNING GUIDE" : isMasterclass ? "PRACTICAL VEHICLE TRAINING" : content.kind === "static" ? "OM CAR INSPECTION" : "VEHICLE INSPECTION SERVICE"}</p>
                <h1 className="marketing-hero-title">{content.title}</h1>
                <p className="marketing-hero-tagline shiny-heading">{content.tagline}</p>
                <p className="marketing-hero-intro">{content.intro}</p>
                <div className="marketing-hero-actions">
                  <Link href={(content.primaryHref || (isGuide ? "/services/used-car-inspection" : "/book-inspection")) as any} className="site-button-v2 button-bright">{content.primaryLabel || (isGuide ? "Explore inspection services" : "Request an inspection")} <ArrowRight size={15} /></Link>
                  <Link href="/login" className="site-button-v2 button-glass"><ShieldCheck size={15} /> Team sign in</Link>
                </div>
              </div>
              <aside className="marketing-hero-meta" data-gsap-reveal>
                <span className="meta-kicker">{isGuide ? "WHAT THIS PAGE COVERS" : "A CLEARER WORKFLOW"}</span>
                <strong>{isGuide ? "Learn the limits as well as the checks." : "Define scope before the inspection begins."}</strong>
                <p>{isGuide ? "Use the guide to ask better questions and identify when more evidence is needed." : "Access, test conditions and available evidence shape what an inspection can establish."}</p>
              </aside>
            </div>
          </div>
          <div className={"marketing-page-hero-photo" + (content.slug === "masterclass" ? " marketing-masterclass-banner" : "")} data-gsap-page-expand>
            <img src={heroImage} alt={pageHero.alt} fetchPriority="high" />
            {content.slug !== "masterclass" && <div className="marketing-page-photo-label"><span>{heroImageLabel}</span><b>{content.title}</b></div>}
          </div>
        </section>

        {isMasterclass && <section className="marketing-main-section" aria-labelledby="masterclass-schedule-heading">
          <div className="site-container-v2">
            <div className="marketing-section-heading" data-gsap-reveal><h2 id="masterclass-schedule-heading">The six-day learning path</h2><p>Confirm actual batch dates, fees, venue, equipment and delivery details before enrolling.</p></div>
            <div className="masterclass-schedule-grid">
              {trainingDays.map((day, index) => <article key={day[0]} className="masterclass-schedule-card site-spotlight" data-reveal data-reveal-delay={index * 55}><span>{day[0]}</span><div><h3>{day[1]}</h3><p>{day[2]}</p></div></article>)}
            </div>
          </div>
        </section>}

        <section className="marketing-main-section" aria-labelledby="overview-heading">
          <div className="site-container-v2 marketing-two-col">
            <article className="marketing-copy" data-gsap-reveal>
              <p className="eyebrow"><span className="eyebrow-live-dot" /> {isGuide ? "UNDERSTAND THE DETAILS" : "PURPOSE AND SCOPE"}</p>
              <h2 id="overview-heading">{isGuide ? "What to look for and what it means" : "What this inspection covers"}</h2>
              <p>{content.overview}</p>
              <p>{isGuide ? "When evidence is incomplete, record the question that remains rather than treating an untested item as clear. Seek a qualified or authorised specialist for safety-critical, legal or technical matters beyond the agreed scope." : "The most useful inspection record distinguishes what was directly observed from what is suspected, and highlights items that need confirmation. Availability, price and specific deliverables are confirmed before the booking is final."}</p>
              <Link href={(isGuide ? (content.primaryHref || "/services") : "/book-inspection") as any} className="text-link-v2">{isGuide ? "Explore the relevant service" : "Discuss this service"} <ArrowRight size={14} /></Link>
            </article>
            <aside className="marketing-check-panel site-spotlight" data-gsap-reveal>
              <h3>{isGuide ? "Checklist to keep in mind" : "What a structured review may cover"}</h3>
              <ul className="marketing-check-list">
                {content.checks.map((check, index) => <li key={check}><span>{String(index + 1).padStart(2, "0")}</span><div>{check}</div></li>)}
              </ul>
            </aside>
          </div>
        </section>

        <section className="marketing-faq-section" aria-labelledby="common-questions-heading">
          <div className="site-container-v2 marketing-faq-shell">
            <div data-reveal><p className="eyebrow"><span className="eyebrow-live-dot" /> CLARITY BEFORE ACTION</p><h2 id="common-questions-heading">Before you book<br /><span>know the scope.</span></h2><p>Scope, limitations and next steps should be plain before anyone relies on an inspection result.</p></div>
            <div className="faq-list-v2">
              {content.faqs.map((faq, index) => <details key={faq.question} className="faq-item-v2" data-reveal data-reveal-delay={index * 55}><summary><span>{faq.question}</span><i /></summary><div className="faq-answer-v2"><p>{faq.answer}</p></div></details>)}
            </div>
          </div>
        </section>

        {nearby.length > 0 && <section className="marketing-main-section marketing-related-section">
          <div className="site-container-v2">
            <div className="marketing-section-heading" data-reveal><h2>{isGuide ? "Related learning guides" : "Other ways we can help"}</h2><p>{isGuide ? "Continue learning with closely related topics." : "Explore related inspection services and reporting options."}</p></div>
            <div className="related-card-grid">
              {nearby.map((page, index) => <Link key={page.slug} href={((isGuide ? "/guides/" : "/services/") + page.slug) as any} className="related-card" data-reveal data-reveal-delay={index * 55}><span>{isGuide ? "LEARNING GUIDE" : "INSPECTION SERVICE"}</span><h3>{page.title}</h3><p>{page.tagline}</p><ArrowRight size={16} /></Link>)}
            </div>
          </div>
        </section>}

        <section className="marketing-page-bottom-cta">
          <div className="site-container-v2 marketing-page-bottom-cta-inner" data-reveal>
            <div><h2>{isGuide ? "Turn a better question into a clearer inspection." : isMasterclass ? "Ready to learn the method?" : "Choose the inspection that fits your vehicle."}</h2><p>{isGuide ? "Choose the service that fits your vehicle and situation. Confirm the scope before you book." : isMasterclass ? "Send a request for the current batch details, then confirm all terms directly before enrolling." : "Share the vehicle and your goal. The team can discuss availability, access and the agreed deliverables."}</p></div>
            <Link href={(content.primaryHref || "/book-inspection") as any} className="site-button-v2 button-bright">{content.primaryLabel || "Request an inspection"} <ArrowRight size={15} /></Link>
          </div>
        </section>
      </main>
      {isMasterclass && <CoachingInquiryForm />}
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, CheckCircle2, Clock3, Gauge, GraduationCap, Menu, ShieldCheck, Wrench, X } from "lucide-react";

const heroLines = [
  { top: "Inspect before", accent: "you buy." },
  { top: "Learn the craft.", accent: "Build a career." },
  { top: "Real cars.", accent: "Real skills." }
];

const services = [
  { number: "01", title: "Used-car inspection", text: "Get an evidence-led picture of a pre-owned car before making a decision.", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=85", tag: "BUY WITH CLARITY" },
  { number: "02", title: "New-car PDI", text: "Check delivery condition, visible fit and finish, documents and handover details.", image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=85", tag: "BEFORE DELIVERY" },
  { number: "03", title: "Diagnostics & reports", text: "Document observations clearly, organise evidence and explain the next step.", image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=85", tag: "EVIDENCE FIRST" }
];

const curriculum = [
  { day: "01", title: "Know the vehicle", detail: "Inspection workflow, vehicle identification, customer expectations and safety around a vehicle." },
  { day: "02", title: "Body, paint & exterior", detail: "Panel gaps, paint, glass, lights, tyres, wheels and signs that deserve a closer look." },
  { day: "03", title: "Under the bonnet", detail: "Engine bay fundamentals, fluid checks, visible leaks, cooling, belts and mechanical observations." },
  { day: "04", title: "Cabin, electrical & OBD", detail: "Interior controls, warning lamps, basic electrical checks and diagnostic-code basics." },
  { day: "05", title: "Road test & reporting", detail: "Structured road-test observations, photo evidence, severity notes, scoring and clear report writing." },
  { day: "06", title: "Supervised live inspection", detail: "Run a guided checklist on a real vehicle, review findings with the trainer and practise a customer handover." }
];

export function PublicLanding() {
  const [activeLine, setActiveLine] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setActiveLine((value) => (value + 1) % heroLines.length), 3800);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll(".site-reveal"));
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const line = heroLines[activeLine];

  return (
    <div className="public-site">
      <header className="site-header">
        <a className="site-brand" href="/" aria-label="OM Car Inspection home">
          <span className="brand-symbol">OM<span>.</span></span>
          <span className="brand-copy"><b>OM CAR INSPECTION</b><small>INSPECT · LEARN · BUILD</small></span>
        </a>
        <nav className={menuOpen ? "site-nav is-open" : "site-nav"}>
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#masterclass" onClick={() => setMenuOpen(false)}>Masterclass</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#videos" onClick={() => setMenuOpen(false)}>Videos</a>
          <a className="nav-cta" href="/book-inspection">Book an inspection <ArrowRight size={15} /></a>
        </nav>
        <button className="site-menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <main>
        <section className="site-hero">
          <div className="hero-image" role="img" aria-label="Technician inspecting a vehicle in a workshop" />
          <div className="hero-shade" />
          <div className="hero-inner site-container">
            <div className="hero-copy">
              <p className="site-eyebrow light"><span className="eyebrow-dot" /> VEHICLE INSPECTION · PRACTICAL TRAINING</p>
              <h1 className="hero-title" aria-live="polite">
                <span key={line.top} className="hero-line">{line.top}</span>
                <span key={line.accent} className="hero-accent hero-line">{line.accent}</span>
              </h1>
              <p className="hero-description">Professional car inspections for people who want clarity, and hands-on training for people who want to learn the work properly.</p>
              <div className="hero-actions">
                <a className="site-button primary" href="/book-inspection">Book car inspection <ArrowRight size={16} /></a>
                <a className="site-button outline" href="/book-masterclass">Join the 6-day masterclass <ArrowRight size={16} /></a>
              </div>
              <div className="hero-proof">
                <span><CheckCircle2 size={15} /> Hands-on vehicle learning</span>
                <span><CheckCircle2 size={15} /> Structured reports</span>
                <span><CheckCircle2 size={15} /> Beginner-friendly format</span>
              </div>
            </div>
            <div className="hero-stamp"><span className="stamp-number">06</span><span className="stamp-label">DAY PRACTICAL<br />MASTERCLASS</span><ArrowDown size={16} /></div>
          </div>
          <a className="hero-scroll" href="#services"><span>SCROLL TO EXPLORE</span><ArrowDown size={15} /></a>
        </section>

        <div className="site-marquee" aria-label="Real vehicles, real skills, inspection with confidence">
          <div className="marquee-track"><span>REAL VEHICLES</span><i>✳</i><span>REAL PARTS</span><i>✳</i><span>FIELD-READY SKILLS</span><i>✳</i><span>INSPECT WITH CONFIDENCE</span><i>✳</i><span>REAL VEHICLES</span><i>✳</i><span>REAL PARTS</span><i>✳</i><span>FIELD-READY SKILLS</span><i>✳</i></div>
        </div>

        <section className="site-section services-section" id="services">
          <div className="site-container">
            <div className="section-heading site-reveal">
              <div><p className="site-eyebrow"><span className="eyebrow-dot" /> WHAT WE DO</p><h2>More confidence.<br /><span>Fewer surprises.</span></h2></div>
              <p className="section-intro">Whether you are buying a car or learning how to inspect one, start with a process that values evidence over guesswork.</p>
            </div>
            <div className="service-grid">
              {services.map((service) => (
                <article className="service-card site-reveal" key={service.number}>
                  <a className="service-photo" href="/book-inspection"><img src={service.image} alt="" loading="lazy" /><span className="service-number">{service.number}</span><span className="service-photo-arrow"><ArrowRight size={18} /></span></a>
                  <div className="service-card-copy"><p className="service-tag">{service.tag}</p><h3>{service.title}</h3><p>{service.text}</p><a className="text-link" href="/book-inspection">Explore service <ArrowRight size={15} /></a></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="site-section dark-section training-section" id="masterclass">
          <div className="site-container">
            <div className="training-top site-reveal">
              <div><p className="site-eyebrow light"><span className="eyebrow-dot" /> LEARN BY DOING</p><h2>Six days.<br /><span>Real inspection skills.</span></h2></div>
              <div className="training-summary"><p>This is practical training, not six days of slides. Learn the inspection sequence, work around real vehicle parts, document what you observe and practise explaining your findings.</p><a className="site-button primary" href="/book-masterclass">Reserve a masterclass slot <ArrowRight size={16} /></a></div>
            </div>
            <div className="training-layout">
              <div className="training-photo site-reveal"><img src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1400&q=85" alt="Vehicle technician working in a workshop" loading="lazy" /><div className="photo-caption"><Wrench size={17} /><span>LEARN ON REAL VEHICLES</span></div></div>
              <div className="curriculum-list">
                {curriculum.map((item) => <article className="curriculum-item site-reveal" key={item.day}><span className="curriculum-day">DAY {item.day}</span><div><h3>{item.title}</h3><p>{item.detail}</p></div><ArrowRight size={16} /></article>)}
                <div className="earning-note"><span className="note-mark">↗</span><p><b>Build toward earning opportunities.</b> The advertised “up to 5×” earning potential is a target, not a guarantee. Actual income depends on skill, customer demand, pricing and consistent work.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="site-section process-section" id="how-it-works">
          <div className="site-container">
            <div className="section-heading site-reveal">
              <div><p className="site-eyebrow"><span className="eyebrow-dot" /> SIMPLE BY DESIGN</p><h2>From request<br /><span>to clear next steps.</span></h2></div>
              <p className="section-intro">A good inspection follows a repeatable method. The booking starts the conversation; the evidence and report help you decide what to do next.</p>
            </div>
            <div className="process-grid">
              <article className="process-card site-reveal"><span>01</span><div className="process-icon"><Clock3 /></div><h3>Tell us what you need</h3><p>Choose the type of vehicle inspection or training batch you are interested in.</p></article>
              <article className="process-card site-reveal"><span>02</span><div className="process-icon"><Gauge /></div><h3>Confirm the details</h3><p>Share the vehicle, location or preferred training slot so the team can follow up.</p></article>
              <article className="process-card site-reveal"><span>03</span><div className="process-icon"><ShieldCheck /></div><h3>Inspect with a method</h3><p>Follow a structured checklist, capture relevant evidence and communicate findings clearly.</p></article>
              <article className="process-card site-reveal"><span>04</span><div className="process-icon"><CheckCircle2 /></div><h3>Make an informed decision</h3><p>Use the inspection observations and report as practical input for your next step.</p></article>
            </div>
          </div>
        </section>

        <section className="site-section video-section" id="videos">
          <div className="site-container">
            <div className="section-heading site-reveal">
              <div><p className="site-eyebrow"><span className="eyebrow-dot" /> WATCH & LEARN</p><h2>See the process.<br /><span>Then practise it.</span></h2></div>
              <p className="section-intro">Use these public educational videos as an introduction. The six-day course adds guided hands-on practice beyond watching a screen.</p>
            </div>
            <div className="video-grid">
              <article className="video-card site-reveal"><a href="https://www.youtube.com/watch?v=A0o9LqfLTVM" target="_blank" rel="noreferrer" className="video-thumb"><img src="https://img.youtube.com/vi/A0o9LqfLTVM/hqdefault.jpg" alt="New-car PDI inspection video thumbnail" loading="lazy" /><span className="play-button">▶</span></a><div><p className="service-tag">NEW-CAR PDI</p><h3>Before you accept delivery</h3><a className="text-link" href="https://www.youtube.com/watch?v=A0o9LqfLTVM" target="_blank" rel="noreferrer">Watch on YouTube <ArrowRight size={15} /></a></div></article>
              <article className="video-card site-reveal"><a href="https://www.youtube.com/watch?v=J06FAAbmcNs" target="_blank" rel="noreferrer" className="video-thumb"><img src="https://img.youtube.com/vi/J06FAAbmcNs/hqdefault.jpg" alt="Vehicle inspection educational video thumbnail" loading="lazy" /><span className="play-button">▶</span></a><div><p className="service-tag">PRACTICAL CHECKS</p><h3>Build your inspection mindset</h3><a className="text-link" href="https://www.youtube.com/watch?v=J06FAAbmcNs" target="_blank" rel="noreferrer">Watch on YouTube <ArrowRight size={15} /></a></div></article>
            </div>
          </div>
        </section>

        <section className="site-cta-section"><div className="site-container cta-inner site-reveal"><div><p className="site-eyebrow light"><span className="eyebrow-dot" /> READY TO START?</p><h2>Book an inspection.<br /><span>Or learn to do one.</span></h2><p>Choose the next step that fits you. We will collect your details and follow up to confirm the request.</p></div><div className="cta-actions"><a className="site-button primary" href="/book-inspection">Book car inspection <ArrowRight size={16} /></a><a className="site-button outline" href="/book-masterclass">Book a masterclass slot <ArrowRight size={16} /></a></div></div></section>
      </main>

      <footer className="site-footer">
        <div className="site-container footer-main">
          <div><a className="site-brand footer-brand" href="/"><span className="brand-symbol">OM<span>.</span></span><span className="brand-copy"><b>OM CAR INSPECTION</b><small>INSPECT · LEARN · BUILD</small></span></a><p className="footer-blurb">Practical vehicle inspection services and hands-on learning to help people make better decisions around cars.</p></div>
          <div><p className="footer-label">EXPLORE</p><a href="#services">Inspection services</a><a href="#masterclass">Six-day masterclass</a><a href="#videos">Learning videos</a></div>
          <div><p className="footer-label">GET STARTED</p><a href="/book-inspection">Book an inspection</a><a href="/book-masterclass">Reserve a training slot</a><a href="/admin">Admin mock preview</a></div>
        </div>
        <div className="site-container footer-bottom"><span>© {new Date().getFullYear()} OM Car Inspection</span><span>Evidence first. Decisions clearer.</span></div>
      </footer>
      <style jsx global>{`
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Hanken+Grotesk:wght@400;500;600;700&display=swap');
:root { scroll-behavior:smooth; }
.public-site { --site-ink:#16171a; --site-paper:#f6f3ee; --site-bone:#ede8df; --site-line:#ddd7cc; --site-steel:#6b6f76; --site-rose:#e11d48; --site-rose-dark:#be123c; background:var(--site-paper); color:var(--site-ink); min-height:100vh; font-family:'Hanken Grotesk',Arial,sans-serif; -webkit-font-smoothing:antialiased; overflow:hidden; }
.public-site * { box-sizing:border-box; }
.public-site a { color:inherit; text-decoration:none; }
.public-site button { font:inherit; }
.public-site img { display:block; max-width:100%; }
.site-container { width:min(1280px,100%); margin:0 auto; padding-left:clamp(20px,4vw,62px); padding-right:clamp(20px,4vw,62px); }
.site-header { position:sticky; top:0; z-index:50; min-height:78px; background:rgba(246,243,238,.94); backdrop-filter:blur(18px); border-bottom:1px solid rgba(22,23,26,.09); display:flex; align-items:center; justify-content:space-between; gap:24px; padding:14px clamp(20px,4vw,62px); }
.site-brand { display:flex; align-items:center; gap:11px; flex-shrink:0; }
.brand-symbol { font-family:'Barlow Condensed',Impact,sans-serif; font-size:38px; font-weight:800; line-height:.8; letter-spacing:-.06em; }
.brand-symbol span { color:var(--site-rose); }
.brand-copy { display:flex; flex-direction:column; gap:4px; }
.brand-copy b { font-family:'Barlow Condensed',Impact,sans-serif; font-size:16px; letter-spacing:.07em; }
.brand-copy small { font-size:9px; font-weight:700; letter-spacing:.17em; color:var(--site-steel); }
.site-nav { display:flex; align-items:center; gap:clamp(16px,2.2vw,32px); }
.site-nav > a:not(.nav-cta) { font-size:12px; font-weight:600; transition:color .2s ease; }
.site-nav > a:not(.nav-cta):hover { color:var(--site-rose); }
.nav-cta { display:flex; align-items:center; gap:10px; padding:13px 17px; background:var(--site-ink); color:white!important; font-size:12px; font-weight:700; transition:background .25s,transform .25s; }
.nav-cta:hover { background:var(--site-rose); transform:translateY(-2px); }
.site-menu-toggle { display:none; border:1px solid var(--site-line); width:42px; height:42px; background:transparent; align-items:center; justify-content:center; color:var(--site-ink); }
.site-hero { min-height:690px; position:relative; background:#16171a; color:#fff; display:flex; align-items:center; isolation:isolate; }
.hero-image { position:absolute; inset:0; z-index:-2; background-image:url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=2000&q=90'); background-size:cover; background-position:center 54%; transform:scale(1.015); animation:siteHeroImageIn 1.2s ease-out both; }
.hero-shade { position:absolute; z-index:-1; inset:0; background:linear-gradient(90deg,rgba(13,14,16,.96) 0%,rgba(13,14,16,.84) 44%,rgba(13,14,16,.40) 100%),linear-gradient(0deg,rgba(13,14,16,.6),transparent 45%); }
.hero-inner { display:flex; align-items:center; justify-content:space-between; gap:50px; padding-top:90px; padding-bottom:115px; }
.hero-copy { max-width:800px; }
.site-eyebrow { display:flex; align-items:center; gap:9px; margin:0 0 19px; color:var(--site-steel); font-size:11px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; }
.site-eyebrow.light { color:rgba(255,255,255,.72); }
.eyebrow-dot { width:7px; height:7px; border-radius:50%; background:var(--site-rose); box-shadow:0 0 0 4px rgba(225,29,72,.13); flex:0 0 auto; }
.hero-title { display:flex; flex-direction:column; margin:0; font-family:'Barlow Condensed',Impact,sans-serif; font-size:clamp(66px,9.1vw,134px); font-weight:700; line-height:.82; letter-spacing:-.035em; text-transform:uppercase; }
.hero-line { display:block; animation:siteWordIn .55s cubic-bezier(.2,.75,.25,1) both; }
.hero-accent { color:var(--site-rose); margin-top:12px; }
.hero-description { max-width:560px; margin:29px 0 0; color:rgba(255,255,255,.76); font-size:16px; line-height:1.75; }
.hero-actions { display:flex; flex-wrap:wrap; gap:11px; margin-top:30px; }
.site-button { display:inline-flex; align-items:center; justify-content:center; gap:10px; min-height:50px; padding:0 19px; font-size:12px; font-weight:700; transition:transform .22s,background .22s,border-color .22s; border:1px solid transparent; }
.site-button:hover { transform:translateY(-3px); }
.site-button.primary { background:var(--site-rose); color:#fff; border-color:var(--site-rose); }
.site-button.primary:hover { background:var(--site-rose-dark); border-color:var(--site-rose-dark); }
.site-button.outline { color:#fff; border-color:rgba(255,255,255,.34); background:rgba(255,255,255,.04); }
.site-button.outline:hover { border-color:#fff; background:rgba(255,255,255,.1); }
.hero-proof { display:flex; flex-wrap:wrap; gap:16px 22px; margin-top:28px; color:rgba(255,255,255,.68); font-size:11px; }
.hero-proof span { display:flex; align-items:center; gap:7px; }
.hero-proof svg { color:#fda4af; }
.hero-stamp { display:flex; flex-direction:column; align-items:flex-start; min-width:146px; padding:24px 20px 20px; margin-top:200px; border-left:1px solid rgba(255,255,255,.42); border-top:1px solid rgba(255,255,255,.24); background:rgba(20,20,21,.3); backdrop-filter:blur(5px); }
.stamp-number { font-family:'Barlow Condensed',Impact,sans-serif; font-size:76px; font-weight:700; line-height:.85; color:var(--site-rose); }
.stamp-label { margin-top:13px; font-size:10px; line-height:1.5; font-weight:700; letter-spacing:.13em; }
.hero-stamp svg { margin-top:22px; }
.hero-scroll { position:absolute; bottom:25px; left:clamp(20px,4vw,62px); display:flex; align-items:center; gap:12px; color:rgba(255,255,255,.62)!important; font-size:9px; letter-spacing:.17em; }
.hero-scroll svg { color:var(--site-rose); }
.site-marquee { overflow:hidden; background:var(--site-rose); color:#fff; white-space:nowrap; }
.marquee-track { display:flex; justify-content:space-around; align-items:center; gap:31px; min-width:max-content; padding:17px 0; animation:siteMarquee 34s linear infinite; font-family:'Barlow Condensed',Impact,sans-serif; font-size:19px; font-weight:700; letter-spacing:.09em; }
.marquee-track i { font-style:normal; font-size:17px; color:#fecdd3; }
.site-section { padding:clamp(76px,10vw,138px) 0; }
.section-heading { display:flex; justify-content:space-between; align-items:flex-end; gap:40px; margin-bottom:51px; }
.section-heading h2,.training-top h2,.cta-inner h2 { margin:0; font-family:'Barlow Condensed',Impact,sans-serif; font-size:clamp(48px,6.2vw,80px); font-weight:700; line-height:.9; letter-spacing:-.025em; text-transform:uppercase; }
.section-heading h2 span,.training-top h2 span { color:var(--site-rose); }
.section-intro { max-width:405px; margin:0 0 4px; color:#666b72; font-size:14px; line-height:1.8; }
.service-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:22px; }
.service-card { background:#fff; border:1px solid rgba(22,23,26,.08); min-width:0; }
.service-photo { display:block; position:relative; height:clamp(210px,23vw,310px); overflow:hidden; background:#d4d0ca; }
.service-photo img { width:100%; height:100%; object-fit:cover; filter:saturate(.83); transition:transform .6s cubic-bezier(.2,.6,.25,1),filter .5s; }
.service-card:hover .service-photo img { transform:scale(1.055); filter:saturate(1.05); }
.service-number { position:absolute; top:15px; left:16px; width:39px; height:39px; display:grid; place-items:center; background:var(--site-paper); font-family:'Barlow Condensed',Impact,sans-serif; font-size:19px; font-weight:700; }
.service-photo-arrow { position:absolute; bottom:0; right:0; display:grid; place-items:center; width:48px; height:48px; background:var(--site-rose); color:#fff; transition:width .25s; }
.service-card:hover .service-photo-arrow { width:59px; }
.service-card-copy { padding:25px 25px 29px; }
.service-tag,.footer-label { margin:0 0 10px; font-size:9px; font-weight:700; letter-spacing:.15em; color:var(--site-rose); }
.service-card h3,.video-card h3 { margin:0; font-family:'Barlow Condensed',Impact,sans-serif; font-size:29px; font-weight:700; line-height:1.05; text-transform:uppercase; }
.service-card-copy > p:not(.service-tag) { min-height:63px; margin:15px 0 22px; font-size:13px; line-height:1.7; color:#72767c; }
.text-link { display:inline-flex; align-items:center; gap:9px; padding-bottom:5px; border-bottom:1px solid var(--site-line); font-size:11px; font-weight:700; transition:gap .2s,color .2s,border-color .2s; }
.text-link:hover { gap:14px; color:var(--site-rose); border-color:var(--site-rose); }
.dark-section { background:var(--site-ink); color:#fff; }
.training-section { position:relative; overflow:hidden; }
.training-section:before { content:""; position:absolute; width:600px; height:600px; border:1px solid rgba(255,255,255,.07); border-radius:50%; right:-250px; top:-80px; pointer-events:none; }
.training-top { display:flex; align-items:flex-end; justify-content:space-between; gap:42px; margin-bottom:54px; position:relative; }
.training-top .site-eyebrow { margin-bottom:21px; }
.training-top h2 span { color:#fb7185; }
.training-summary { max-width:422px; }
.training-summary p { margin:0 0 22px; color:rgba(255,255,255,.68); font-size:14px; line-height:1.85; }
.training-layout { position:relative; display:grid; grid-template-columns:minmax(0,.93fr) minmax(0,1.07fr); gap:clamp(27px,5vw,70px); align-items:start; }
.training-photo { position:relative; min-height:540px; overflow:hidden; background:#303136; }
.training-photo img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.training-photo:after { content:""; position:absolute; inset:35% 0 0; background:linear-gradient(transparent,rgba(12,13,15,.72)); }
.photo-caption { position:absolute; z-index:1; bottom:23px; left:22px; display:flex; align-items:center; gap:10px; font-size:10px; letter-spacing:.14em; font-weight:700; }
.photo-caption svg { color:#fb7185; }
.curriculum-list { border-top:1px solid rgba(255,255,255,.18); }
.curriculum-item { display:grid; grid-template-columns:63px minmax(0,1fr) 18px; gap:14px; padding:21px 0; border-bottom:1px solid rgba(255,255,255,.15); align-items:start; }
.curriculum-day { padding-top:4px; font-family:'Barlow Condensed',Impact,sans-serif; font-size:18px; font-weight:700; color:#fb7185; letter-spacing:.04em; }
.curriculum-item h3 { margin:0 0 7px; font-family:'Barlow Condensed',Impact,sans-serif; font-size:25px; line-height:1; text-transform:uppercase; }
.curriculum-item p { margin:0; max-width:525px; color:rgba(255,255,255,.58); font-size:12px; line-height:1.7; }
.curriculum-item > svg { margin-top:3px; color:rgba(255,255,255,.38); transition:transform .2s,color .2s; }
.curriculum-item:hover > svg { transform:translateX(4px); color:#fb7185; }
.earning-note { display:flex; gap:13px; margin-top:23px; padding:17px; background:rgba(255,255,255,.055); border:1px solid rgba(255,255,255,.12); }
.note-mark { flex:0 0 auto; color:#fb7185; font-size:20px; }
.earning-note p { margin:0; color:rgba(255,255,255,.6); font-size:11px; line-height:1.7; }
.earning-note b { color:#fff; }
.process-section { background:var(--site-bone); }
.process-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:1px; background:var(--site-line); border:1px solid var(--site-line); }
.process-card { position:relative; background:var(--site-bone); padding:28px 25px 32px; min-height:265px; transition:background .25s; }
.process-card:hover { background:#f9f6f1; }
.process-card > span { position:absolute; right:21px; top:18px; font-family:'Barlow Condensed',Impact,sans-serif; color:#b6b0a7; font-size:19px; font-weight:700; }
.process-icon { display:grid; place-items:center; width:49px; height:49px; margin:19px 0 25px; color:var(--site-rose); border:1px solid rgba(225,29,72,.25); }
.process-icon svg { width:21px; height:21px; }
.process-card h3 { max-width:190px; margin:0; font-family:'Barlow Condensed',Impact,sans-serif; text-transform:uppercase; font-size:25px; line-height:1.03; }
.process-card p { margin:13px 0 0; color:#70747a; font-size:12px; line-height:1.75; }
.video-section { background:var(--site-paper); }
.video-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:22px; }
.video-card { display:grid; grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr); border:1px solid var(--site-line); background:#fff; }
.video-thumb { position:relative; min-height:220px; background:#292a2c; overflow:hidden; }
.video-thumb img { width:100%; height:100%; position:absolute; inset:0; object-fit:cover; transition:transform .45s; }
.video-thumb:hover img { transform:scale(1.05); }
.play-button { display:grid; place-items:center; position:absolute; width:48px; height:48px; border:1px solid rgba(255,255,255,.7); border-radius:50%; left:50%; top:50%; transform:translate(-50%,-50%); background:rgba(225,29,72,.92); color:#fff; font-size:15px; padding-left:3px; }
.video-card > div { padding:25px 21px; align-self:center; }
.video-card h3 { margin-bottom:20px; font-size:27px; }
.site-cta-section { position:relative; overflow:hidden; padding:clamp(76px,9vw,118px) 0; background:var(--site-rose); color:#fff; }
.site-cta-section:after { content:"OM"; position:absolute; right:-10px; bottom:-112px; font-family:'Barlow Condensed',Impact,sans-serif; font-size:clamp(240px,34vw,470px); line-height:.85; font-weight:800; letter-spacing:-.07em; color:rgba(255,255,255,.06); pointer-events:none; }
.cta-inner { position:relative; z-index:1; display:flex; justify-content:space-between; align-items:center; gap:40px; }
.cta-inner .site-eyebrow { color:rgba(255,255,255,.72); }
.cta-inner h2 { font-size:clamp(48px,6.2vw,80px); }
.cta-inner h2 span { color:#fecdd3; }
.cta-inner > div:first-child > p:last-child { max-width:510px; margin:22px 0 0; color:rgba(255,255,255,.76); font-size:13px; line-height:1.8; }
.cta-actions { display:flex; flex-direction:column; gap:11px; width:min(285px,100%); }
.cta-actions .site-button.primary { background:#16171a; border-color:#16171a; }
.cta-actions .site-button.primary:hover { background:#2d2d2d; border-color:#2d2d2d; }
.cta-actions .site-button.outline { justify-content:space-between; }
.site-footer { background:#111214; color:#fff; }
.footer-main { display:grid; grid-template-columns:1.45fr .75fr .8fr; gap:65px; padding-top:57px; padding-bottom:54px; }
.footer-brand .brand-copy b { color:#fff; }
.footer-blurb { max-width:340px; margin:21px 0 0; color:rgba(255,255,255,.48); font-size:12px; line-height:1.8; }
.footer-label { margin:0 0 17px; color:#fb7185; }
.footer-main > div:not(:first-child) { display:flex; flex-direction:column; align-items:flex-start; gap:11px; }
.footer-main > div:not(:first-child) a { color:rgba(255,255,255,.68); font-size:12px; transition:color .2s; }
.footer-main > div:not(:first-child) a:hover { color:#fb7185; }
.footer-bottom { display:flex; justify-content:space-between; gap:20px; border-top:1px solid rgba(255,255,255,.1); padding-top:18px; padding-bottom:20px; color:rgba(255,255,255,.4); font-size:10px; }
.site-reveal { opacity:0; transform:translateY(18px); transition:opacity .7s ease,transform .7s cubic-bezier(.2,.65,.25,1); }
.site-reveal.is-visible { opacity:1; transform:translateY(0); }
@keyframes siteWordIn { from { opacity:0; transform:translateY(18px); filter:blur(5px); } to { opacity:1; transform:translateY(0); filter:blur(0); } }
@keyframes siteHeroImageIn { from { opacity:.55; transform:scale(1.07); } to { opacity:1; transform:scale(1.015); } }
@keyframes siteMarquee { from { transform:translateX(0); } to { transform:translateX(-35%); } }
@media (prefers-reduced-motion:reduce) { .public-site *, .public-site *:before, .public-site *:after { animation-duration:.01ms!important; animation-iteration-count:1!important; scroll-behavior:auto!important; transition-duration:.01ms!important; } .site-reveal { opacity:1; transform:none; } }
@media (max-width:1020px) { .site-nav { gap:15px; } .site-nav > a:not(.nav-cta) { font-size:11px; } .hero-stamp { min-width:124px; padding:17px 14px; } .stamp-number { font-size:61px; } .training-photo { min-height:490px; } .service-card-copy { padding:22px 18px 25px; } .process-card { padding:24px 17px 26px; } .footer-main { gap:36px; } }
@media (max-width:780px) { .site-header { min-height:68px; padding-top:11px; padding-bottom:11px; } .brand-symbol { font-size:34px; } .brand-copy b { font-size:14px; } .site-menu-toggle { display:flex; } .site-nav { display:none; position:absolute; left:0; right:0; top:100%; flex-direction:column; align-items:stretch; gap:0; padding:8px 20px 19px; background:var(--site-paper); border-bottom:1px solid var(--site-line); box-shadow:0 16px 25px rgba(0,0,0,.08); } .site-nav.is-open { display:flex; } .site-nav > a:not(.nav-cta) { padding:14px 4px; border-bottom:1px solid var(--site-line); font-size:13px; } .nav-cta { justify-content:center; margin-top:13px; } .site-hero { min-height:720px; } .hero-inner { display:block; padding-top:72px; padding-bottom:98px; } .hero-title { font-size:clamp(63px,13vw,100px); } .hero-description { max-width:540px; font-size:14px; } .hero-proof { max-width:430px; gap:12px 16px; } .hero-stamp { position:absolute; right:20px; bottom:58px; margin:0; min-width:104px; padding:13px; } .stamp-number { font-size:52px; } .stamp-label { font-size:8px; } .hero-scroll { bottom:20px; } .section-heading,.training-top,.cta-inner { display:block; } .section-intro { margin-top:23px; } .service-grid { grid-template-columns:1fr; gap:18px; } .service-photo { height:270px; } .service-card-copy > p:not(.service-tag) { min-height:0; } .training-summary { margin-top:24px; } .training-layout { grid-template-columns:1fr; } .training-photo { min-height:390px; } .process-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } .process-card { min-height:245px; } .video-grid { grid-template-columns:1fr; } .cta-actions { width:100%; max-width:390px; margin-top:30px; } .footer-main { grid-template-columns:1fr 1fr; gap:35px 25px; } .footer-main > div:first-child { grid-column:1/-1; } }
@media (max-width:480px) { .site-container { padding-left:20px; padding-right:20px; } .site-hero { min-height:760px; } .hero-shade { background:linear-gradient(90deg,rgba(13,14,16,.94),rgba(13,14,16,.66)),linear-gradient(0deg,rgba(13,14,16,.7),transparent 65%); } .hero-inner { padding-top:64px; } .hero-title { font-size:clamp(57px,13.3vw,72px); } .hero-actions { flex-direction:column; align-items:stretch; max-width:360px; } .hero-proof { display:grid; grid-template-columns:1fr 1fr; font-size:10px; } .hero-stamp { right:20px; bottom:52px; } .section-heading h2,.training-top h2,.cta-inner h2 { font-size:clamp(46px,13vw,63px); } .site-eyebrow { font-size:9px; } .site-section { padding:75px 0; } .section-heading { margin-bottom:35px; } .service-photo { height:230px; } .curriculum-item { grid-template-columns:49px minmax(0,1fr) 14px; gap:9px; padding:18px 0; } .curriculum-day { font-size:15px; } .curriculum-item h3 { font-size:22px; } .curriculum-item p { font-size:11px; } .training-photo { min-height:315px; } .process-grid { grid-template-columns:1fr 1fr; } .process-card { padding:18px 13px 20px; min-height:244px; } .process-card h3 { font-size:21px; } .process-card p { font-size:11px; } .process-icon { width:42px; height:42px; margin:18px 0 22px; } .video-card { grid-template-columns:1fr; } .video-thumb { min-height:195px; } .video-card > div { padding:22px; } .footer-main { grid-template-columns:1fr 1fr; gap:30px 16px; } .footer-main > div:not(:first-child) a { font-size:11px; } .footer-bottom { flex-direction:column; gap:8px; } }
`}</style>
    </div>
  );
}

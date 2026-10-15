"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, GraduationCap, ShieldCheck } from "lucide-react";

type BookingPageProps = { type: "inspection" | "masterclass" };

export function BookingPage({ type }: BookingPageProps) {
  const isClass = type === "masterclass";
  const [sent, setSent] = useState(false);

  function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Array.from(form.entries()).map(([key, value]) => key + ": " + String(value));
    const heading = isClass ? "6-Day Car Inspection Masterclass Request" : "Car Inspection Booking Request";
    const message = heading + "\n\n" + values.join("\n") + "\n\nPlease contact me to confirm availability and next steps.";
    window.open("https://wa.me/919663120429?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <main className="booking-page">
      <header className="booking-header"><a href="/" className="booking-brand"><span>OM<span className="red">.</span></span><b>OM CAR INSPECTION<small>INSPECT · LEARN · BUILD</small></b></a><a href="/" className="back-link"><ArrowLeft size={15}/> Back to website</a></header>
      <div className="booking-shell">
        <div className="booking-intro">
          <p className="booking-eyebrow"><span /> {isClass ? "PRACTICAL TRAINING" : "VEHICLE SERVICES"}</p>
          <h1>{isClass ? <>Learn to inspect.<br /><span>Build real skill.</span></> : <>Book an inspection.<br /><span>Decide with clarity.</span></>}</h1>
          <p>{isClass ? "Request a place in the six-day hands-on masterclass. Share your preferred batch details and the team will get in touch to discuss availability, venue and fees." : "Tell us about the vehicle and the inspection you need. The team will contact you to confirm availability, location, scope and pricing."}</p>
          <div className="booking-benefits">
            <div><span><CheckCircle2 size={17}/></span><div><b>{isClass ? "Real-vehicle practice" : "Structured inspection"}</b><small>{isClass ? "Guided exercises across six days" : "Visible checks and documented observations"}</small></div></div>
            <div><span><Clock3 size={17}/></span><div><b>Request first, confirmation next</b><small>This form does not automatically reserve a slot.</small></div></div>
            {isClass && <div><span><GraduationCap size={17}/></span><div><b>Training from fundamentals</b><small>Designed for learners and career changers.</small></div></div>}
          </div>
          {isClass && <div className="earn-disclaimer"><ShieldCheck size={18}/><p>The “up to 5×” earning figure is an aspiration, not a guaranteed result. Earnings depend on skills, local demand, pricing and client acquisition.</p></div>}
        </div>
        <form className="booking-form" onSubmit={submitRequest}>
          <div className="form-heading"><div><span>REQUEST DETAILS</span><h2>{isClass ? "Masterclass slot request" : "Inspection request"}</h2></div><span className="form-step">01 / 01</span></div>
          <div className="booking-fields">
            <label>Full name<input required name="Name" autoComplete="name" placeholder="Enter your name" /></label>
            <label>Mobile number<input required name="Mobile" inputMode="tel" autoComplete="tel" placeholder="+91" /></label>
            {isClass ? <>
              <label className="span-two">Preferred batch date<input required name="Preferred batch date" type="date" /></label>
              <label className="span-two">Your experience level<select name="Experience level" defaultValue="" required><option value="" disabled>Select one</option><option>Beginner</option><option>Automotive student</option><option>Workshop / service experience</option><option>Existing inspector</option><option>Career change</option></select></label>
              <label className="span-two">What would you like to learn?<textarea name="Learning goals" rows={3} placeholder="For example: used-car checks, PDI, reporting…" /></label>
            </> : <>
              <label>Vehicle make & model<input required name="Vehicle make and model" placeholder="e.g. Hyundai Creta" /></label>
              <label>Model year<input name="Model year" inputMode="numeric" placeholder="e.g. 2022" /></label>
              <label>Inspection type<select name="Inspection type" defaultValue="Used car inspection"><option>Used car inspection</option><option>New car PDI</option><option>Pre-purchase inspection</option><option>Diagnostic assessment</option><option>Other / not sure</option></select></label>
              <label>Preferred date<input required name="Preferred date" type="date" /></label>
              <label className="span-two">Vehicle location<input required name="Vehicle location" placeholder="Area / city / workshop or dealership" /></label>
              <label className="span-two">Additional information<textarea name="Notes" rows={3} placeholder="Anything the inspector should know?" /></label>
            </>}
          </div>
          <button className="booking-submit" type="submit">{isClass ? "Request masterclass slot" : "Request inspection"} <ArrowRight size={17}/></button>
          <p className="form-privacy">Your details will be included in a WhatsApp enquiry. Availability and booking are confirmed by the team, not by this mock form.</p>
          {sent && <p className="sent-note"><CheckCircle2 size={16}/> Your request has been prepared in WhatsApp. Send the message there to contact the team.</p>}
        </form>
      </div>
      <style jsx global>{`
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Hanken+Grotesk:wght@400;500;600;700&display=swap');
.booking-page { min-height:100vh; background:#f6f3ee; color:#16171a; font-family:'Hanken Grotesk',Arial,sans-serif; }
.booking-page * { box-sizing:border-box; }
.booking-header { min-height:76px; padding:13px clamp(20px,4vw,62px); display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #ddd7cc; gap:18px; }
.booking-brand { display:flex; align-items:center; gap:11px; text-decoration:none; color:inherit; }
.booking-brand > span { font:800 36px/.8 'Barlow Condensed',Impact,sans-serif; letter-spacing:-.06em; }
.booking-brand .red { color:#e11d48; }
.booking-brand b { display:flex; flex-direction:column; gap:4px; font:700 15px 'Barlow Condensed',Impact,sans-serif; letter-spacing:.07em; }
.booking-brand small { font:700 9px 'Hanken Grotesk',Arial,sans-serif; color:#6b6f76; letter-spacing:.16em; }
.back-link { display:flex; align-items:center; gap:8px; font-size:12px; font-weight:700; text-decoration:none; color:#555b63; }
.booking-shell { width:min(1190px,100%); margin:0 auto; padding:clamp(40px,7vw,90px) clamp(20px,4vw,44px); display:grid; grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr); align-items:start; gap:clamp(35px,7vw,96px); }
.booking-eyebrow { display:flex; align-items:center; gap:9px; margin:0 0 22px; font-size:10px; font-weight:700; letter-spacing:.15em; color:#6b6f76; }
.booking-eyebrow span { width:7px; height:7px; background:#e11d48; border-radius:50%; }
.booking-intro h1 { margin:0; font:700 clamp(50px,6.6vw,85px)/.89 'Barlow Condensed',Impact,sans-serif; letter-spacing:-.03em; text-transform:uppercase; }
.booking-intro h1 span { color:#e11d48; }
.booking-intro > p:not(.booking-eyebrow) { max-width:475px; margin:25px 0 29px; font-size:14px; line-height:1.85; color:#686d74; }
.booking-benefits { display:grid; gap:17px; }
.booking-benefits > div { display:flex; align-items:flex-start; gap:12px; }
.booking-benefits > div > span { display:grid; place-items:center; width:37px; height:37px; flex-shrink:0; background:#ede8df; color:#e11d48; }
.booking-benefits b,.booking-benefits small { display:block; }
.booking-benefits b { font-size:12px; }
.booking-benefits small { margin-top:4px; color:#757a80; font-size:11px; line-height:1.6; }
.earn-disclaimer { margin-top:28px; padding:14px; border:1px solid #ddd7cc; display:flex; gap:10px; align-items:flex-start; color:#e11d48; }
.earn-disclaimer p { margin:0; color:#6b6f76; font-size:11px; line-height:1.7; }
.booking-form { background:#fff; border:1px solid #e5e0d7; padding:clamp(22px,4vw,38px); box-shadow:0 18px 48px rgba(22,23,26,.055); }
.form-heading { display:flex; justify-content:space-between; gap:15px; align-items:flex-start; padding-bottom:23px; margin-bottom:24px; border-bottom:1px solid #e5e0d7; }
.form-heading span:first-child { color:#e11d48; font-size:9px; font-weight:700; letter-spacing:.16em; }
.form-heading h2 { margin:7px 0 0; font:700 33px/1 'Barlow Condensed',Impact,sans-serif; text-transform:uppercase; }
.form-heading .form-step { color:#96999c; font-size:10px; letter-spacing:.1em; }
.booking-fields { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px 14px; }
.booking-fields label { display:flex; flex-direction:column; gap:8px; color:#434850; font-size:11px; font-weight:700; }
.booking-fields .span-two { grid-column:1/-1; }
.booking-fields input,.booking-fields select,.booking-fields textarea { width:100%; min-height:46px; padding:12px 13px; border:1px solid #ddd7cc; border-radius:0; outline:none; background:#fbfaf8; color:#16171a; font:500 12px 'Hanken Grotesk',Arial,sans-serif; }
.booking-fields textarea { resize:vertical; }
.booking-fields input:focus,.booking-fields select:focus,.booking-fields textarea:focus { border-color:#e11d48; box-shadow:0 0 0 3px rgba(225,29,72,.09); }
.booking-submit { margin-top:25px; display:flex; justify-content:center; align-items:center; gap:12px; width:100%; min-height:51px; border:0; background:#e11d48; color:white; font:700 12px 'Hanken Grotesk',Arial,sans-serif; cursor:pointer; transition:background .2s,transform .2s; }
.booking-submit:hover { background:#be123c; transform:translateY(-2px); }
.form-privacy { margin:14px 0 0; color:#888b90; font-size:10px; line-height:1.7; }
.sent-note { display:flex; align-items:flex-start; gap:8px; color:#047857; font-size:11px; line-height:1.6; }
@media(max-width:800px) { .booking-shell { grid-template-columns:1fr; gap:35px; } .booking-intro h1 { font-size:clamp(52px,10vw,75px); } }
@media(max-width:480px) { .booking-header { min-height:67px; } .booking-brand > span { font-size:32px; } .booking-brand b { font-size:12px; } .booking-brand small { font-size:8px; } .back-link { font-size:10px; } .booking-fields { grid-template-columns:1fr; } .booking-fields .span-two { grid-column:auto; } .booking-shell { padding-top:45px; } }
`}</style>
    </main>
  );
}

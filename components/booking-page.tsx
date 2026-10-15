"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, GraduationCap, ShieldCheck } from "lucide-react";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteEffects } from "@/components/site-effects";

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
    const whatsappUrl = "https://wa.me/919663120429?text=" + encodeURIComponent(message);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <div className="booking-page page-fade-in">
      <SiteEffects />
      <SiteNavigation />
      <main className="booking-shell-v2">
        <div className="booking-intro-v2" data-reveal>
          <p className="eyebrow"><span className="eyebrow-live-dot" /> {isClass ? "PRACTICAL TRAINING" : "VEHICLE SERVICES"}</p>
          <h1>{isClass ? <>Learn to inspect.<span>Build real skill.</span></> : <>Book an inspection.<span>Decide with clarity.</span></>}</h1>
          <p>{isClass ? "Request a place in the six-day hands-on masterclass. Share your preferred batch details and the team can discuss dates, venue and fees before confirmation." : "Tell us about the vehicle and the inspection you need. The team can confirm availability, location, scope and pricing before your booking is final."}</p>
          <div className="booking-benefits-v2">
            <div className="booking-benefit-v2"><span className="booking-benefit-icon-v2"><CheckCircle2 size={17}/></span><div><b>{isClass ? "Practical learning outline" : "Structured inspection"}</b><small>{isClass ? "Guided exercises across six days" : "Visible checks and documented observations"}</small></div></div>
            <div className="booking-benefit-v2"><span className="booking-benefit-icon-v2"><Clock3 size={17}/></span><div><b>Request first, confirmation next</b><small>This form sends an enquiry; it does not reserve a slot by itself.</small></div></div>
            {isClass && <div className="booking-benefit-v2"><span className="booking-benefit-icon-v2"><GraduationCap size={17}/></span><div><b>Built around fundamentals</b><small>Safe observation, evidence capture and clear reporting.</small></div></div>}
          </div>
          {isClass && <div className="booking-disclaimer-v2"><ShieldCheck size={18}/><p>The course is a learning outline, not a guarantee of job placement, certification or income. Confirm the actual batch details and terms before paying.</p></div>}
        </div>
        <form className="booking-form-v2" onSubmit={submitRequest} data-reveal data-reveal-delay="90">
          <div className="booking-form-heading-v2"><div><span>REQUEST DETAILS</span><h2>{isClass ? "Masterclass slot request" : "Inspection request"}</h2></div><small>FORM / 01</small></div>
          <div className="booking-fields-v2">
            <label>Full name<input required name="Name" autoComplete="name" placeholder="Enter your name" /></label>
            <label>Mobile number<input required name="Mobile" inputMode="tel" autoComplete="tel" placeholder="+91" /></label>
            {isClass ? <>
              <label className="span-two">Preferred batch date<input required name="Preferred batch date" type="date" /></label>
              <label className="span-two">Your experience level<select name="Experience level" defaultValue="" required><option value="" disabled>Select one</option><option>Beginner</option><option>Automotive student</option><option>Workshop / service experience</option><option>Existing inspector</option><option>Career change</option></select></label>
              <label className="span-two">What would you like to learn?<textarea name="Learning goals" rows={3} placeholder="For example: used-car checks, PDI, reporting…" /></label>
            </> : <>
              <label>Vehicle make and model<input required name="Vehicle make and model" placeholder="e.g. Hyundai Creta" /></label>
              <label>Model year<input name="Model year" inputMode="numeric" placeholder="e.g. 2022" /></label>
              <label>Inspection type<select name="Inspection type" defaultValue="Used car inspection"><option>Used car inspection</option><option>New car PDI</option><option>Used-vehicle PDI</option><option>Pre-purchase inspection</option><option>Diagnostic assessment</option><option>Fleet / dealer support</option><option>Other / not sure</option></select></label>
              <label>Preferred date<input required name="Preferred date" type="date" /></label>
              <label className="span-two">Vehicle location<input required name="Vehicle location" placeholder="Area / city / workshop or dealership" /></label>
              <label className="span-two">Additional information<textarea name="Notes" rows={3} placeholder="Anything the inspector should know?" /></label>
            </>}
          </div>
          <button className="booking-submit-v2" type="submit">{isClass ? "Request masterclass details" : "Request inspection"} <ArrowRight size={16}/></button>
          <p className="booking-privacy-v2">Submitting opens a WhatsApp enquiry with these details. This website does not save the form in a database or confirm an appointment.</p>
          {sent && <p className="booking-sent-v2"><CheckCircle2 size={16}/> The WhatsApp enquiry has been prepared. Send the message in WhatsApp to reach the team.</p>}
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}

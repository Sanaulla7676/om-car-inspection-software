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
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  async function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || sent) return;
    setBusy(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const value = (key: string) => String(form.get(key) ?? "").trim();
    const payload = {
      requestType: isClass ? "masterclass" : "inspection",
      fullName: value("Name"),
      mobile: value("Mobile"),
      email: value("Email"),
      preferredDate: value(isClass ? "Preferred batch date" : "Preferred date"),
      experienceLevel: value("Experience level"),
      learningGoals: value("Learning goals"),
      vehicleMakeModel: value("Vehicle make and model"),
      modelYear: value("Model year"),
      inspectionType: value("Inspection type"),
      vehicleLocation: value("Vehicle location"),
      notes: value("Notes"),
      website: value("Website"),
    };

    try {
      const response = await fetch("/api/public/booking-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok || !result?.id) {
        throw new Error(result?.error || "We could not save your request. Please try again.");
      }

      const heading = isClass ? "6-Day Car Inspection Masterclass Request" : "Car Inspection Booking Request";
      const message = [
        heading,
        "Reference: " + result.id,
        "Name: " + payload.fullName,
        "Mobile: " + payload.mobile,
        payload.email ? "Email: " + payload.email : "",
        "Preferred date: " + payload.preferredDate,
        isClass
          ? "Experience level: " + payload.experienceLevel + "\nLearning goals: " + payload.learningGoals
          : "Vehicle: " + payload.vehicleMakeModel + (payload.modelYear ? " (" + payload.modelYear + ")" : "") + "\nInspection type: " + payload.inspectionType + "\nLocation: " + payload.vehicleLocation + "\nNotes: " + payload.notes,
        "Please contact me to confirm availability and next steps.",
      ].filter(Boolean).join("\n\n");

      setBookingRef(result.id);
      setWhatsappUrl("https://wa.me/918880339999?text=" + encodeURIComponent(message));
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "We could not save your request. Please try again or contact the team directly.");
    } finally {
      setBusy(false);
    }
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
            <div className="booking-benefit-v2"><span className="booking-benefit-icon-v2"><Clock3 size={17}/></span><div><b>Request first, confirmation next</b><small>Your request is saved. The team must still confirm availability.</small></div></div>
            {isClass && <div className="booking-benefit-v2"><span className="booking-benefit-icon-v2"><GraduationCap size={17}/></span><div><b>Built around fundamentals</b><small>Safe observation, evidence capture and clear reporting.</small></div></div>}
          </div>
          {isClass && <div className="booking-disclaimer-v2"><ShieldCheck size={18}/><p>The course is a learning outline, not a guarantee of job placement, certification or income. Confirm the actual batch details and terms before paying.</p></div>}
        </div>
        <form className="booking-form-v2" onSubmit={submitRequest} data-reveal data-reveal-delay="90">
          <div className="booking-form-heading-v2"><div><span>REQUEST DETAILS</span><h2>{isClass ? "Masterclass slot request" : "Inspection request"}</h2></div><small>FORM / 01</small></div>
          <div className="booking-fields-v2">
            <label>Full name<input required name="Name" autoComplete="name" maxLength={120} placeholder="Enter your name" /></label>
            <label>Mobile number<input required name="Mobile" inputMode="tel" autoComplete="tel" maxLength={30} placeholder="+91" /></label>
            <label className="span-two">Email address (optional)<input name="Email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" /></label>
            {isClass ? <>
              <label className="span-two">Preferred batch date<input required name="Preferred batch date" type="date" /></label>
              <label className="span-two">Your experience level<select name="Experience level" defaultValue="" required><option value="" disabled>Select one</option><option>Beginner</option><option>Automotive student</option><option>Workshop / service experience</option><option>Existing inspector</option><option>Career change</option></select></label>
              <label className="span-two">What would you like to learn?<textarea name="Learning goals" rows={3} maxLength={1500} placeholder="For example: used-car checks, PDI, reporting…" /></label>
            </> : <>
              <label>Vehicle make and model<input required name="Vehicle make and model" maxLength={120} placeholder="e.g. Hyundai Creta" /></label>
              <label>Model year<input name="Model year" inputMode="numeric" maxLength={4} placeholder="e.g. 2022" /></label>
              <label>Inspection type<select name="Inspection type" defaultValue="Used car inspection"><option>Used car inspection</option><option>New car PDI</option><option>Used-vehicle PDI</option><option>Pre-purchase inspection</option><option>Diagnostic assessment</option><option>Fleet / dealer support</option><option>Other / not sure</option></select></label>
              <label>Preferred date<input required name="Preferred date" type="date" /></label>
              <label className="span-two">Vehicle location<input required name="Vehicle location" maxLength={200} placeholder="Area / city / workshop or dealership" /></label>
              <label className="span-two">Additional information<textarea name="Notes" rows={3} maxLength={2000} placeholder="Anything the inspector should know?" /></label>
            </>}
            <label aria-hidden="true" style={{position:"absolute",left:"-10000px",width:"1px",height:"1px",overflow:"hidden"}}>Leave this field empty<input name="Website" tabIndex={-1} autoComplete="off" /></label>
          </div>
          <button className="booking-submit-v2" type="submit" disabled={busy || sent}>{busy ? "Saving request…" : sent ? "Request saved" : isClass ? "Request masterclass details" : "Request inspection"} {!busy && !sent && <ArrowRight size={16}/>}</button>
          <p className="booking-privacy-v2">Your request is saved for the team. It is not a confirmed appointment or course place until the team confirms it.</p>
          {error && <p className="booking-sent-v2" role="alert">{error}</p>}
          {sent && <div className="booking-sent-v2" role="status"><CheckCircle2 size={16}/><span>Request saved. Reference <strong>{bookingRef.slice(0,8).toUpperCase()}</strong>. Continue in WhatsApp to send the team your details and discuss confirmation. <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Continue in WhatsApp <ArrowRight size={14}/></a></span></div>}
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}

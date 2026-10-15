"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, GraduationCap, MessageCircle } from "lucide-react";

const trainingOptions = [
  "New Vehicle PDI",
  "Pre-Owned Vehicle Inspection",
  "PDI Coaching",
  "Inspection Report & Valuation",
  "Not sure yet"
];

export function CoachingInquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [training, setTraining] = useState("PDI Coaching");

  function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const city = String(data.get("city") || "").trim();
    const experience = String(data.get("experience") || "Not specified");
    const preferredTime = String(data.get("preferredTime") || "Flexible");
    const message = String(data.get("message") || "").trim();
    const text = [
      "Hello, I would like to enquire about vehicle inspection / PDI coaching.",
      "",
      "Name: " + name,
      "Mobile: " + phone,
      "City: " + city,
      "Enquiry: " + training,
      "Experience: " + experience,
      "Preferred contact time: " + preferredTime,
      message ? "Message: " + message : ""
    ].filter(Boolean).join("\n");
    const rawNumber = process.env.NEXT_PUBLIC_COACHING_WHATSAPP_NUMBER || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
    const number = rawNumber.replace(/\D/g, "");
    const url = number
      ? "https://wa.me/" + number + "?text=" + encodeURIComponent(text)
      : "https://wa.me/?text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  return (
    <section className="lux-coaching-enquiry" id="coaching-enquiry" aria-labelledby="lux-coaching-form-title">
      <div className="lux-form-intro">
        <p className="lux-eyebrow"><span /> ENQUIRE ABOUT COACHING</p>
        <h2 id="lux-coaching-form-title">Learn vehicle inspection with a clear method.</h2>
        <p>Tell us a little about yourself. Your details will be placed into a WhatsApp enquiry so you can review and send it.</p>
        <div className="lux-form-feature"><span><GraduationCap size={19} /></span><div><b>Practical PDI coaching</b><small>Inspection sequence · Condition marking · Evidence and reports</small></div></div>
        <div className="lux-form-feature"><span><MessageCircle size={19} /></span><div><b>Direct follow-up</b><small>Ask about upcoming batches, format, fees and venue.</small></div></div>
      </div>
      <form className="lux-enquiry-form" onSubmit={submitEnquiry}>
        <div className="lux-form-header"><div><span>01 / ENQUIRY</span><h3>Tell us what you need</h3></div><span className="lux-form-badge"><GraduationCap size={20} /></span></div>
        <div className="lux-form-grid">
          <label className="lux-form-field"><span>Full name *</span><input name="name" autoComplete="name" required minLength={2} placeholder="Your name" /></label>
          <label className="lux-form-field"><span>Mobile number *</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" required pattern="[+0-9 ()-]{8,20}" placeholder="+91 98765 43210" /></label>
          <label className="lux-form-field"><span>City *</span><input name="city" autoComplete="address-level2" required placeholder="Your city" /></label>
          <label className="lux-form-field"><span>Area of interest *</span><select value={training} onChange={(event) => setTraining(event.target.value)} required>{trainingOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="lux-form-field"><span>Your experience</span><select name="experience" defaultValue="Beginner"><option>Beginner</option><option>Student</option><option>Automotive technician</option><option>Inspection professional</option><option>Dealer / workshop team</option><option>Other</option></select></label>
          <label className="lux-form-field"><span>Best time to contact</span><select name="preferredTime" defaultValue="Flexible"><option>Flexible</option><option>Morning</option><option>Afternoon</option><option>Evening</option></select></label>
          <label className="lux-form-field lux-form-field-full"><span>Message (optional)</span><textarea name="message" rows={3} maxLength={600} placeholder="Tell us what you want to learn or ask about." /></label>
        </div>
        <button className="lux-button lux-button-gold lux-form-submit" type="submit">Continue in WhatsApp <ArrowRight size={16} /></button>
        <p className="lux-form-privacy">Your details are included in the WhatsApp draft. Check them before sending. This form does not confirm a place or booking.</p>
        {submitted && <p className="lux-form-success" role="status"><Check size={14} /> WhatsApp opened with your enquiry prepared. Review it and press Send.</p>}
      </form>
    </section>
  );
}

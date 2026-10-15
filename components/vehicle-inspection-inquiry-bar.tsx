"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CalendarDays, CarFront, MessageCircle } from "lucide-react";

const serviceTypes = [
  "New Vehicle PDI",
  "Pre-Owned Vehicle PDI / PDA",
  "Vehicle Valuation & Inspection Report",
  "Other Vehicle Inspection"
];

export function VehicleInspectionInquiryBar() {
  const [service, setService] = useState(serviceTypes[0]);
  const [opened, setOpened] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const values = new FormData(form);
    const customer = String(values.get("customer") || "").trim();
    const phone = String(values.get("phone") || "").trim();
    const vehicle = String(values.get("vehicle") || "").trim();
    const date = String(values.get("date") || "");
    const city = String(values.get("city") || "").trim();
    const registration = String(values.get("registration") || "").trim();
    const notes = String(values.get("notes") || "").trim();
    const message = [
      "Hello, I would like to enquire about a vehicle inspection.",
      "",
      "Name: " + customer,
      "Contact number: " + phone,
      "Vehicle make / model: " + vehicle,
      "Inspection type: " + service,
      "Preferred date: " + date,
      city ? "City / location: " + city : "",
      registration ? "Registration (optional): " + registration : "",
      notes ? "Additional details: " + notes : "",
      "",
      "Please confirm availability, scope and charges."
    ].filter(Boolean).join("\n");

    const number = "918880339999";
    window.open("https://wa.me/" + number + "?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
    setOpened(true);
  }

  return (
    <section className="lux-inspection-inquiry-wrap" id="vehicle-inquiry" aria-labelledby="lux-inspection-inquiry-title">
      <div className="lux-inspection-inquiry-top">
        <div className="lux-inquiry-heading">
          <span className="lux-inquiry-step">INSPECTION ENQUIRY</span>
          <h2 id="lux-inspection-inquiry-title">Book a vehicle inspection.</h2>
          <p>Share your vehicle and preferred date. We’ll prepare an enquiry for WhatsApp so the team can confirm availability.</p>
        </div>
        <span className="lux-inquiry-icon"><CarFront size={23} /></span>
      </div>
      <form className="lux-inspection-inquiry-form" onSubmit={handleSubmit}>
        <label><span>Your name *</span><input name="customer" autoComplete="name" required minLength={2} placeholder="Full name" /></label>
        <label><span>Mobile / WhatsApp *</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" required pattern="[+0-9 ()-]{8,20}" placeholder="+91 98765 43210" /></label>
        <label><span>Vehicle make & model *</span><input name="vehicle" required minLength={2} placeholder="e.g. Toyota Fortuner" /></label>
        <label><span>Preferred date *</span><input name="date" type="date" required min={new Date().toISOString().slice(0, 10)} /></label>
        <label><span>Inspection type *</span><select value={service} onChange={(event) => setService(event.target.value)} required>{serviceTypes.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label><span>City / location</span><input name="city" autoComplete="address-level2" placeholder="e.g. Bengaluru" /></label>
        <details className="lux-inquiry-extra">
          <summary>Registration number or additional details (optional)</summary>
          <div className="lux-inquiry-extra-fields">
            <label><span>Vehicle registration</span><input name="registration" placeholder="e.g. KA 03 XX 1234" /></label>
            <label><span>Additional details</span><input name="notes" placeholder="New / used, preferred time, concerns…" /></label>
          </div>
        </details>
        <button className="lux-button lux-button-gold lux-inspection-submit" type="submit"><MessageCircle size={16} /> Enquire on WhatsApp <ArrowRight size={16} /></button>
      </form>
      <div className="lux-inquiry-foot"><CalendarDays size={14} /><span>Enquiry only. The date is a preference, not a confirmed appointment.</span></div>
      {opened && <p className="lux-inquiry-status" role="status">WhatsApp opened with your enquiry details. Review the message and press Send.</p>}
    </section>
  );
}

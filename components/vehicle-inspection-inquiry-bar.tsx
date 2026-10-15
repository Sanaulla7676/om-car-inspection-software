"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowRight, CalendarDays, CarFront, Check, ChevronLeft, ChevronRight, MessageCircle, Search } from "lucide-react";

const inspectionTypes = [
  { value: "New Vehicle PDI", label: "New Vehicle PDI", detail: "Pre-delivery inspection" },
  { value: "Pre-Owned Vehicle PDI", label: "Pre-Owned PDI", detail: "Pre-purchase inspection" }
];

const exampleVehicles = ["Hyundai Verna", "Toyota Fortuner", "Mahindra Thar", "Mahindra XUV700", "Mercedes-Benz"];

function toLocalKey(date: Date) {
  return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
}

function prettyDate(value: string) {
  if (!value) return "";
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function VehicleInspectionInquiryBar() {
  const [service, setService] = useState(inspectionTypes[0].value);
  const [vehicle, setVehicle] = useState("");
  const [city, setCity] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarPlacement, setCalendarPlacement] = useState<"above" | "below">("below");
  const [vehiclePickerOpen, setVehiclePickerOpen] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [opened, setOpened] = useState(false);
  const [optionalOpen, setOptionalOpen] = useState(false);
  const calendarWrap = useRef<HTMLDivElement>(null);
  const vehicleWrap = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = toLocalKey(today);
  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const offset = new Date(year, month, 1).getDay();
    const count = new Date(year, month + 1, 0).getDate();
    return [
      ...Array.from({ length: offset }, (_, index) => ({ key: "blank-" + index, day: 0, value: "" })),
      ...Array.from({ length: count }, (_, index) => {
        const day = index + 1;
        return { key: year + "-" + month + "-" + day, day, value: toLocalKey(new Date(year, month, day)) };
      })
    ];
  }, [visibleMonth]);

  useEffect(() => {
    function handlePointer(event: PointerEvent) {
      const target = event.target as Node;
      if (calendarWrap.current && !calendarWrap.current.contains(target)) setCalendarOpen(false);
      if (vehicleWrap.current && !vehicleWrap.current.contains(target)) setVehiclePickerOpen(false);
    }
    document.addEventListener("pointerdown", handlePointer);
    return () => document.removeEventListener("pointerdown", handlePointer);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;
    if (!selectedDate) {
      setDateError(true);
      setCalendarOpen(true);
      return;
    }
    if (!form.reportValidity()) return;

    const values = new FormData(form);
    const customer = String(values.get("customer") || "").trim();
    const phone = String(values.get("phone") || "").trim();
    const registration = String(values.get("registration") || "").trim();
    const notes = String(values.get("notes") || "").trim();
    const message = [
      "Hello, I would like to enquire about a vehicle inspection.",
      "",
      "Name: " + customer,
      "Contact number: " + phone,
      "Vehicle make / model: " + vehicle.trim(),
      "Inspection type: " + service,
      "Preferred date: " + prettyDate(selectedDate),
      city.trim() ? "City / location: " + city.trim() : "",
      registration ? "Registration (optional): " + registration.trim() : "",
      notes ? "Additional details: " + notes.trim() : "",
      "",
      "Please confirm availability, scope and charges."
    ].filter(Boolean).join("\n");

    setSubmitting(true);
    setOpened(false);
    const number = "918880339999";
    window.open("https://wa.me/" + number + "?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
    setOpened(true);
    window.setTimeout(() => setSubmitting(false), 1000);
  }

  return (
    <section className="lux-inspection-inquiry-wrap" id="vehicle-inquiry" aria-labelledby="lux-inspection-inquiry-title">
      <div className="lux-inspection-inquiry-top">
        <div className="lux-inquiry-heading">
          <span className="lux-inquiry-step">INSPECTION ENQUIRY</span>
          <h2 id="lux-inspection-inquiry-title">Book a vehicle inspection.</h2>
          <p>Choose the inspection type, tell us which vehicle you have and select your preferred date. The team will confirm availability on WhatsApp.</p>
        </div>
        <span className="lux-inquiry-icon" aria-hidden="true"><CarFront size={23} /></span>
      </div>

      <form className="lux-inspection-inquiry-form" onSubmit={handleSubmit}>
        <fieldset className="lux-inspection-type-selector">
          <legend>What do you need? *</legend>
          <div className="lux-inspection-type-options">
            {inspectionTypes.map((item) => (
              <button key={item.value} type="button" className={"lux-inspection-type-option" + (service === item.value ? " is-selected" : "")} aria-pressed={service === item.value} onClick={() => setService(item.value)}>
                <span className="lux-inspection-type-icon"><CarFront size={17} /></span>
                <span className="lux-inspection-type-copy"><b>{item.label}</b><small>{item.detail}</small></span>
                <span className="lux-inspection-type-check">{service === item.value && <Check size={13} />}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="lux-inspection-fields">
          <label className="lux-inspection-field"><span>Your name *</span><input name="customer" autoComplete="name" required minLength={2} placeholder="Full name" /></label>
          <label className="lux-inspection-field"><span>Mobile / WhatsApp *</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" required pattern="[+0-9 ()-]{8,20}" placeholder="+91 98765 43210" /></label>

          <div className="lux-inspection-field lux-vehicle-picker" ref={vehicleWrap}>
            <label htmlFor="lux-vehicle-model"><span>Vehicle make & model *</span></label>
            <div className="lux-vehicle-entry">
              <CarFront size={17} aria-hidden="true" />
              <input id="lux-vehicle-model" name="vehicle" value={vehicle} onChange={(event) => { setVehicle(event.target.value); if (event.target.value.trim()) setVehiclePickerOpen(false); }} onFocus={() => { if (!vehicle.trim()) setVehiclePickerOpen(true); }} required minLength={2} autoComplete="off" placeholder="e.g. Toyota Fortuner" aria-expanded={vehiclePickerOpen} aria-controls="lux-vehicle-suggestions" />
              <button type="button" aria-label="Choose an example vehicle" aria-expanded={vehiclePickerOpen} onClick={() => setVehiclePickerOpen((open) => !open)}><Search size={16} /></button>
            </div>
            {vehiclePickerOpen && <div className="lux-vehicle-suggestions" id="lux-vehicle-suggestions" role="dialog" aria-label="Vehicle make and model examples">
              <p>Type your model or choose an example</p>
              <div>{exampleVehicles.filter((item) => !vehicle || item.toLowerCase().includes(vehicle.toLowerCase()) || vehicle.length < 2).map((item) => <button type="button" key={item} onClick={() => { setVehicle(item); setVehiclePickerOpen(false); }}>{item}<ArrowRight size={12} /></button>)}</div>
            </div>}
          </div>

          <div className="lux-inspection-field lux-date-picker" ref={calendarWrap}>
            <span className="lux-inspection-field-label">Preferred date *</span>
            <button className={"lux-date-trigger" + (dateError ? " has-error" : "")} type="button" onClick={() => {
                const nextOpen = !calendarOpen;
                if (nextOpen) {
                  const bounds = calendarWrap.current?.getBoundingClientRect();
                  const roomBelow = bounds ? window.innerHeight - bounds.bottom : window.innerHeight;
                  const roomAbove = bounds ? bounds.top : 0;
                  setCalendarPlacement(roomBelow < 370 && roomAbove >= 350 ? "above" : "below");
                }
                setCalendarOpen(nextOpen);
                setDateError(false);
              }} aria-haspopup="dialog" aria-expanded={calendarOpen} aria-label="Choose preferred inspection date">
              <CalendarDays size={17} aria-hidden="true" />
              <span className={selectedDate ? "has-date" : "date-placeholder"}>{selectedDate ? prettyDate(selectedDate) : "Choose a date"}</span>
              <ChevronRight className={calendarOpen ? "is-rotated" : ""} size={15} aria-hidden="true" />
            </button>
            <input type="hidden" name="date" value={selectedDate} />
            {dateError && <span className="lux-date-error" role="alert">Select a preferred date from the calendar.</span>}
            {calendarOpen && <div className={"lux-calendar-popover" + (calendarPlacement === "above" ? " is-above" : "")} role="dialog" aria-label="Choose an inspection date">
              <div className="lux-calendar-header">
                <button type="button" aria-label="Previous month" disabled={visibleMonth.getFullYear() === today.getFullYear() && visibleMonth.getMonth() === today.getMonth()} onClick={() => setVisibleMonth((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))}><ChevronLeft size={17} /></button>
                <b>{visibleMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</b>
                <button type="button" aria-label="Next month" onClick={() => setVisibleMonth((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))}><ChevronRight size={17} /></button>
              </div>
              <div className="lux-calendar-grid lux-calendar-weekdays">{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <span key={day}>{day}</span>)}</div>
              <div className="lux-calendar-grid">
                {calendarDays.map((item) => {
                  if (!item.day) return <span className="lux-calendar-blank" key={item.key} aria-hidden="true" />;
                  const isPast = item.value < todayKey;
                  const isSelected = item.value === selectedDate;
                  return <button key={item.key} type="button" disabled={isPast} aria-pressed={isSelected} className={(isSelected ? "is-selected " : "") + (item.value === todayKey ? "is-today" : "")} onClick={() => { setSelectedDate(item.value); setDateError(false); setCalendarOpen(false); }}>{item.day}</button>;
                })}
              </div>
              <div className="lux-calendar-footer"><span>Choose a preferred date. Availability is confirmed separately.</span><button type="button" onClick={() => setCalendarOpen(false)}>Done</button></div>
            </div>}
          </div>

          <label className="lux-inspection-field"><span>City / location</span><input name="city" value={city} onChange={(event) => setCity(event.target.value)} autoComplete="address-level2" placeholder="e.g. Bengaluru" /></label>
        </div>

        <details className="lux-inquiry-extra" open={optionalOpen} onToggle={(event) => setOptionalOpen(event.currentTarget.open)}>
          <summary>Registration number or additional details (optional)</summary>
          <div className="lux-inquiry-extra-fields">
            <label><span>Vehicle registration</span><input name="registration" placeholder="e.g. KA 03 XX 1234" /></label>
            <label><span>Additional details</span><input name="notes" placeholder="New / used, preferred time, concerns…" /></label>
          </div>
        </details>

        <button className="lux-button lux-button-gold lux-inspection-submit" type="submit" disabled={submitting}><MessageCircle size={16} /> {submitting ? "Preparing WhatsApp…" : "Book Inspection"} <ArrowRight size={16} /></button>
      </form>
      <div className="lux-inquiry-foot"><CalendarDays size={14} /><span>Enquiry only. Your preferred date is not a confirmed appointment until the team confirms availability.</span></div>
      {opened && <p className="lux-inquiry-status" role="status">WhatsApp opened with your enquiry details. Review the message and press Send.</p>}
    </section>
  );
}

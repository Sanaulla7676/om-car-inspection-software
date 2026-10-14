"use client";

import { useMemo, useState } from "react";
import { CarFront, Check, ExternalLink, Gauge, ShieldCheck, Wrench } from "lucide-react";
import { conditionOptionsFor } from "@/lib/inspection-codes";

export type VehiclePartPick = {
  label: string;
  section: "Exterior" | "Interior" | "Mechanical" | "Electrical" | "Tyres";
  item: string;
  meshName: string;
};

type Props = { onApply: (part: VehiclePartPick, status: string) => void };

const FORTUNER_360_URL = "https://www.toyotabharat.com/virtual-showroom/fortuner.html";

const PART_GROUPS: { title: string; icon: "body" | "cabin" | "mechanical" | "electrical"; parts: VehiclePartPick[] }[] = [
  {
    title: "Exterior & doors",
    icon: "body",
    parts: [
      { label: "Bonnet / hood", section: "Exterior", item: "Bonnet Hood", meshName: "bonnet" },
      { label: "Front bumper", section: "Exterior", item: "Front Bumper", meshName: "front-bumper" },
      { label: "Front left door", section: "Exterior", item: "Door FL", meshName: "door-fl" },
      { label: "Front right door", section: "Exterior", item: "Door FR", meshName: "door-fr" },
      { label: "Rear left door", section: "Exterior", item: "Door RL", meshName: "door-rl" },
      { label: "Rear right door", section: "Exterior", item: "Door RR", meshName: "door-rr" },
      { label: "Rear hatch / trunk", section: "Exterior", item: "Trunk Hood", meshName: "rear-hatch" },
      { label: "Windscreen", section: "Exterior", item: "Windshield", meshName: "windscreen" }
    ]
  },
  {
    title: "Cabin & interior",
    icon: "cabin",
    parts: [
      { label: "Dashboard / cluster", section: "Interior", item: "Instrument cluster", meshName: "dashboard" },
      { label: "Driver seat", section: "Interior", item: "Driver seat", meshName: "driver-seat" },
      { label: "Front passenger seat", section: "Interior", item: "Passenger seat", meshName: "passenger-seat" },
      { label: "Rear / third row", section: "Interior", item: "Rear seats", meshName: "rear-seats" },
      { label: "Door trims", section: "Interior", item: "Door trims", meshName: "door-trims" },
      { label: "Roof lining", section: "Interior", item: "Roof Lining", meshName: "roof-lining" }
    ]
  },
  {
    title: "Engine, chassis & running gear",
    icon: "mechanical",
    parts: [
      { label: "Engine bay", section: "Mechanical", item: "Engine noise", meshName: "engine-bay" },
      { label: "Chassis / frame", section: "Mechanical", item: "Mounting", meshName: "chassis-frame" },
      { label: "Front suspension", section: "Mechanical", item: "Front suspension", meshName: "front-suspension" },
      { label: "Rear suspension", section: "Mechanical", item: "Rear suspension", meshName: "rear-suspension" },
      { label: "Brakes / discs", section: "Mechanical", item: "Brake Disk Damage", meshName: "brakes" },
      { label: "Gearbox / transmission", section: "Mechanical", item: "Gear shifting", meshName: "transmission" }
    ]
  },
  {
    title: "Electrical & tyres",
    icon: "electrical",
    parts: [
      { label: "Headlamps", section: "Electrical", item: "Headlights", meshName: "headlamps" },
      { label: "Battery / charging", section: "Electrical", item: "Battery", meshName: "battery" },
      { label: "Power windows", section: "Electrical", item: "Power windows", meshName: "power-windows" },
      { label: "Front left tyre", section: "Tyres", item: "Front Left", meshName: "tyre-fl" },
      { label: "Front right tyre", section: "Tyres", item: "Front Right", meshName: "tyre-fr" },
      { label: "Rear left tyre", section: "Tyres", item: "Rear Left", meshName: "tyre-rl" },
      { label: "Rear right tyre", section: "Tyres", item: "Rear Right", meshName: "tyre-rr" },
      { label: "Spare tyre", section: "Tyres", item: "Spare", meshName: "spare-tyre" }
    ]
  }
];

function Icon({ kind }: { kind: (typeof PART_GROUPS)[number]["icon"] }) {
  if (kind === "mechanical") return <Wrench size={14} />;
  if (kind === "electrical") return <Gauge size={14} />;
  if (kind === "cabin") return <ShieldCheck size={14} />;
  return <CarFront size={14} />;
}

export function VehicleModelViewer({ onApply }: Props) {
  const [picked, setPicked] = useState<VehiclePartPick>(PART_GROUPS[0].parts[0]);
  const [status, setStatus] = useState("0");
  const [message, setMessage] = useState("Select an inspection target, then apply its code to the matching checklist item.");
  const options = useMemo(() => conditionOptionsFor(picked.section, status), [picked.section, status]);

  function choose(part: VehiclePartPick) {
    setPicked(part);
    setStatus("0");
    setMessage(part.label + " selected · " + part.section + " checklist");
  }

  return (
    <section className="om-model-panel" aria-label="Toyota Fortuner inspection viewer">
      <div className="om-model-top">
        <div className="om-model-title">
          <span className="om-model-icon"><CarFront size={18} /></span>
          <div>
            <b>Toyota Fortuner · interactive 360 inspection</b>
            <small>Fortuner-specific showroom viewer, not the previous generic sports-car asset</small>
          </div>
        </div>
        <span className="om-model-badge">FORTUNER 360</span>
      </div>

      <div className="om-model-viewport om-fortuner-viewport">
        <iframe
          className="om-fortuner-frame"
          src={FORTUNER_360_URL}
          title="Toyota India official Fortuner virtual showroom"
          loading="lazy"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>

      <div className="om-model-shortcuts om-fortuner-launch">
        <a href={FORTUNER_360_URL} target="_blank" rel="noreferrer">
          <ExternalLink size={13} /> Open the full Fortuner 360 viewer
        </a>
        <a href="https://www.autocarindia.com/cars/toyota/fortuner/images/front-view" target="_blank" rel="noreferrer">
          <ExternalLink size={13} /> Open-bonnet / engine-bay photo reference
        </a>
        <a href="https://www.toyotabharat.com/documents/brochures/fortuner-mmc/combined-specsheet.pdf" target="_blank" rel="noreferrer">
          <ExternalLink size={13} /> Fortuner chassis / suspension specifications
        </a>
        <span>Use the 360 viewer's own controls to rotate the car, switch exterior / interior and open / close doors. Bonnet and chassis references open separately.</span>
      </div>

      <div className="om-model-disclaimer">
        The official 360 experience controls the exterior and door animation inside its own viewer. The inspection code selector below maps each selected part to the relevant checklist. Bonnet / engine, chassis, suspension and tyre findings are recorded by part; the third-party viewer does not expose external controls for opening the bonnet or lifting the vehicle to its underbody.
      </div>

      <div className="om-fortuner-parts">
        <div className="om-fortuner-parts-heading">
          <div><b>Part-by-part inspection map</b><small>Choose a part to attach its coded finding to the checklist.</small></div>
          <span>{picked.section}</span>
        </div>
        {PART_GROUPS.map(group => (
          <div className="om-fortuner-group" key={group.title}>
            <div className="om-fortuner-group-title"><Icon kind={group.icon} /><span>{group.title}</span></div>
            <div className="om-fortuner-part-grid">
              {group.parts.map(part => (
                <button
                  type="button"
                  key={part.meshName}
                  className={picked.meshName === part.meshName ? "active" : ""}
                  aria-pressed={picked.meshName === part.meshName}
                  onClick={() => choose(part)}
                >
                  {part.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="om-model-bottom">
        <div className="om-model-selection">
          <span className="om-model-status-dot" />
          <div><b>{picked.label}</b><small>{message}</small></div>
        </div>
        <div className="om-model-actions">
          <label className="om-fortuner-code-label">
            <span>Inspection code</span>
            <select aria-label="Inspection code for selected part" value={status} onChange={event => setStatus(event.target.value)}>
              {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <button
            type="button"
            className="om-model-apply"
            onClick={() => { onApply(picked, status); setMessage(picked.label + " updated with code " + status + "."); }}
          >
            <Check size={13} /> Apply code
          </button>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

type HeroCar = {
  id: string;
  name: string;
  image: string;
  color: string;
  glow: string;
};

const cars: HeroCar[] = [
  { id: "dark-blue-suv", name: "Premium SUV", image: "/car-assets/01_dark_blue_SUV.png", color: "#087b91", glow: "8, 142, 165" },
  { id: "black-bmw-coupe", name: "Black Luxury Coupe", image: "/car-assets/02_black_BMW_coupe.png", color: "#727b86", glow: "113, 126, 143" },
  { id: "red-wagonr", name: "Urban Hatchback", image: "/car-assets/03_red_WagonR.png", color: "#c92f3a", glow: "210, 40, 55" },
  { id: "black-bmw-suv", name: "Executive SUV", image: "/car-assets/04_black_BMW_SUV.png", color: "#647b90", glow: "93, 119, 143" },
  { id: "white-toyota-prado", name: "White Luxury SUV", image: "/car-assets/05_white_Toyota_Prado.png", color: "#b9c6d2", glow: "183, 198, 211" },
  { id: "white-fortuner", name: "White Fortuner", image: "/car-assets/06_white_Toyota_Fortuner.png", color: "#c4d5e4", glow: "187, 211, 230" },
  { id: "blue-audi-coupe", name: "Blue Sport Coupe", image: "/car-assets/07_blue_Audi_coupe.png", color: "#1758d3", glow: "23, 87, 220" },
  { id: "blue-nexon", name: "Blue Compact SUV", image: "/car-assets/08_blue_Tata_Nexon.png", color: "#1596df", glow: "12, 145, 228" },
  { id: "red-thar", name: "Red Off-Road SUV", image: "/car-assets/09_red_Thar_Roxx.png", color: "#e32636", glow: "235, 32, 48" },
  { id: "black-prado", name: "Black Prado", image: "/car-assets/10_black_Toyota_Prado.png", color: "#59616b", glow: "79, 91, 106" },
  { id: "silver-mercedes", name: "Silver Performance SUV", image: "/car-assets/11_silver_Mercedes_front.png", color: "#91a7ba", glow: "137, 164, 187" },
  { id: "silver-etron", name: "Electric Sport Sedan", image: "/car-assets/12_silver_Audi_e-tron.png", color: "#9baec2", glow: "145, 169, 194" },
  { id: "white-gle", name: "White Performance Coupe", image: "/car-assets/13_white_Mercedes_GLE_coupe.png", color: "#c7cbd0", glow: "198, 204, 213" },
  { id: "black-creta", name: "Black Urban SUV", image: "/car-assets/14_black_Hyundai_Creta.png", color: "#5a6069", glow: "88, 98, 111" },
  { id: "white-range-rover", name: "White Range Rover", image: "/car-assets/15_white_Range_Rover.png", color: "#cbd7e2", glow: "200, 215, 229" },
  { id: "silver-porsche", name: "Silver Performance SUV", image: "/car-assets/16_silver_Porsche_Cayenne.png", color: "#87939f", glow: "127, 145, 161" },
  { id: "blue-convertible", name: "Blue Convertible", image: "/car-assets/17_blue_convertible.png", color: "#0752bd", glow: "6, 77, 190" },
  { id: "white-mercedes-suv", name: "White Premium SUV", image: "/car-assets/18_white_Mercedes_SUV.png", color: "#c5d6e5", glow: "188, 210, 228" },
  { id: "white-fortuner-2", name: "White Fortuner", image: "/car-assets/19_white_Toyota_Fortuner.png", color: "#c8d7e2", glow: "191, 211, 225" },
];

export function HomeHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const car = cars[activeIndex];
  const heroStyle = { "--car-color": car.color, "--car-glow": car.glow } as CSSProperties;

  useEffect(() => {
    // Two seconds to enter, then two seconds at rest before the next car arrives.
    const timer = window.setTimeout(() => {
      setOutgoingIndex(activeIndex);
      setActiveIndex((current) => (current + 1) % cars.length);
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [activeIndex]);

  useEffect(() => {
    if (outgoingIndex === null) return;
    const timer = window.setTimeout(() => setOutgoingIndex(null), 2000);
    return () => window.clearTimeout(timer);
  }, [outgoingIndex]);

  useEffect(() => {
    cars.forEach((item) => {
      const image = new Image();
      image.src = item.image;
    });
  }, []);

  return (
    <section className="lux-car-image-hero lux-synchronized-hero om-car-showcase" aria-label="OMCAR car inspection hero" style={heroStyle}>
      <div className="om-car-showcase__stage">
        <div className="om-car-showcase__lava" aria-hidden="true">
          <svg viewBox="0 0 1000 600" preserveAspectRatio="none" focusable="false">
            <defs>
              <radialGradient id="om-car-lava-core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f0f4fa" stopOpacity="0.19" />
                <stop offset="28%" stopColor={`rgb(${car.glow})`} stopOpacity="0.62" />
                <stop offset="62%" stopColor={`rgb(${car.glow})`} stopOpacity="0.22" />
                <stop offset="100%" stopColor={`rgb(${car.glow})`} stopOpacity="0" />
              </radialGradient>
              <radialGradient id="om-car-lava-ribbon" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={`rgb(${car.glow})`} stopOpacity="0.38" />
                <stop offset="45%" stopColor={`rgb(${car.glow})`} stopOpacity="0.18" />
                <stop offset="100%" stopColor={`rgb(${car.glow})`} stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse cx="700" cy="320" rx="285" ry="200" fill="url(#om-car-lava-core)" />
            <ellipse cx="835" cy="390" rx="205" ry="165" fill="url(#om-car-lava-ribbon)" />
            <ellipse cx="610" cy="415" rx="170" ry="125" fill="url(#om-car-lava-ribbon)" />
            <ellipse cx="775" cy="255" rx="220" ry="95" fill="url(#om-car-lava-ribbon)" />
          </svg>
        </div>
        <div className="om-car-showcase__grain" aria-hidden="true" />
        <div className="om-car-showcase__glow" aria-hidden="true" />
        <div className="om-car-showcase__copy">
          <p className="om-car-showcase__eyebrow"><span /> OMCAR CAR INSPECTION</p>
          <p className="om-car-showcase__kicker">CONFIDENCE STARTS BEFORE THE DRIVE</p>
          <h1>SEE BEYOND<br /><em>THE SURFACE.</em></h1>
          <p className="om-car-showcase__description">Expert-led vehicle inspections. Clear evidence. Better-informed decisions before you buy or accept delivery.</p>
          <div className="om-car-showcase__actions">
            <Link href="/book-inspection" className="om-car-showcase__primary">Book an Inspection <ArrowRight size={16} /></Link>
            <Link href="/services/used-car-inspection" className="om-car-showcase__secondary">Explore Our Services</Link>
            <Link href="/software" className="om-car-showcase__software-link"><ShieldCheck size={14} /> Inspection Software <ArrowRight size={14} /></Link>
          </div>
          <p className="om-car-showcase__proof"><CheckCircle2 size={14} /> EVIDENCE-LED CHECKS <span /> CLEAR REPORTING</p>
        </div>
        {outgoingIndex !== null && (
          <img
            key={cars[outgoingIndex].id}
            className="om-car-showcase__car om-car-showcase__car--outgoing"
            src={cars[outgoingIndex].image}
            alt=""
            aria-hidden="true"
          />
        )}
        <img
          key={car.id}
          className="om-car-showcase__car om-car-showcase__car--incoming"
          src={car.image}
          alt={car.name}
          fetchPriority="high"
        />
        <div className="om-car-showcase__vehicle-label" aria-live="polite">
          <span>FEATURED VEHICLE</span>
          <strong>{car.name}</strong>
          <i>{String(activeIndex + 1).padStart(2, "0")} <b>/</b> {cars.length}</i>
        </div>
        <div className="om-car-showcase__progress" aria-hidden="true"><span key={car.id} /></div>
      </div>
    </section>
  );
}

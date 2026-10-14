"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, BatteryCharging, CircleDot, Gauge, Layers3, ScanLine, ShieldCheck, Wrench } from "lucide-react";
import { conditionOptionsFor } from "@/lib/inspection-codes";

export type InspectionDiagramSection = "Exterior" | "Interior" | "Mechanical" | "Electrical" | "Tyres" | "Frame";
export type VehiclePartPick = {
  label: string;
  section: InspectionDiagramSection;
  item: string;
  meshName: string;
};

type Mode = "Exterior" | "Interior" | "Engine" | "Transmission" | "Brakes" | "Steering" | "Electrical" | "Tyres" | "Chassis";
type Props = { section: string; onApply: (part: VehiclePartPick, status: string) => void };

type Part = Omit<VehiclePartPick, "section"> & { section: InspectionDiagramSection };
const makeParts = (section: InspectionDiagramSection, rows: [string,string,string][]): Part[] =>
  rows.map(([label,item,meshName]) => ({label,item,meshName,section}));

const PARTS: Record<Mode, Part[]> = {
  Exterior: makeParts("Exterior",[
    ["Front spoiler","Front Spoiler","front-spoiler"],["Front bumper","Front Bumper","front-bumper"],["Grille","Grille","grille"],["Bonnet / hood","Bonnet Hood","bonnet"],
    ["Front fender · L","Front Fender L","front-fender-l"],["Front fender · R","Front Fender R","front-fender-r"],["Front wheel disc · L","Front Left","front-wheel-l"],["Front wheel disc · R","Front Right","front-wheel-r"],
    ["Rear fender · L","Rear Fender L","rear-fender-l"],["Rear fender · R","Rear Fender R","rear-fender-r"],["Roof","Roof","roof"],["Front door · L","Door FL","door-fl"],
    ["Front door · R","Door FR","door-fr"],["Rear door · L","Door RL","door-rl"],["Rear door · R","Door RR","door-rr"],["Rocker panel · L","Rocker Panel L","rocker-l"],
    ["Rocker panel · R","Rocker Panel R","rocker-r"],["Quarter panel · L","Quarter Panel L","quarter-l"],["Quarter panel · R","Quarter Panel R","quarter-r"],["Trunk hood","Trunk Hood","trunk-hood"],
    ["Rear hood / hood panel","Hood","rear-hood"],["End panel","End Panel","end-panel"],["Rear bumper","Rear Bumper","rear-bumper"],["Rear spoiler","Rear Spoiler","rear-spoiler"],
    ["Mud flap · L","Mud Flap L","mud-flap-l"],["Mud flap · R","Mud Flap R","mud-flap-r"],["Windshield","Windshield","windshield"],["Rear windshield","Rear Windshield","rear-windshield"],
    ["Side window · L","Side Window L","side-window-l"],["Side window · R","Side Window R","side-window-r"],["Door handle · L","Door Handle L","door-handle-l"],["Door handle · R","Door Handle R","door-handle-r"],
    ["Side mirror · L","Side Mirror L","side-mirror-l"],["Side mirror · R","Side Mirror R","side-mirror-r"],["Headlights","Headlights","headlights"],["Fog lamps","Fog lamps","fog-lamps"],
    ["Tail lamps","Tail lamps","tail-lamps"],["Number plates","Number plates","number-plates"],["Parking sensors","Parking sensors","parking-sensors"],["Reverse camera","Reverse camera","reverse-camera"]
  ]),
  Interior: makeParts("Interior",[
    ["Instrument cluster","Instrument cluster","instrument-cluster"],["Warning lights","Warning lights","warning-lights"],["Infotainment","Infotainment","infotainment"],["AC controls","AC controls","ac-controls"],
    ["Steering controls","Steering controls","steering-controls"],["Horn","Horn","horn"],["Airbag indicator","Airbag indicator","airbag-indicator"],["USB / charging ports","USB / charging ports","usb-ports"],
    ["Speakers","Speakers","speakers"],["Driver seat","Front Left Seat","driver-seat"],["Front passenger seat","Front Right Seat","passenger-seat"],["Rear seat","Rear Seat","rear-seat"],
    ["Third seat","Third Seat","third-seat"],["Seat belts","Seat belts","seat-belts"],["Upholstery","Upholstery","upholstery"],["Front left door trim","Front Left Door Trim","front-left-door-trim"],
    ["Front right door trim","Front Right Door Trim","front-right-door-trim"],["Rear left door trim","Rear Left Door Trim","rear-left-door-trim"],["Rear right door trim","Rear Right Door Trim","rear-right-door-trim"],["Dashboard","Dashboard","dashboard"],
    ["Instrument panel","Instrument Panel","instrument-panel"],["Steering wheel","Steering Wheel","steering-wheel"],["Carpet","Carpet","carpet"],["Roof lining","Roof Lining","roof-lining"],
    ["Back door trim","Back Door Trim","back-door-trim"],["Center console","Center Console","center-console"],["Boot trim","Boot Trim","boot-trim"],["Boot interior","Boot interior","boot-interior"]
  ]),
  Engine: makeParts("Mechanical",[
    ["Engine oil leakage","Engine Oil Leakage","engine-oil-leak"],["Coolant leakage","Coolant Leakage","coolant-leak"],["Radiator damage","Radiator Damage","radiator"],["Abnormal noise","Abnormal Noise","abnormal-noise"],
    ["Black smoke","Black Smoke","black-smoke"],["White smoke","White Smoke","white-smoke"],["Idling slump","Idling Slump","idling"],["Engine RPM defect","Engine RPM Defect","rpm"],
    ["Defective belts","Defective Belts","belts"],["Cold start","Cold start","cold-start"],["Engine noise","Engine noise","engine-noise"],["Mounting","Mounting","mounting"],
    ["Hoses","Hoses","hoses"],["Fluid levels","Fluid levels","fluids"],["Battery","Battery","battery"]
  ]),
  Transmission: makeParts("Mechanical",[
    ["Clutch defect","Clutch Defect","clutch"],["Transmission oil leak","Transmission Oil Leak","transmission-oil-leak"],["Shift shock / time lag","Shift Shock Time Lag","shift-shock"],
    ["Gear shifting","Gear Shifting","gear-shifting"],["Gearbox noise","Gear Box Noise","gearbox"],["Drive shaft defect","Drive Shaft Defect","drive-shaft"],
    ["Differential noise","Differential Noise","differential"],["Wheel bearings defect","Wheel Bearings Defect","wheel-bearings"],["Automatic transmission behavior","Automatic transmission behavior","automatic-transmission"]
  ]),
  Brakes: makeParts("Mechanical",[
    ["Brake disc damage","Brake Disk Damage","brake-disc"],["Brake defect","Brake Defect","brake-defect"],["Pedal handling defect","Pedal Handling Defect","pedal-handling"],["Brake pedal","Brake pedal","brake-pedal"],["Brake response","Brake response","brake-response"],["Brake noise","Brake noise","brake-noise"],["ABS","ABS","abs"]
  ]),
  Steering: makeParts("Mechanical",[
    ["Bent suspension rod arm","Bent Suspension Rod Arm","suspension-rod"],["Shock absorber defect","Shock Absorber Defect","shock-absorber"],["Alignment","Alignment","alignment"],
    ["Front suspension","Front suspension","front-suspension"],["Rear suspension","Rear suspension","rear-suspension"],["Steering oil leak","Steering Oil Leak","steering-oil"],
    ["Steering shaft boots cut","Steering Shaft Boots Cut","steering-boots"],["Jammed steering","Jammed Steering","jammed-steering"],["Steering noise","Steering Noise","steering-noise"],
    ["Telescopic tilt defect","Defective Telescopic Tilt","telescopic-tilt"],["Steering response","Steering response","steering-response"],["Steering play","Steering play","steering-play"]
  ]),
  Electrical: makeParts("Electrical",[
    ["Defective meters","Defective Meters","meters"],["Warning lamp","Warning Lamp","warning-lamp"],["Horn defect","Horn Defect","horn-defect"],["Power window defect","Power Window Defect","power-window"],
    ["Keyless / cylinder defect","Keyless or Cylinder Defect","keyless"],["Audio defect","Audio Defect","audio"],["Antenna defect","Antenna Defect","antenna"],["Electronic mirror defect","Electronic Mirror Defect","electronic-mirror"],
    ["Wiper operation defect","Wiper Operation Defect","wipers"],["Head lamp defect","Head Lamp Defect","headlamp"],["Battery defect","Battery Defect","battery-defect"],["AC defect","Defective A/C","ac"],
    ["Defective seatbelts","Defective Seatbelts","seatbelt"],["Door lock defect","Door Lock Defect","door-lock"],["Alternator","Alternator","alternator"],["Central locking","Central locking","central-locking"],
    ["Power windows","Power windows","power-windows"],["Infotainment","Infotainment","infotainment-electrical"],["Parking sensors","Parking sensors","parking-sensors-electrical"],["Reverse camera","Reverse camera","reverse-camera-electrical"]
  ]),
  Tyres: makeParts("Tyres",[
    ["Front left","Front Left","tyre-fl"],["Front right","Front Right","tyre-fr"],["Rear left","Rear Left","tyre-rl"],["Rear right","Rear Right","tyre-rr"],["Spare tyre","Spare","spare-tyre"]
  ]),
  Chassis: makeParts("Frame",[
    ["Front cross member","Front Cross Member","front-cross-member"],["Upper core support","Upper Core Support","upper-core-support"],["Core support","Core Support","core-support"],
    ["Front inside panel","Front Inside Panel","front-inside-panel"],["Front side member","Front Side Member","front-side-member"],["Front pillar","Front Pillar","front-pillar"],
    ["Center pillar","Center Pillar","center-pillar"],["Rear wheel house","Rear Wheel House","rear-wheel-house"],["Dash panel","Dash Panel","dash-panel"],
    ["Center floor panel","Center Floor Panel","center-floor-panel"],["Floor cross member","Floor Cross Member","floor-cross-member"],["Floor side member","Floor Side Member","floor-side-member"],
    ["Rear floor panel","Rear Floor Panel","rear-floor-panel"],["Rear inside panel","Rear Inside Panel","rear-inside-panel"],["Rear side member","Rear Side Member","rear-side-member"],
    ["Rear cross member","Rear Cross Member","rear-cross-member"],["RH rear fender panel","RH Rear Fender Panel","rh-rear-fender"],["LH rear fender panel","LH Rear Fender Panel","lh-rear-fender"],
    ["RH rocker panel","RH Rocker Panel","rh-rocker"],["LH rocker panel","LH Rocker Panel","lh-rocker"],["End panel","End Panel","chassis-end-panel"],["Roof panel","Roof Panel","roof-panel"]
  ])
};

const MODES: {id:Mode; label:string; icon:"body"|"cabin"|"engine"|"transmission"|"brakes"|"steering"|"electrical"|"tyres"|"chassis";}[] = [
  {id:"Exterior",label:"Exterior",icon:"body"},{id:"Interior",label:"Interior",icon:"cabin"},{id:"Engine",label:"Engine",icon:"engine"},
  {id:"Transmission",label:"Transmission",icon:"transmission"},{id:"Brakes",label:"Brakes",icon:"brakes"},{id:"Steering",label:"Steering / suspension",icon:"steering"},
  {id:"Electrical",label:"Electrical",icon:"electrical"},{id:"Tyres",label:"Tyres",icon:"tyres"},{id:"Chassis",label:"Chassis / frame",icon:"chassis"}
];

function defaultMode(section:string):Mode {
  if(section==="Exterior"||section==="Interior") return section;
  if(section==="Mechanical") return "Engine";
  if(section==="Electrical") return "Electrical";
  if(section==="Tyres") return "Tyres";
  if(section==="Road Test") return "Transmission";
  return "Chassis";
}

function Diagram({mode,selected}:{mode:Mode;selected:Part}) {
  const selectedLabel = selected.label.length>36 ? selected.label.slice(0,33)+"…" : selected.label;
  const shared = <g fill="none" stroke="#88a5bd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>;
  return (
    <svg className="om-diagram-svg" viewBox="0 0 720 300" role="img" aria-label={mode+" 2D labelled inspection diagram"}>
      <defs>
        <pattern id="omBlueprintGrid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#dce8f1" strokeWidth=".65"/></pattern>
      </defs>
      <rect x="0" y="0" width="720" height="300" rx="12" fill="#f8fbfe"/>
      <rect x="0" y="0" width="720" height="300" rx="12" fill="url(#omBlueprintGrid)"/>
      {mode==="Exterior"&&<g stroke="#325676" strokeWidth="2" strokeLinejoin="round">
        <path d="M260 24 Q220 34 210 78 L190 119 L190 217 L215 252 Q232 275 260 278 L460 278 Q488 275 505 252 L530 217 L530 119 L510 78 Q500 34 460 24 Z" fill="#e6f1fa"/>
        <rect x="258" y="44" width="204" height="43" rx="8" fill="#c1dcec"/><rect x="245" y="92" width="230" height="54" rx="9" fill="#d3e6f4"/>
        <path d="M245 151H475V235Q460 252 442 252H278Q260 252 245 235Z" fill="#c9deee"/>
        <rect x="250" y="159" width="220" height="50" rx="5" fill="#e4f0f8"/><rect x="250" y="213" width="220" height="29" rx="5" fill="#c1dcec"/>
        <rect x="172" y="81" width="35" height="54" rx="8" fill="#314b62"/><rect x="513" y="81" width="35" height="54" rx="8" fill="#314b62"/><rect x="172" y="190" width="35" height="54" rx="8" fill="#314b62"/><rect x="513" y="190" width="35" height="54" rx="8" fill="#314b62"/>
        <rect x="270" y="14" width="180" height="16" rx="5" fill="#91b9d4"/><rect x="270" y="273" width="180" height="13" rx="4" fill="#91b9d4"/>
        <rect x="279" y="97" width="66" height="43" rx="6" fill="#eaf5fc"/><rect x="375" y="97" width="66" height="43" rx="6" fill="#eaf5fc"/>
        <rect x="279" y="163" width="66" height="40" rx="5" fill="#eaf5fc"/><rect x="375" y="163" width="66" height="40" rx="5" fill="#eaf5fc"/>
        <path d="M226 112H262 M458 112H494 M226 185H262 M458 185H494" stroke="#4a7797" strokeWidth="3"/>
        <text x="360" y="70" fill="#294965" stroke="none" textAnchor="middle" fontSize="12" fontWeight="700">WINDSHIELD / GLASS</text>
        <text x="360" y="121" fill="#294965" stroke="none" textAnchor="middle" fontSize="13" fontWeight="700">BONNET / HOOD</text>
        <text x="360" y="185" fill="#294965" stroke="none" textAnchor="middle" fontSize="12" fontWeight="700">ROOF / DOORS</text>
        <text x="360" y="233" fill="#294965" stroke="none" textAnchor="middle" fontSize="11" fontWeight="700">TRUNK / REAR PANEL</text>
        <text x="145" y="159" fill="#294965" stroke="none" textAnchor="middle" fontSize="11" fontWeight="700">LEFT</text><text x="575" y="159" fill="#294965" stroke="none" textAnchor="middle" fontSize="11" fontWeight="700">RIGHT</text>
        <text x="360" y="296" fill="#607f99" stroke="none" textAnchor="middle" fontSize="10">2D BODY-PANEL MAP · NOT A VEHICLE MODEL</text>
      </g>}
      {mode==="Interior"&&<g stroke="#325676" strokeWidth="2" strokeLinejoin="round">
        <rect x="135" y="25" width="450" height="250" rx="35" fill="#e5f1f9"/>
        <path d="M200 45 Q360 20 520 45 L500 92 H220Z" fill="#bbd8eb"/><text x="360" y="62" fill="#294965" stroke="none" textAnchor="middle" fontSize="12" fontWeight="700">DASHBOARD / CLUSTER</text>
        <rect x="225" y="105" width="105" height="54" rx="9" fill="#bad6e8"/><rect x="390" y="105" width="105" height="54" rx="9" fill="#bad6e8"/>
        <text x="277" y="136" fill="#294965" stroke="none" textAnchor="middle" fontSize="11" fontWeight="700">DRIVER SEAT</text><text x="442" y="136" fill="#294965" stroke="none" textAnchor="middle" fontSize="10" fontWeight="700">PASSENGER SEAT</text>
        <rect x="215" y="174" width="290" height="37" rx="8" fill="#d0e4f2"/><text x="360" y="197" fill="#294965" stroke="none" textAnchor="middle" fontSize="11" fontWeight="700">SECOND ROW</text>
        <rect x="250" y="223" width="220" height="32" rx="8" fill="#d0e4f2"/><text x="360" y="244" fill="#294965" stroke="none" textAnchor="middle" fontSize="10" fontWeight="700">THIRD ROW / BOOT</text>
        <path d="M205 97H515 M205 166H515 M205 215H515" stroke="#7ea8c6" strokeDasharray="4 4"/>
        <text x="360" y="290" fill="#607f99" stroke="none" textAnchor="middle" fontSize="10">2D CABIN / TRIM MAP · SELECT A LABEL BELOW</text>
      </g>}
      {mode==="Chassis"&&<g stroke="#325676" strokeWidth="2" strokeLinejoin="round">
        <rect x="242" y="20" width="236" height="260" rx="14" fill="#e4f0f8"/>
        <rect x="263" y="32" width="25" height="235" rx="6" fill="#8eb5d2"/><rect x="432" y="32" width="25" height="235" rx="6" fill="#8eb5d2"/>
        {[55,86,118,151,186,220,250].map((y,i)=><g key={y}><rect x="274" y={y} width="172" height={i===0||i===6?9:7} rx="2" fill={i===0||i===6?"#5889af":"#aac9e0"}/></g>)}
        <rect x="202" y="55" width="37" height="47" rx="8" fill="#314b62"/><rect x="481" y="55" width="37" height="47" rx="8" fill="#314b62"/>
        <rect x="202" y="203" width="37" height="47" rx="8" fill="#314b62"/><rect x="481" y="203" width="37" height="47" rx="8" fill="#314b62"/>
        <text x="360" y="48" fill="#294965" stroke="none" textAnchor="middle" fontSize="10" fontWeight="700">FRONT CROSS MEMBER</text>
        <text x="360" y="103" fill="#294965" stroke="none" textAnchor="middle" fontSize="10" fontWeight="700">CORE SUPPORT</text>
        <text x="360" y="143" fill="#294965" stroke="none" textAnchor="middle" fontSize="10" fontWeight="700">FRONT / CENTER PILLARS</text>
        <text x="360" y="179" fill="#294965" stroke="none" textAnchor="middle" fontSize="10" fontWeight="700">CENTER FLOOR / DASH</text>
        <text x="360" y="211" fill="#294965" stroke="none" textAnchor="middle" fontSize="10" fontWeight="700">REAR FLOOR PANEL</text>
        <text x="360" y="263" fill="#294965" stroke="none" textAnchor="middle" fontSize="10" fontWeight="700">REAR CROSS MEMBER</text>
        <text x="360" y="295" fill="#607f99" stroke="none" textAnchor="middle" fontSize="10">2D LADDER-FRAME REFERENCE · FRONT ↑</text>
      </g>}
      {mode==="Engine"&&<g stroke="#325676" strokeWidth="2" strokeLinejoin="round">
        <rect x="175" y="35" width="370" height="230" rx="18" fill="#e5f1f9"/>
        <rect x="250" y="70" width="220" height="150" rx="14" fill="#b9d7ea"/>
        <rect x="277" y="89" width="166" height="45" rx="7" fill="#e9f4fb"/><text x="360" y="116" fill="#294965" stroke="none" textAnchor="middle" fontSize="13" fontWeight="700">ENGINE BLOCK</text>
        <rect x="277" y="150" width="76" height="45" rx="7" fill="#91b9d4"/><text x="315" y="177" fill="#294965" stroke="none" textAnchor="middle" fontSize="10" fontWeight="700">COOLING</text>
        <rect x="367" y="150" width="76" height="45" rx="7" fill="#91b9d4"/><text x="405" y="177" fill="#294965" stroke="none" textAnchor="middle" fontSize="10" fontWeight="700">BELTS</text>
        <rect x="195" y="82" width="40" height="112" rx="5" fill="#c8e0f0"/><text x="215" y="135" fill="#294965" stroke="none" textAnchor="middle" fontSize="9" fontWeight="700" transform="rotate(-90 215 135)">RADIATOR</text>
        <path d="M235 122H277 M443 121H510 M315 195V237 M405 195V237" stroke="#5a8fb2" strokeWidth="3"/>
        <text x="360" y="290" fill="#607f99" stroke="none" textAnchor="middle" fontSize="10">ENGINE / COOLING / LEAKAGE / NOISE CHECKS</text>
      </g>}
      {mode==="Transmission"&&<g stroke="#325676" strokeWidth="2" strokeLinejoin="round">
        <rect x="45" y="113" width="120" height="72" rx="12" fill="#d3e7f4"/><rect x="215" y="98" width="115" height="102" rx="12" fill="#a8cce4"/><rect x="390" y="113" width="105" height="72" rx="12" fill="#d3e7f4"/><rect x="555" y="105" width="115" height="88" rx="12" fill="#a8cce4"/>
        <path d="M165 149H215 M330 149H390 M495 149H555" stroke="#4d83a8" strokeWidth="6"/><path d="M198 139L211 149 198 159 M373 139L386 149 373 159 M538 139L551 149 538 159" fill="none" stroke="#4d83a8" strokeWidth="3"/>
        <text x="105" y="153" fill="#294965" stroke="none" textAnchor="middle" fontSize="13" fontWeight="700">CLUTCH</text><text x="272" y="145" fill="#294965" stroke="none" textAnchor="middle" fontSize="12" fontWeight="700">GEARBOX</text><text x="442" y="153" fill="#294965" stroke="none" textAnchor="middle" fontSize="11" fontWeight="700">DRIVE SHAFT</text><text x="612" y="143" fill="#294965" stroke="none" textAnchor="middle" fontSize="12" fontWeight="700">DIFFERENTIAL</text>
        <text x="360" y="235" fill="#607f99" stroke="none" textAnchor="middle" fontSize="11">SHIFTING · OIL LEAK · SHOCK / TIME LAG · BEARINGS</text><text x="360" y="290" fill="#607f99" stroke="none" textAnchor="middle" fontSize="10">2D DRIVETRAIN FLOW · NOT A MECHANICAL MODEL</text>
      </g>}
      {mode==="Brakes"&&<g stroke="#325676" strokeWidth="2" strokeLinejoin="round">
        {[{x:195,y:83,t:"FRONT LEFT"},{x:525,y:83,t:"FRONT RIGHT"},{x:195,y:208,t:"REAR LEFT"},{x:525,y:208,t:"REAR RIGHT"}].map(p=><g key={p.t}>
          <rect x={p.x-43} y={p.y-30} width="86" height="60" rx="8" fill="#314b62"/>
          <circle cx={p.x} cy={p.y} r="24" fill="#cde2f0" stroke="#91b9d4" strokeWidth="6"/><circle cx={p.x} cy={p.y} r="12" fill="#89acc6"/><circle cx={p.x} cy={p.y} r="4" fill="#eef7fd"/>
          <text x={p.x} y={p.y+43} fill="#294965" stroke="none" textAnchor="middle" fontSize="10" fontWeight="700">{p.t}</text>
        </g>)}
        <path d="M195 83H360V145 M525 83H360 M195 208H360V155 M525 208H360" stroke="#5a8fb2" strokeWidth="4" fill="none"/>
        <rect x="305" y="116" width="110" height="66" rx="9" fill="#e2f0f9"/><text x="360" y="139" fill="#294965" stroke="none" textAnchor="middle" fontSize="12" fontWeight="700">BRAKE</text><text x="360" y="155" fill="#294965" stroke="none" textAnchor="middle" fontSize="12" fontWeight="700">HYDRAULICS</text><text x="360" y="173" fill="#486e8a" stroke="none" textAnchor="middle" fontSize="9">DISC / ABS</text>
        <text x="360" y="290" fill="#607f99" stroke="none" textAnchor="middle" fontSize="10">BRAKE DISCS · PEDAL · RESPONSE · NOISE · ABS</text>
      </g>}
      {mode==="Steering"&&<g stroke="#325676" strokeWidth="2" strokeLinejoin="round">
        <rect x="250" y="28" width="220" height="245" rx="16" fill="#e5f1f9"/><rect x="280" y="54" width="160" height="190" rx="8" fill="#c5deee"/>
        {[{x:220,y:80,t:"FL"},{x:500,y:80,t:"FR"},{x:220,y:225,t:"RL"},{x:500,y:225,t:"RR"}].map(p=><g key={p.t}><rect x={p.x-22} y={p.y-28} width="44" height="56" rx="9" fill="#314b62"/><circle cx={p.x} cy={p.y} r="12" fill="#9dc2db"/></g>)}
        <path d="M242 80H280 M440 80H478 M242 225H280 M440 225H478" stroke="#5a8fb2" strokeWidth="5"/>
        <path d="M360 79V220 M320 119H400 M320 180H400" stroke="#5a8fb2" strokeWidth="7"/>
        <text x="360" y="103" fill="#294965" stroke="none" textAnchor="middle" fontSize="11" fontWeight="700">STEERING RACK</text><text x="360" y="156" fill="#294965" stroke="none" textAnchor="middle" fontSize="11" fontWeight="700">CHASSIS</text><text x="360" y="204" fill="#294965" stroke="none" textAnchor="middle" fontSize="10" fontWeight="700">SUSPENSION ARMS</text>
        <text x="360" y="290" fill="#607f99" stroke="none" textAnchor="middle" fontSize="10">SHOCKS · ARMS · ALIGNMENT · STEERING / BOOTS</text>
      </g>}
      {mode==="Electrical"&&<g stroke="#325676" strokeWidth="2" strokeLinejoin="round">
        <rect x="38" y="28" width="145" height="82" rx="10" fill="#b9d7ea"/><rect x="218" y="28" width="145" height="82" rx="10" fill="#d6e8f4"/><rect x="398" y="28" width="130" height="82" rx="10" fill="#b9d7ea"/><rect x="565" y="28" width="120" height="82" rx="10" fill="#d6e8f4"/>
        <rect x="75" y="52" width="70" height="32" rx="5" fill="#eaf5fc"/><text x="110" y="72" fill="#294965" stroke="none" textAnchor="middle" fontSize="11" fontWeight="700">BATTERY</text><text x="290" y="68" fill="#294965" stroke="none" textAnchor="middle" fontSize="12" fontWeight="700">FUSE BOX</text><text x="463" y="68" fill="#294965" stroke="none" textAnchor="middle" fontSize="11" fontWeight="700">CONTROL ECU</text><text x="625" y="68" fill="#294965" stroke="none" textAnchor="middle" fontSize="11" fontWeight="700">ALTERNATOR</text>
        <path d="M183 68H218 M363 68H398 M528 68H565" stroke="#5a8fb2" strokeWidth="4"/>
        <rect x="100" y="170" width="170" height="72" rx="9" fill="#d6e8f4"/><rect x="340" y="170" width="170" height="72" rx="9" fill="#b9d7ea"/><rect x="580" y="170" width="100" height="72" rx="9" fill="#d6e8f4"/>
        <path d="M290 110V142H185V170 M290 142H425V170 M463 110V142H630V170" stroke="#5a8fb2" strokeWidth="3" fill="none"/>
        <text x="185" y="199" fill="#294965" stroke="none" textAnchor="middle" fontSize="11" fontWeight="700">LAMPS / WIPERS</text><text x="185" y="217" fill="#294965" stroke="none" textAnchor="middle" fontSize="9">LIGHTING CIRCUIT</text><text x="425" y="199" fill="#294965" stroke="none" textAnchor="middle" fontSize="11" fontWeight="700">WINDOWS / LOCKS</text><text x="425" y="217" fill="#294965" stroke="none" textAnchor="middle" fontSize="9">CABIN CIRCUIT</text><text x="630" y="210" fill="#294965" stroke="none" textAnchor="middle" fontSize="10" fontWeight="700">SENSORS</text>
        <text x="360" y="290" fill="#607f99" stroke="none" textAnchor="middle" fontSize="10">POWER · LIGHTING · WINDOWS · AUDIO · WARNING LAMPS</text>
      </g>}
      {mode==="Tyres"&&<g stroke="#325676" strokeWidth="2" strokeLinejoin="round">
        {[{x:230,y:76,t:"FRONT LEFT"},{x:490,y:76,t:"FRONT RIGHT"},{x:230,y:206,t:"REAR LEFT"},{x:490,y:206,t:"REAR RIGHT"}].map(p=><g key={p.t}><rect x={p.x-48} y={p.y-31} width="96" height="62" rx="11" fill="#314b62"/><circle cx={p.x} cy={p.y} r="23" fill="#e0eef8" stroke="#8db1cc" strokeWidth="5"/><circle cx={p.x} cy={p.y} r="8" fill="#94b9d3"/><text x={p.x} y={p.y+46} fill="#294965" stroke="none" textAnchor="middle" fontSize="10" fontWeight="700">{p.t}</text></g>)}
        <path d="M230 107V175H490V107" fill="none" stroke="#8ab2cf" strokeWidth="4" strokeDasharray="6 6"/>
        <rect x="316" y="118" width="88" height="52" rx="8" fill="#d3e7f4"/><text x="360" y="140" fill="#294965" stroke="none" textAnchor="middle" fontSize="11" fontWeight="700">TYRE SET</text><text x="360" y="155" fill="#294965" stroke="none" textAnchor="middle" fontSize="9">TREAD / SIDEWALL</text>
        <circle cx="360" cy="232" r="22" fill="#314b62"/><circle cx="360" cy="232" r="12" fill="#d3e7f4"/><text x="400" y="236" fill="#294965" stroke="none" textAnchor="start" fontSize="11" fontWeight="700">SPARE TYRE</text>
        <text x="360" y="290" fill="#607f99" stroke="none" textAnchor="middle" fontSize="10">POSITION · TREAD · UNEVEN WEAR · SIDEWALL</text>
      </g>}
      <g><rect x="10" y="10" width="200" height="25" rx="7" fill="#ffffff" stroke="#c4d6e4"/><text x="20" y="27" fill="#294965" fontSize="11" fontWeight="700">{mode.toUpperCase()} · 2D INSPECTION MAP</text></g>
      <g><rect x="510" y="265" width="200" height="25" rx="7" fill="#ffffff" stroke="#c4d6e4"/><text x="520" y="282" fill="#294965" fontSize="10" fontWeight="700">SELECTED: {selectedLabel.toUpperCase()}</text></g>
    </svg>
  );
}

function Icon({icon}:{icon:(typeof MODES)[number]["icon"]}) {
  if(icon==="engine")return <Activity size={13}/>;
  if(icon==="transmission")return <Layers3 size={13}/>;
  if(icon==="brakes")return <CircleDot size={13}/>;
  if(icon==="steering")return <Wrench size={13}/>;
  if(icon==="electrical")return <BatteryCharging size={13}/>;
  if(icon==="tyres")return <Gauge size={13}/>;
  if(icon==="chassis")return <Layers3 size={13}/>;
  if(icon==="cabin")return <ShieldCheck size={13}/>;
  return <ScanLine size={13}/>;
}

const FRAME_CODES = [
  {value:"D0",label:"D0 · No frame damage"},
  {value:"S",label:"S · Small"},
  {value:"M",label:"M · Medium"},
  {value:"L",label:"L · Large"},
  {value:"R",label:"R · Replaced"},
  {value:"NT",label:"NT · Not inspected"},
  {value:"NA",label:"NA · Not applicable"}
];

export function VehicleModelViewer({section,onApply}:Props) {
  const [mode,setMode]=useState<Mode>(()=>defaultMode(section));
  const [pickedKey,setPickedKey]=useState("");
  const [status,setStatus]=useState("0");
  const parts=PARTS[mode];
  const picked=useMemo(()=>parts.find(part=>part.meshName===pickedKey)??parts[0],[parts,pickedKey]);
  const isFrame=picked.section==="Frame";
  const options=isFrame?FRAME_CODES:conditionOptionsFor(picked.section,status);
  useEffect(()=>{setMode(defaultMode(section));setPickedKey("");setStatus(section==="Frame"?"D0":"0");},[section]);

  function selectMode(next:Mode) {
    setMode(next);
    setPickedKey("");
    setStatus(next==="Chassis"?"D0":"0");
  }
  function selectPart(part:Part) {
    setPickedKey(part.meshName);
    setStatus(part.section==="Frame"?"D0":"0");
  }

  return (
    <section className="om-model-panel om-diagram-panel" aria-label="2D part-by-part inspection reference">
      <div className="om-model-top">
        <div className="om-model-title"><span className="om-model-icon"><Layers3 size={17}/></span><div><b>2D inspection reference map</b><small>Fast schematic · labeled components · no external vehicle viewer</small></div></div>
        <span className="om-model-badge">2D GUIDE</span>
      </div>
      <div className="om-model-shortcuts om-diagram-tabs" role="tablist" aria-label="Inspection system diagrams">
        {MODES.map(item=><button type="button" key={item.id} role="tab" aria-selected={mode===item.id} className={mode===item.id?"active":""} onClick={()=>selectMode(item.id)}><Icon icon={item.icon}/>{item.label}</button>)}
      </div>
      <div className="om-diagram-visual"><Diagram mode={mode} selected={picked}/></div>
      <div className="om-diagram-help"><b>{mode} map</b><span>{isFrame?"Frame codes: D0 no damage, S small, M medium, L large, R replaced.":picked.section==="Exterior"||picked.section==="Interior"?"P = paint/surface, B = shape changed, X = cut/crack/hole/missing. Append level 1–3.":"0 = no defect, S = small defect, L = large defect, NT = not inspected, NA = not applicable."}</span></div>
      <div className="om-diagram-parts" aria-label={mode+" parts"}>
        {parts.map(part=><button type="button" key={part.meshName} className={picked.meshName===part.meshName?"active":""} aria-pressed={picked.meshName===part.meshName} onClick={()=>selectPart(part)}>{part.label}</button>)}
      </div>
      <div className="om-model-bottom">
        <div className="om-model-selection"><span className="om-model-status-dot"/><div><b>{picked.label}</b><small>{picked.section==="Frame"?"Frame accident worksheet [Z]":picked.section+" checklist"} · selected component</small></div></div>
        <div className="om-model-actions">
          <label className="om-fortuner-code-label"><span>Inspection code</span><select aria-label={"Inspection code for "+picked.label} value={status} onChange={event=>setStatus(event.target.value)}>{options.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          <button type="button" className="om-model-apply" onClick={()=>onApply(picked,status)}><ShieldCheck size={13}/> Apply selection</button>
        </div>
      </div>
    </section>
  );
}

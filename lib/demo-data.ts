export const demoInspections = [
  { id:"INS-2026-00184", inspection_number:"INS-2026-00184", vehicle:"Hyundai Creta", registration:"KA01AB1234", customer:"Sameer Khan", type:"Used Car", inspector:"Arun", status:"COMPLETED", score:82, generated:"16 Sep 2026 10:22 AM" },
  { id:"INS-2026-00185", inspection_number:"INS-2026-00185", vehicle:"Tata Nexon EV", registration:"KA05MX4455", customer:"Imran Ali", type:"Re-inspection", inspector:"Farhan", status:"IN_REVIEW", score:78, generated:"16 Sep 2026 12:40 PM" },
  { id:"INS-2026-00186", inspection_number:"INS-2026-00186", vehicle:"Mahindra XUV700", registration:"KA03PK9001", customer:"Prakash", type:"Used Car", inspector:"Rahul", status:"IN_PROGRESS", score:null, generated:"16 Sep 2026 01:12 PM" },
  { id:"INS-2026-00187", inspection_number:"INS-2026-00187", vehicle:"Maruti Baleno", registration:"KA51MN2222", customer:"Ayesha", type:"New Car", inspector:"Arun", status:"DRAFT", score:null, generated:"16 Sep 2026 01:28 PM" },
];
export const demoVehicles = [
  { vehicle:"Hyundai Creta SX(O)", registration:"KA01AB1234", vin:"MAKBB123456789012", year:"2023", fuel:"Petrol", transmission:"Automatic", odometer:"42,560 km", score:82 },
  { vehicle:"Tata Nexon EV", registration:"KA05MX4455", vin:"MATNEXEV20240123", year:"2024", fuel:"EV", transmission:"Automatic", odometer:"21,104 km", score:78 },
];
export const demoCustomers = [
  { name:"Sameer Khan", phone:"+91 98XXXXXX10", email:"sameer@example.com", role:"Buyer", vehicles:1, last:"16 Sep 2026" },
  { name:"Imran Ali", phone:"+91 97XXXXXX20", email:"dealer account", role:"Dealer", vehicles:8, last:"16 Sep 2026" },
];
export const demoInspectors = [
  { name:"Arun Kumar", email:"arun@omcar.example", role:"Inspector", today:8, time:"13m", quality:"98%", status:"Active" },
  { name:"Farhan S.", email:"farhan@omcar.example", role:"Inspector", today:6, time:"15m", quality:"95%", status:"Active" },
  { name:"Admin User", email:"admin@omcar.example", role:"Admin", today:"—", time:"—", quality:"—", status:"Active" },
];
export const faultLibrary = [
  {name:"Oil leakage",system:"Engine",severity:"Major",description:"Visible oil leakage observed around engine area."},
  {name:"Coolant leakage",system:"Engine",severity:"Major",description:"Coolant leakage observed in engine bay."},
  {name:"Exterior scratch",system:"Body",severity:"Cosmetic",description:"Visible surface scratches on inspected body panel."},
  {name:"Dent",system:"Body",severity:"Minor",description:"Visible dent observed on inspected panel."},
  {name:"Panel repaint",system:"Body",severity:"Moderate",description:"Paint finish differs from surrounding panel."},
  {name:"Tyre wear",system:"Tyres",severity:"Moderate",description:"Tread wear observed."},
  {name:"AC cooling weak",system:"HVAC",severity:"Minor",description:"Air-conditioning cooling performance below expected level."},
  {name:"Warning light",system:"Electrical",severity:"Major",description:"Warning indicator observed on instrument cluster."},
  {name:"Brake noise",system:"Brakes",severity:"Moderate",description:"Brake noise reported or observed."},
  {name:"Steering play",system:"Steering",severity:"Major",description:"Steering play observed."},
  {name:"Cracked windshield",system:"Glass",severity:"Major",description:"Visible windshield crack."},
  {name:"Battery weak",system:"Electrical",severity:"Moderate",description:"Battery performance may require testing."}
] as const;

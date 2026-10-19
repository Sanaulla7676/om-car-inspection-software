"use client";

import { useEffect,useState } from "react";
import { AppShell } from "@/components/app-shell";
import { RefreshCw } from "lucide-react";

type Vehicle={id:string;registration_number:string;vin?:string|null;make?:string|null;model?:string|null;variant?:string|null;manufacturing_year?:number|null;fuel_type?:string|null;transmission?:string|null;odometer?:number|null;created_at:string};
export default function VehiclesPage(){const [rows,setRows]=useState<Vehicle[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
async function load(){setLoading(true);setError("");try{const r=await fetch("/api/vehicles",{cache:"no-store"});const d=await r.json().catch(()=>null);if(!r.ok)throw new Error(d?.error||"Vehicle records could not be loaded.");setRows(Array.isArray(d)?d:[])}catch(e){setError(e instanceof Error?e.message:"Vehicle records could not be loaded.")}finally{setLoading(false)}}
useEffect(()=>{void load()},[]);
return <AppShell module="vehicles"><div className="page"><div className="section-title"><div><h2>Vehicle registry</h2><p>Vehicles saved by real inspection workflows.</p></div><button className="btn" onClick={()=>void load()} disabled={loading}><RefreshCw size={14}/> Refresh</button></div>{error&&<p role="alert" className="error-message">{error}</p>}<div className="card"><div className="table-wrap"><table><thead><tr><th>Vehicle</th><th>Registration</th><th>VIN / chassis</th><th>Year</th><th>Fuel / transmission</th><th>Odometer</th></tr></thead><tbody>{rows.map(v=><tr key={v.id}><td><strong>{[v.make,v.model,v.variant].filter(Boolean).join(" ")||"Vehicle details pending"}</strong></td><td>{v.registration_number}</td><td>{v.vin||"Not recorded"}</td><td>{v.manufacturing_year||"—"}</td><td>{[v.fuel_type,v.transmission].filter(Boolean).join(" / ")||"—"}</td><td>{v.odometer==null?"—":v.odometer.toLocaleString("en-IN")+" km"}</td></tr>)}{!loading&&rows.length===0&&<tr><td colSpan={6}>No vehicles recorded yet. Vehicles will appear after an inspection is saved.</td></tr>}{loading&&<tr><td colSpan={6}>Loading vehicle records…</td></tr>}</tbody></table></div></div></div></AppShell>}

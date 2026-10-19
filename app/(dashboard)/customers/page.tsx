"use client";

import { useEffect,useState } from "react";
import { AppShell } from "@/components/app-shell";
import { RefreshCw } from "lucide-react";

type Customer={id:string;name:string;phone?:string|null;email?:string|null;customer_type?:string|null;address?:string|null;created_at:string};
export default function CustomersPage(){const [rows,setRows]=useState<Customer[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
async function load(){setLoading(true);setError("");try{const r=await fetch("/api/customers",{cache:"no-store"});const d=await r.json().catch(()=>null);if(!r.ok)throw new Error(d?.error||"Customer records could not be loaded.");setRows(Array.isArray(d)?d:[])}catch(e){setError(e instanceof Error?e.message:"Customer records could not be loaded.")}finally{setLoading(false)}}
useEffect(()=>{void load()},[]);
return <AppShell module="customers"><div className="page"><div className="section-title"><div><h2>Customer records</h2><p>Live customer details captured in your workspace.</p></div><button className="btn" onClick={()=>void load()} disabled={loading}><RefreshCw size={14}/> Refresh</button></div>{error&&<p role="alert" className="error-message">{error}</p>}<div className="card"><div className="table-wrap"><table><thead><tr><th>Name</th><th>Type</th><th>Phone</th><th>Email</th><th>Address</th><th>Added</th></tr></thead><tbody>{rows.map(c=><tr key={c.id}><td><strong>{c.name}</strong></td><td>{c.customer_type||"Buyer"}</td><td>{c.phone||"—"}</td><td>{c.email||"—"}</td><td>{c.address||"—"}</td><td>{new Date(c.created_at).toLocaleDateString("en-IN")}</td></tr>)}{!loading&&rows.length===0&&<tr><td colSpan={6}>No customers recorded yet. Customer details are saved when an inspection is created.</td></tr>}{loading&&<tr><td colSpan={6}>Loading customer records…</td></tr>}</tbody></table></div></div></div></AppShell>}

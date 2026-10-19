"use client";

import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { CalendarDays, CheckCircle2, RefreshCw } from "lucide-react";

type BookingRequest = {
  id: string;
  request_type: "inspection" | "masterclass";
  full_name: string;
  mobile: string;
  email: string | null;
  vehicle_make_model: string | null;
  model_year: number | null;
  inspection_type: string | null;
  preferred_date: string | null;
  vehicle_location: string | null;
  notes: string | null;
  experience_level: string | null;
  learning_goals: string | null;
  status: "NEW" | "CONTACTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  created_at: string;
};

const statuses: BookingRequest["status"][] = ["NEW", "CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED"];

export default function BookingRequestsPage() {
  return <AppShell module="requests"><RequestsWorkspace /></AppShell>;
}

function RequestsWorkspace() {
  const [rows, setRows] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "inspection" | "masterclass">("all");
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/booking-requests", { cache: "no-store" });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error || "Could not load requests.");
      setRows(Array.isArray(body) ? body : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function updateStatus(id: string, status: BookingRequest["status"]) {
    setBusyId(id);
    setError("");
    try {
      const response = await fetch("/api/booking-requests", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error || "Status could not be updated.");
      setRows(current => current.map(row => row.id === id ? { ...row, status } : row));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Status could not be updated.");
    } finally {
      setBusyId("");
    }
  }

  const visible = rows.filter(row => filter === "all" || row.request_type === filter);
  const fresh = rows.filter(row => row.status === "NEW").length;
  const confirmed = rows.filter(row => row.status === "CONFIRMED").length;

  return (
    <div className="page">
      <div className="section-title">
        <div><h2>Booking & course enquiries</h2><p>Public website requests saved for the authorised team. A request is not a confirmed appointment.</p></div>
        <button className="btn" onClick={() => void load()} disabled={loading}><RefreshCw size={14} /> Refresh</button>
      </div>

      <div className="grid grid-3 mb-4">
        <div className="card stat"><div><div className="label">Total requests</div><div className="num">{rows.length}</div></div><span className="chip"><CalendarDays size={13} /> Website</span></div>
        <div className="card stat"><div><div className="label">Needs follow-up</div><div className="num">{fresh}</div></div><span className="chip warn">New</span></div>
        <div className="card stat"><div><div className="label">Confirmed</div><div className="num">{confirmed}</div></div><span className="chip success"><CheckCircle2 size={13} /> Confirmed</span></div>
      </div>

      <div className="card">
        <div className="section-title">
          <div><h2 className="text-lg font-bold">Requests</h2><p>Most recent 200 enquiries</p></div>
          <div className="btn-row">
            <button className={filter === "all" ? "btn gold" : "btn"} onClick={() => setFilter("all")}>All</button>
            <button className={filter === "inspection" ? "btn gold" : "btn"} onClick={() => setFilter("inspection")}>Inspections</button>
            <button className={filter === "masterclass" ? "btn gold" : "btn"} onClick={() => setFilter("masterclass")}>Training</button>
          </div>
        </div>

        {error && <p className="error-message" role="alert">{error}</p>}
        {loading ? <p className="label">Loading requests…</p> : visible.length === 0 ? <p className="label">No requests yet. New website enquiries will appear here.</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Request</th><th>Contact</th><th>Details</th><th>Preferred date</th><th>Status</th></tr></thead>
              <tbody>
                {visible.map(row => (
                  <tr key={row.id}>
                    <td><strong>{row.request_type === "inspection" ? "Vehicle inspection" : "PDI masterclass"}</strong><div className="label">{new Date(row.created_at).toLocaleString("en-IN")}</div><div className="label">Ref: {row.id.slice(0, 8).toUpperCase()}</div></td>
                    <td><strong>{row.full_name}</strong><div><a href={"tel:" + row.mobile}>{row.mobile}</a></div>{row.email && <div><a href={"mailto:" + row.email}>{row.email}</a></div>}<div><a href={"https://wa.me/" + row.mobile.replace(/\D/g, "")} target="_blank" rel="noreferrer">WhatsApp</a></div></td>
                    <td>{row.request_type === "inspection" ? <><strong>{row.vehicle_make_model || "Vehicle not specified"}</strong><div className="label">{row.inspection_type || "Inspection type not specified"}{row.model_year ? " · " + row.model_year : ""}</div><div className="label">{row.vehicle_location || ""}</div><div className="label">{row.notes || ""}</div></> : <><strong>{row.experience_level || "Experience not specified"}</strong><div className="label">{row.learning_goals || ""}</div></>}</td>
                    <td>{row.preferred_date ? new Date(row.preferred_date + "T12:00:00").toLocaleDateString("en-IN") : "Not specified"}</td>
                    <td><select aria-label={"Status for " + row.full_name} value={row.status} disabled={busyId === row.id} onChange={event => void updateStatus(row.id, event.target.value as BookingRequest["status"])}>{statuses.map(status => <option key={status} value={status}>{status.replace("_", " ")}</option>)}</select></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

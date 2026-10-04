"use client";

import { useMemo } from "react";
import { ArrowUpRight, CalendarDays, Camera, CarFront, CheckCircle2, CircleAlert, FileText, Gauge, MapPin, Plus, RefreshCw, ShieldCheck, Upload, Users } from "lucide-react";
import { demoCustomers, demoInspections, demoVehicles } from "@/lib/demo-data";

const bars = [46,58,51,72,66,82,76];
const countries = [
  ["Bengaluru","124","24%"],
  ["Mysuru","86","17%"],
  ["Mangaluru","58","11%"],
  ["Hubballi","44","9%"]
];

export function ProfessionalDashboard() {
  const completed = demoInspections.filter((x) => x.status === "COMPLETED").length;
  const avgScore = useMemo(() => {
    const scores = demoInspections.map((x) => x.score).filter((x): x is number => typeof x === "number");
    return scores.length ? Math.round(scores.reduce((a,b) => a+b,0) / scores.length) : 0;
  }, []);

  return (
    <div className="pro-dashboard">
      <section className="pro-welcome">
        <div>
          <div className="eyebrow">OPERATIONS OVERVIEW</div>
          <h1>Inspection command center</h1>
          <p>Everything your inspection team needs, arranged for fast decisions instead of dashboard archaeology.</p>
        </div>
        <div className="pro-welcome-actions">
          <span className="live-pill"><span /> Live</span>
          <button className="pro-btn pro-btn-dark"><CalendarDays size={16}/> Today</button>
        </div>
      </section>

      <section className="pro-kpis">
        <div className="pro-kpi primary">
          <div className="kpi-top"><span>Total inspections</span><ArrowUpRight size={16}/></div>
          <strong>486</strong>
          <div className="kpi-bottom"><span className="trend up">+12.4%</span><span>vs last month</span></div>
        </div>
        <div className="pro-kpi">
          <div className="kpi-top"><span>Completed today</span><CheckCircle2 size={16}/></div>
          <strong>{18 + completed}</strong>
          <div className="kpi-bottom"><span className="trend up">+8.1%</span><span>healthy throughput</span></div>
        </div>
        <div className="pro-kpi">
          <div className="kpi-top"><span>Average score</span><Gauge size={16}/></div>
          <strong>{avgScore || "81"}</strong>
          <div className="kpi-bottom"><span className="trend up">+2.7%</span><span>quality index</span></div>
        </div>
        <div className="pro-kpi">
          <div className="kpi-top"><span>Action required</span><CircleAlert size={16}/></div>
          <strong>12</strong>
          <div className="kpi-bottom"><span className="trend down">4 critical</span><span>needs review</span></div>
        </div>
      </section>

      <section className="pro-grid main">
        <div className="pro-card span-2">
          <div className="pro-card-head">
            <div><h2>Inspection activity</h2><p>Weekly completed inspections</p></div>
            <select defaultValue="This week"><option>This week</option><option>Last 30 days</option><option>Quarter</option></select>
          </div>
          <div className="activity-chart">
            <div className="y-grid"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div>
            <div className="bars">{bars.map((h,i)=><div className="bar-column" key={i}><div className="bar" style={{height: h+"%"}}/><small>{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</small></div>)}</div>
          </div>
        </div>

        <div className="pro-card health-card">
          <div className="pro-card-head"><div><h2>Vehicle health</h2><p>Current fleet condition</p></div><ShieldCheck size={18}/></div>
          <div className="health-ring"><div><strong>81</strong><span>Avg score</span></div></div>
          <div className="health-legend">
            <span><i className="dot good"/><b>Good</b> 58%</span>
            <span><i className="dot fair"/><b>Fair</b> 27%</span>
            <span><i className="dot poor"/><b>Poor</b> 15%</span>
          </div>
        </div>

        <div className="pro-card span-2">
          <div className="pro-card-head"><div><h2>Recent inspections</h2><p>Latest work across your team</p></div><button className="pro-link">View all <ArrowUpRight size={15}/></button></div>
          <div className="pro-table">
            <div className="pro-row head"><span>Inspection</span><span>Vehicle</span><span>Inspector</span><span>Score</span><span>Status</span></div>
            {demoInspections.slice(0,4).map((x) => (
              <div className="pro-row" key={x.id}>
                <span><b>{x.inspection_number}</b><small>{x.generated}</small></span>
                <span><b>{x.vehicle}</b><small>{x.registration}</small></span>
                <span>{x.inspector}</span>
                <span><strong className={x.score && x.score >= 80 ? "score-good" : "score-watch"}>{x.score ?? "—"}</strong></span>
                <span><em className={x.status === "COMPLETED" ? "status-done" : x.status === "IN_REVIEW" ? "status-review" : "status-live"}>{x.status.replaceAll("_"," ")}</em></span>
              </div>
            ))}
          </div>
        </div>

        <div className="pro-card orders">
          <div className="pro-card-head"><div><h2>Work by location</h2><p>Inspection volume</p></div><MapPin size={18}/></div>
          <div className="location-list">
            {countries.map(([city,count,share]) => <div className="location-item" key={city}><div className="avatar-dot">{city[0]}</div><div className="flex-1"><b>{city}</b><small>{count} inspections</small></div><span>{share}</span></div>)}
          </div>
        </div>

        <div className="pro-card">
          <div className="pro-card-head"><div><h2>Quick actions</h2><p>One tap, no treasure hunting.</p></div></div>
          <div className="quick-grid">
            <button><Plus size={18}/><span>New inspection</span></button>
            <button><Camera size={18}/><span>Capture evidence</span></button>
            <button><FileText size={18}/><span>Open reports</span></button>
            <button><Upload size={18}/><span>Import document</span></button>
          </div>
          <div className="sync-strip"><RefreshCw size={15}/><span>Offline queue ready</span><b>12 items</b></div>
        </div>

        <div className="pro-card">
          <div className="pro-card-head"><div><h2>Team snapshot</h2><p>People and workload</p></div><Users size={18}/></div>
          <div className="team-stats">
            <div><strong>8</strong><span>Inspectors</span></div>
            <div><strong>34</strong><span>Today</span></div>
            <div><strong>95%</strong><span>Quality</span></div>
          </div>
          <div className="tiny-vehicle-line"><CarFront size={15}/><span>{demoVehicles.length} active vehicles</span><ArrowUpRight size={14}/></div>
          <div className="tiny-vehicle-line"><Users size={15}/><span>{demoCustomers.length} customer accounts</span><ArrowUpRight size={14}/></div>
        </div>
      </section>
    </div>
  );
}

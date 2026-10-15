import Link from "next/link";

export default function AdminMockPage() {
  return (
    <main className="admin-mock-shell">
      <div className="admin-mock-bar">
        <div className="admin-mock-brand"><span className="admin-mock-dot">OM</span><div><b>OM CAR INSPECTION</b><small>ADMIN WORKSPACE · MOCK MODE</small></div></div>
        <div className="admin-mock-status"><span /> No password · demo data only</div>
        <Link href="/" className="admin-mock-return">Open public website ↗</Link>
      </div>
      <iframe title="Vehicle inspection software mock admin" src="/admin-mock.html" className="admin-mock-frame" />
      <style jsx global>{`
.admin-mock-shell { min-height:100vh; height:100vh; display:flex; flex-direction:column; background:#e9eaee; color:#161b2a; font-family:Arial,sans-serif; }
.admin-mock-bar { min-height:54px; display:flex; align-items:center; gap:24px; padding:9px 20px; background:#121824; color:#fff; }
.admin-mock-brand { display:flex; align-items:center; gap:10px; min-width:240px; }
.admin-mock-dot { display:grid; place-items:center; width:32px; height:32px; background:#e11d48; border-radius:8px; font-size:11px; font-weight:900; }
.admin-mock-brand b,.admin-mock-brand small { display:block; }
.admin-mock-brand b { font-size:11px; letter-spacing:.09em; }
.admin-mock-brand small { margin-top:4px; font-size:8px; color:#a4afc0; letter-spacing:.1em; }
.admin-mock-status { display:flex; align-items:center; gap:8px; color:#cad1dc; font-size:10px; }
.admin-mock-status span { width:7px; height:7px; border-radius:50%; background:#fda4af; box-shadow:0 0 0 4px rgba(225,29,72,.14); }
.admin-mock-return { margin-left:auto; font-size:11px; font-weight:700; color:#fff; text-decoration:none; border:1px solid #465063; padding:9px 12px; white-space:nowrap; }
.admin-mock-return:hover { border-color:#fb7185; }
.admin-mock-frame { display:block; width:100%; height:calc(100vh - 54px); flex:1; border:0; background:#eef0f4; }
@media(max-width:640px) { .admin-mock-bar { flex-wrap:wrap; gap:8px 12px; padding:9px 12px; } .admin-mock-brand { min-width:0; flex:1; } .admin-mock-status { order:3; width:100%; } .admin-mock-return { margin-left:0; padding:7px 9px; font-size:10px; } }
`}</style>
    </main>
  );
}

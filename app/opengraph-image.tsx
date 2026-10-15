import { ImageResponse } from "next/og";

export const alt = "OM Car Inspection — Inspect, learn and build with evidence-led vehicle checks";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "66px 76px", background: "linear-gradient(135deg, #0b0e13 0%, #192637 62%, #0b0e13 100%)", color: "#ffffff", fontFamily: "Arial, sans-serif", position: "relative" }}>
        <div style={{ position: "absolute", right: -100, top: -155, width: 640, height: 640, borderRadius: 320, border: "1px solid rgba(255,255,255,.16)", boxShadow: "0 0 0 50px rgba(255,255,255,.025), 0 0 0 110px rgba(255,255,255,.02)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 72, height: 72, borderRadius: 22, background: "#ff6846", color: "#ffffff", fontSize: 31, fontWeight: 800 }}>OM.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2 }}>OM CAR INSPECTION</div>
            <div style={{ fontSize: 13, color: "#b2becc", letterSpacing: 4 }}>INSPECT · LEARN · BUILD</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 17, maxWidth: 960 }}>
          <div style={{ fontSize: 19, color: "#ff967e", letterSpacing: 4, fontWeight: 700 }}>EVIDENCE-LED VEHICLE CHECKS</div>
          <div style={{ fontSize: 70, lineHeight: 1.02, fontWeight: 800, letterSpacing: -3 }}>Inspect before you buy.</div>
          <div style={{ fontSize: 24, lineHeight: 1.45, color: "#d4dce5" }}>Used-car inspection · New-car PDI · Practical inspection learning</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 15, color: "#bac6d4", borderTop: "1px solid rgba(255,255,255,.17)", paddingTop: 20 }}>
          <span>Clear observations. Useful next steps.</span>
          <span>OM CAR INSPECTION</span>
        </div>
      </div>
    ),
    { ...size }
  );
}

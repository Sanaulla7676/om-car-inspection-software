"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Home, LockKeyhole, LogOut, RefreshCw, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Props = { loginId: string; accessType: "admin" | "staff" };

export function SoftwareWorkspace({ loginId, accessType }: Props) {
  const router = useRouter();
  const [revision, setRevision] = useState(0);
  const [frameState, setFrameState] = useState<"loading" | "ready" | "error">("loading");
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin", cache: "no-store" });
    } catch {
      // Supabase sign-out below may still succeed for staff users.
    }
    try {
      const supabase = createClient();
      if (supabase) await supabase.auth.signOut();
    } catch {
      // The browser will still leave the protected workspace.
    }
    router.replace("/");
    router.refresh();
  }

  function reloadWorkspace() {
    setFrameState("loading");
    setRevision((value) => value + 1);
  }

  return (
    <main className="omcar-workspace">
      <header className="omcar-workspace-bar">
        <a href="/" className="omcar-workspace-brand" aria-label="OMCAR website home">
          <img
            className="omcar-workspace-logo-img"
            src="https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/a526dc36-b0a0-4787-bbc3-bed064b316c1.png"
            alt="OMKAR Inspection"
            width={120}
            height={46}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <span className="omcar-workspace-brand-copy">
            <small>INSPECTION WORKSPACE</small>
          </span>
        </a>

        <div className="omcar-workspace-secure">
          <span className="omcar-workspace-secure-icon"><ShieldCheck size={15} /></span>
          <span className="omcar-workspace-secure-copy">
            <strong>{accessType === "admin" ? "Administrator session" : "Staff session"}</strong>
            <small>{loginId}</small>
          </span>
          <span className="omcar-workspace-online-dot" aria-label="Signed in" />
        </div>

        <div className="omcar-workspace-actions">
          <button className="omcar-workspace-btn omcar-workspace-btn-refresh" type="button" onClick={reloadWorkspace}>
            <RefreshCw size={15} className={frameState === "loading" ? "omcar-refreshing" : ""} />
            <span>Reload</span>
          </button>
          <a className="omcar-workspace-btn omcar-workspace-btn-home" href="/">
            <Home size={15} /><span>Website Home</span><ArrowUpRight size={13} />
          </a>
          <button className="omcar-workspace-btn omcar-workspace-btn-exit" type="button" onClick={signOut} disabled={signingOut}>
            <LogOut size={15} /><span>{signingOut ? "Signing out…" : "Sign out"}</span>
          </button>
        </div>
      </header>

      <section className="omcar-workspace-frame-wrap" aria-label="Inspection application">
        {frameState === "loading" && (
          <div className="omcar-workspace-loading" aria-live="polite">
            <div className="omcar-loading-logo"><img src="https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/a526dc36-b0a0-4787-bbc3-bed064b316c1.png" alt="" width={120} height={46} decoding="async" /></div>
            <div className="omcar-loading-track"><span /></div>
            <strong>Opening your inspection workspace</strong>
            <p>Loading the original OMCAR report builder securely.</p>
          </div>
        )}
        {frameState === "error" && (
          <div className="omcar-workspace-error" role="alert">
            <span><LockKeyhole size={23} /></span>
            <h1>Workspace could not be loaded</h1>
            <p>Check your connection and reload the inspection software. Your browser-local draft is not uploaded to the server.</p>
            <button type="button" className="omcar-workspace-btn" onClick={reloadWorkspace}><RefreshCw size={15} /> Try again</button>
            <a href="/">Return to OMCAR website <ArrowLeft size={14} /></a>
          </div>
        )}
        <iframe
          key={revision}
          className="omcar-workspace-frame"
          src="/api/admin/workspace"
          title="OMCAR Inspection vehicle report builder"
          referrerPolicy="no-referrer"
          onLoad={() => setFrameState("ready")}
          onError={() => setFrameState("error")}
          allow="camera; clipboard-read; clipboard-write"
        />
      </section>
    </main>
  );
}

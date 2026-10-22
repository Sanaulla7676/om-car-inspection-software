"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Check, CheckCircle2,
  ChevronRight, CircleHelp, ClipboardCheck, Clock3, Eye, EyeOff, FileText,
  Gauge, KeyRound, LogOut, Menu, RefreshCw, Settings2, ShieldCheck,
  Smartphone, Users, X, CarFront,
} from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

type View = "loading" | "login" | "overview" | "settings";
type AdminIdentity = { loginId: string; expiresAt?: string; whatsappMasked: string; whatsappConfigured: boolean };
type Metrics = { inspections?: number; completed?: number; awaiting_review?: number; in_progress?: number; vehicles?: number; customers?: number; reports?: number };
type ApiResult = { ok?: boolean; error?: string; code?: string; message?: string; loginId?: string; expiresAt?: string; admin?: AdminIdentity; metrics?: Metrics; destination?: string; expiresInSeconds?: number };

async function postJson(path: string, body: Record<string, unknown> = {}): Promise<ApiResult> {
  const response = await fetch(path, {
    method: "POST", credentials: "same-origin", cache: "no-store",
    headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const data = (await response.json()) as ApiResult;
  if (!response.ok || !data.ok) throw new Error(data.error || "That action could not be completed.");
  return data;
}
function formatNumber(value?: number) { return new Intl.NumberFormat("en-IN").format(value || 0); }
function formatExpiry(value?: string) {
  if (!value) return "12-hour secure session";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "12-hour secure session";
  return "Expires " + date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}
function initials(loginId: string) { return loginId.trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "OM"; }

export function AdminPortal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>("loading");
  const [admin, setAdmin] = useState<AdminIdentity | null>(null);
  const [metrics, setMetrics] = useState<Metrics>({});
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [newLoginId, setNewLoginId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [settingsBusy, setSettingsBusy] = useState(false);
  const [settingsNotice, setSettingsNotice] = useState("");
  const [settingsError, setSettingsError] = useState("");

  const loadSession = useCallback(async () => {
    const response = await fetch("/api/admin/session", { credentials: "same-origin", cache: "no-store", headers: { Accept: "application/json" } });
    const data = (await response.json()) as ApiResult;
    if (!response.ok || !data.ok || !data.admin) {
      setAdmin(null); setMetrics({}); setView("login"); return false;
    }
    setAdmin(data.admin); setMetrics(data.metrics || {}); setNewLoginId(data.admin.loginId);
    setView((current) => current === "settings" ? "settings" : "overview");
    return true;
  }, []);

  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/session", { credentials: "same-origin", cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as ApiResult;
        if (!mounted) return;
        if (response.ok && data.ok && data.admin) {
          setAdmin(data.admin); setMetrics(data.metrics || {}); setNewLoginId(data.admin.loginId); setView("overview");
        } else setView("login");
      })
      .catch(() => { if (mounted) setView("login"); });
    return () => { mounted = false; };
  }, []);

  useGSAP(() => {
    if (view === "loading") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = gsap.utils.toArray<HTMLElement>(".admin-enter");
    if (reduceMotion) { gsap.set(elements, { opacity: 1, y: 0, clearProps: "transform" }); return; }
    gsap.fromTo(elements, { opacity: 0, y: view === "login" ? 16 : 12 },
      { opacity: 1, y: 0, duration: view === "login" ? 0.66 : 0.48, stagger: 0.055, ease: "power3.out", clearProps: "transform" });
  }, { scope: rootRef, dependencies: [view] });

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try { await postJson("/api/admin/login", { loginId, password }); setPassword(""); await loadSession(); setNotice("Signed in securely."); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not sign in."); }
    finally { setBusy(false); }
  }
  async function logout() {
    setBusy(true); try { await postJson("/api/admin/logout"); } catch {}
    setAdmin(null); setMetrics({}); setPassword(""); setOtp(""); setOtpSent(false); setOtpVerified(false); setView("login"); setMobileNav(false);
    setNotice("You have been signed out."); setBusy(false);
  }
  function openView(next: "overview" | "settings") {
    setError(""); setNotice(""); setSettingsError(""); setSettingsNotice(""); setView(next); setMobileNav(false);
    if (next === "settings") {
      setNewLoginId(admin?.loginId || ""); setNewPassword(""); setConfirmPassword(""); setOtp(""); setOtpSent(false); setOtpVerified(false);
    }
  }
  async function refreshOverview() {
    setBusy(true); setError("");
    try { await loadSession(); setNotice("Overview refreshed."); }
    catch { setError("Could not refresh the overview."); }
    finally { setBusy(false); }
  }
  async function requestOtp() {
    setSettingsBusy(true); setSettingsError(""); setSettingsNotice("");
    try {
      const data = await postJson("/api/admin/settings/request-otp");
      setOtpSent(true); setOtpVerified(false); setOtp("");
      setSettingsNotice("Verification code sent to " + (data.destination || "your registered WhatsApp number") + ". It expires in 10 minutes.");
    } catch (cause) { setSettingsError(cause instanceof Error ? cause.message : "Could not request a code."); }
    finally { setSettingsBusy(false); }
  }
  async function verifyOtp() {
    setSettingsBusy(true); setSettingsError(""); setSettingsNotice("");
    try { const data = await postJson("/api/admin/settings/verify-otp", { otp }); setOtpVerified(true); setSettingsNotice(data.message || "WhatsApp verification complete. Continue to save your new login details."); }
    catch (cause) { setSettingsError(cause instanceof Error ? cause.message : "Code verification failed."); }
    finally { setSettingsBusy(false); }
  }
  async function updateCredentials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSettingsBusy(true); setSettingsError(""); setSettingsNotice("");
    try {
      const data = await postJson("/api/admin/settings/update", { loginId: newLoginId, newPassword, confirmPassword });
      setAdmin((current) => current ? { ...current, loginId: data.loginId || newLoginId } : current);
      setNewLoginId(data.loginId || newLoginId); setNewPassword(""); setConfirmPassword(""); setOtp(""); setOtpSent(false); setOtpVerified(false);
      setSettingsNotice(data.message || "Admin credentials updated.");
    } catch (cause) { setSettingsError(cause instanceof Error ? cause.message : "Could not update login details."); }
    finally { setSettingsBusy(false); }
  }

  if (view === "loading") return <main className="om-admin-loading" ref={rootRef}><div className="admin-spinner" /><p>Preparing secure admin workspace…</p></main>;

  if (view === "login" || !admin) {
    return <main className="om-admin-login" ref={rootRef}>
      <div className="admin-orb admin-orb-one" aria-hidden="true" /><div className="admin-orb admin-orb-two" aria-hidden="true" />
      <header className="admin-login-top admin-enter">
        <a className="admin-brand" href="/" aria-label="OMCAR Inspection home"><span className="admin-brand-mark"><CarFront size={22} strokeWidth={1.8} /></span><span><strong>OMCAR</strong><small>VEHICLE INSPECTION</small></span></a>
        <span className="admin-portal-tag"><ShieldCheck size={14} /> Administrator portal</span>
      </header>
      <div className="admin-login-grid">
        <section className="admin-login-copy">
          <div className="admin-overline admin-enter"><span className="admin-overline-dot" /> SECURE OPERATIONS CONSOLE</div>
          <h1 className="admin-enter">Clarity for every inspection. <em>Control for every decision.</em></h1>
          <p className="admin-enter">A dedicated workspace for report oversight, inspection activity and admin account security.</p>
          <div className="admin-login-highlights admin-enter">
            <div><span className="admin-highlight-icon"><ClipboardCheck size={17} /></span><span><b>Inspection overview</b><small>Real-time totals from the existing workspace.</small></span></div>
            <div><span className="admin-highlight-icon"><KeyRound size={17} /></span><span><b>Protected settings</b><small>Change credentials after WhatsApp verification.</small></span></div>
          </div>
          <div className="admin-login-footnote admin-enter"><span className="admin-pulse-dot" /> Session protected · 12-hour expiry · Rate-limited sign-in</div>
        </section>
        <section className="admin-login-card admin-enter">
          <div className="admin-card-topline"><span>ADMIN ACCESS</span><span><span className="admin-status-dot" /> SYSTEM READY</span></div>
          <div className="admin-login-title"><span className="admin-login-icon"><ShieldCheck size={22} /></span><div><h2>Welcome back</h2><p>Sign in with your admin credentials.</p></div></div>
          <form className="admin-login-form" onSubmit={submitLogin}>
            <label htmlFor="om-admin-login">Login ID</label>
            <div className="admin-input-wrap"><Users size={17} /><input id="om-admin-login" name="username" autoComplete="username" value={loginId} onChange={(event) => setLoginId(event.target.value)} placeholder="Enter admin login ID" maxLength={80} required /></div>
            <label htmlFor="om-admin-password">Password</label>
            <div className="admin-input-wrap"><KeyRound size={17} /><input id="om-admin-password" name="password" autoComplete="current-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" maxLength={256} required /><button type="button" className="admin-password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
            {error && <p className="admin-feedback admin-feedback-error" role="alert">{error}</p>}
            {notice && <p className="admin-feedback admin-feedback-success" role="status">{notice}</p>}
            <button className="admin-primary-button admin-submit-button" type="submit" disabled={busy}>{busy ? <span className="admin-button-spinner" /> : <ShieldCheck size={17} />}{busy ? "Verifying…" : "Sign in securely"}<ArrowRight size={16} /></button>
          </form>
          <div className="admin-login-card-bottom"><LockGlyph /><span>Your password is verified server-side and is never stored in plain text.</span></div>
        </section>
      </div>
      <footer className="admin-login-footer"><span>OMCAR Inspection</span><span>Private administrator access</span><a href="/">Return to website <ArrowUpRight size={12} /></a></footer>
    </main>;
  }

  const primaryStats = [
    { label: "Total inspections", value: metrics.inspections, note: "All workspace records", icon: <ClipboardCheck size={18} />, tone: "blue" },
    { label: "Completed", value: metrics.completed, note: "Completed inspection reports", icon: <CheckCircle2 size={18} />, tone: "green" },
    { label: "Awaiting review", value: metrics.awaiting_review, note: "Needs reviewer attention", icon: <Clock3 size={18} />, tone: "amber" },
    { label: "Active work", value: metrics.in_progress, note: "Drafts and ongoing checks", icon: <Activity size={18} />, tone: "violet" },
  ];
  const completion = (metrics.inspections || 0) > 0 ? Math.min(100, Math.round(((metrics.completed || 0) / (metrics.inspections || 1)) * 100)) : 0;

  return <main className="om-admin-app" ref={rootRef}>
    <div className="admin-app-grain" aria-hidden="true" />
    <aside className={"admin-sidebar" + (mobileNav ? " admin-sidebar-open" : "")}>
      <a href="/" className="admin-brand admin-sidebar-brand"><span className="admin-brand-mark"><CarFront size={22} /></span><span><strong>OMCAR</strong><small>INSPECTION SUITE</small></span></a>
      <div className="admin-sidebar-label">WORKSPACE</div>
      <nav className="admin-side-nav" aria-label="Admin navigation">
        <button type="button" className={view === "overview" ? "active" : ""} onClick={() => openView("overview")}><Gauge size={17} /><span>Overview</span><ChevronRight className="admin-nav-chevron" size={15} /></button>
        <button type="button" className={view === "settings" ? "active" : ""} onClick={() => openView("settings")}><Settings2 size={17} /><span>Security settings</span><ChevronRight className="admin-nav-chevron" size={15} /></button>
      </nav>
      <div className="admin-sidebar-bottom">
        <div className="admin-sidebar-help"><span className="admin-help-icon"><CircleHelp size={16} /></span><div><b>Need help?</b><small>Admin support and guidance</small></div></div>
        <div className="admin-sidebar-user"><span className="admin-avatar">{initials(admin.loginId)}</span><span className="admin-user-detail"><b>{admin.loginId}</b><small>Administrator</small></span><button type="button" title="Sign out" aria-label="Sign out" disabled={busy} onClick={logout}><LogOut size={16} /></button></div>
      </div>
    </aside>
    <div className="admin-main">
      <header className="admin-topbar admin-enter">
        <div className="admin-topbar-left"><button className="admin-mobile-menu" type="button" aria-label={mobileNav ? "Close navigation" : "Open navigation"} onClick={() => setMobileNav((value) => !value)}>{mobileNav ? <X size={20} /> : <Menu size={20} />}</button><span className="admin-breadcrumb">OMCAR <ChevronRight size={13} /> ADMIN <ChevronRight size={13} /> <b>{view === "settings" ? "SECURITY SETTINGS" : "OVERVIEW"}</b></span></div>
        <div className="admin-topbar-actions"><span className="admin-secure-chip"><span className="admin-status-dot" /> Secure session</span><button type="button" className="admin-refresh-button" aria-label="Refresh overview" title="Refresh overview" onClick={refreshOverview} disabled={busy}><RefreshCw size={16} className={busy ? "admin-spin-icon" : ""} /></button><button className="admin-topbar-avatar" type="button" onClick={() => openView("settings")} title="Open account settings">{initials(admin.loginId)}</button></div>
      </header>
      {mobileNav && <button className="admin-mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
      <div className="admin-content">
        {view === "overview" ? <>
          <section className="admin-page-intro admin-enter">
            <div><div className="admin-overline"><span className="admin-overline-dot" /> OPERATIONS SNAPSHOT</div><h1>Inspection overview<span>.</span></h1><p>Keep an eye on inspection progress, quality and review workload.</p></div>
            <div className="admin-intro-actions"><span className="admin-updated-pill"><span className="admin-status-dot" /> Connected to workspace</span><button className="admin-secondary-button" type="button" onClick={refreshOverview} disabled={busy}><RefreshCw size={15} /> Refresh data</button></div>
          </section>
          {error && <p className="admin-feedback admin-feedback-error" role="alert">{error}</p>}
          {notice && <p className="admin-feedback admin-feedback-success" role="status">{notice}</p>}
          <section className="admin-stat-grid" aria-label="Inspection metrics">
            {primaryStats.map((stat, index) => <article className={"admin-stat-card admin-enter admin-tone-" + stat.tone} key={stat.label} style={{ animationDelay: (index * 70) + "ms" }}>
              <div className="admin-stat-top"><span>{stat.label}</span><span className="admin-stat-icon">{stat.icon}</span></div><div className="admin-stat-value">{formatNumber(stat.value)}</div><div className="admin-stat-note"><span className="admin-note-dot" />{stat.note}</div><span className="admin-stat-accent" />
            </article>)}
          </section>
          <section className="admin-overview-grid">
            <article className="admin-overview-card admin-enter"><div className="admin-card-heading"><div><span className="admin-card-eyebrow">PROGRESS</span><h2>Completion summary</h2><p>Share of inspection records marked complete.</p></div><span className="admin-progress-badge">{completion}%</span></div>
              <div className="admin-progress-number"><strong>{formatNumber(metrics.completed)}</strong><span>of {formatNumber(metrics.inspections)} inspections completed</span></div><div className="admin-progress-track"><span style={{ width: completion + "%" }} /></div><div className="admin-progress-foot"><span><i className="admin-dot-green" /> Completed</span><span><i className="admin-dot-grey" /> Remaining</span></div>
            </article>
            <article className="admin-overview-card admin-overview-card-dark admin-enter"><div className="admin-card-heading"><div><span className="admin-card-eyebrow">RECORDS</span><h2>Workspace inventory</h2><p>Records in the existing OMCAR workspace.</p></div><span className="admin-inventory-icon"><CarFront size={21} /></span></div>
              <div className="admin-inventory-grid"><div><span>Vehicles</span><b>{formatNumber(metrics.vehicles)}</b></div><div><span>Customers</span><b>{formatNumber(metrics.customers)}</b></div><div><span>Reports</span><b>{formatNumber(metrics.reports)}</b></div></div>
            </article>
          </section>
          <section className="admin-bottom-grid">
            <article className="admin-action-card admin-enter"><div className="admin-action-icon"><ClipboardCheck size={20} /></div><div><h3>Inspection workspace</h3><p>Continue the existing staff workflow for vehicle records, evidence and report generation. Staff authentication remains separate.</p></div><a href="/dashboard" className="admin-secondary-button">Open workspace <ArrowUpRight size={15} /></a></article>
            <article className="admin-action-card admin-enter"><div className="admin-action-icon admin-action-icon-green"><ShieldCheck size={20} /></div><div><h3>Protect admin access</h3><p>Update the login ID and password after WhatsApp verification.</p></div><button type="button" className="admin-secondary-button" onClick={() => openView("settings")}>Security settings <ArrowRight size={15} /></button></article>
          </section>
          <div className="admin-quiet-footer"><ShieldCheck size={14} /><span>Admin authentication is isolated from the public website. Inspection staff sign-in is unchanged.</span><span>{formatExpiry(admin.expiresAt)}</span></div>
        </> : <section className="admin-settings-page">
          <div className="admin-page-intro admin-enter"><div><div className="admin-overline"><span className="admin-overline-dot" /> ACCOUNT PROTECTION</div><h1>Security settings<span>.</span></h1><p>Change administrator credentials with an explicit WhatsApp verification step.</p></div><span className="admin-settings-safe"><ShieldCheck size={17} /> Admin only</span></div>
          {settingsError && <p className="admin-feedback admin-feedback-error admin-enter" role="alert">{settingsError}</p>}
          {settingsNotice && <p className="admin-feedback admin-feedback-success admin-enter" role="status">{settingsNotice}</p>}
          <div className="admin-settings-grid">
            <article className="admin-settings-card admin-enter">
              <div className="admin-card-heading"><div><span className="admin-card-eyebrow">LOGIN CREDENTIALS</span><h2>Change admin login</h2><p>Both the login ID and password are updated together.</p></div><span className="admin-settings-icon"><KeyRound size={18} /></span></div>
              <div className={"admin-whatsapp-status" + (admin.whatsappConfigured ? " is-ready" : " is-pending")}><span className="admin-whatsapp-status-icon">{admin.whatsappConfigured ? <CheckCircle2 size={17} /> : <Smartphone size={17} />}</span><div><b>{admin.whatsappConfigured ? "WhatsApp verification is configured" : "WhatsApp verification needs setup"}</b><p>{admin.whatsappConfigured ? "A one-time verification code will be sent to " + admin.whatsappMasked + "." : "The server is missing WhatsApp Cloud API credentials or the approved OTP template. Credential changes stay disabled until this is configured."}</p></div><span className="admin-whatsapp-pill">{admin.whatsappConfigured ? "READY" : "PENDING"}</span></div>
              <div className="admin-security-steps">
                <div className={"admin-security-step" + (otpSent ? " complete" : "")}><span>{otpSent ? <Check size={14} /> : "1"}</span><div><b>Request a WhatsApp code</b><small>Codes expire after 10 minutes and are limited to five attempts.</small></div></div>
                <div className={"admin-security-step" + (otpVerified ? " complete" : "")}><span>{otpVerified ? <Check size={14} /> : "2"}</span><div><b>Verify the code</b><small>Successful verification is valid for five minutes.</small></div></div>
                <div className={"admin-security-step" + (otpVerified ? " complete" : "")}><span>{otpVerified ? <Check size={14} /> : "3"}</span><div><b>Save new credentials</b><small>Old sessions are revoked when credentials change.</small></div></div>
              </div>
              <div className="admin-settings-button-row"><button type="button" className="admin-secondary-button" onClick={requestOtp} disabled={settingsBusy || !admin.whatsappConfigured}>{settingsBusy ? <span className="admin-button-spinner admin-button-spinner-dark" /> : <Smartphone size={15} />}{otpSent ? "Send a new code" : "Send WhatsApp OTP"}</button>{otpSent && !otpVerified && <span className="admin-code-expiry"><Clock3 size={13} /> Expires in 10 minutes</span>}</div>
              {otpSent && !otpVerified && <div className="admin-otp-row"><label htmlFor="admin-otp">6-digit verification code</label><div className="admin-otp-entry"><input id="admin-otp" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="000000" maxLength={6} /><button type="button" className="admin-primary-button" onClick={verifyOtp} disabled={settingsBusy || otp.length !== 6}>{settingsBusy ? "Verifying…" : "Verify code"}</button></div></div>}
              <form className="admin-settings-form" onSubmit={updateCredentials}>
                <label htmlFor="admin-new-login">New login ID</label><input id="admin-new-login" value={newLoginId} onChange={(event) => setNewLoginId(event.target.value)} maxLength={80} autoComplete="username" required />
                <div className="admin-password-fields"><div><label htmlFor="admin-new-password">New password</label><input id="admin-new-password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={10} maxLength={128} autoComplete="new-password" placeholder="At least 10 characters" required /></div><div><label htmlFor="admin-confirm-password">Confirm password</label><input id="admin-confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={10} maxLength={128} autoComplete="new-password" placeholder="Repeat new password" required /></div></div>
                <p className="admin-field-note">Use at least 10 characters, including a letter and a number. The password is hashed with scrypt on the server before storage.</p>
                <button type="submit" className="admin-primary-button admin-save-credentials" disabled={settingsBusy || !otpVerified || !admin.whatsappConfigured}><ShieldCheck size={16} />{settingsBusy ? "Saving changes…" : "Save new login details"}<ArrowRight size={15} /></button>
              </form>
            </article>
            <aside className="admin-security-aside admin-enter">
              <article className="admin-security-info-card"><span className="admin-aside-icon"><ShieldCheck size={20} /></span><h3>Security by default</h3><p>Small, deliberate safeguards keep the control panel separate from public website routes.</p><ul><li><CheckCircle2 size={14} /> HttpOnly session cookie</li><li><CheckCircle2 size={14} /> Rate-limited failed sign-ins</li><li><CheckCircle2 size={14} /> Password hash stored in the database</li><li><CheckCircle2 size={14} /> Session expiry and revocation</li><li><CheckCircle2 size={14} /> One-time verification before changes</li></ul></article>
              <article className="admin-security-help-card"><span><Smartphone size={17} /></span><div><b>WhatsApp delivery is a real integration</b><p>It requires a WhatsApp Business Cloud API token, phone-number ID and an approved OTP template in server settings. The app does not simulate or display a verification code.</p></div></article>
              <button type="button" className="admin-text-button" onClick={() => openView("overview")}><ArrowDownRight size={15} /> Back to overview</button>
            </aside>
          </div>
          <div className="admin-quiet-footer"><ShieldCheck size={14} /><span>Never share a verification code or admin password with anyone.</span><span>{formatExpiry(admin.expiresAt)}</span></div>
        </section>}
      </div>
    </div>
    {mobileNav && <button className="admin-mobile-nav-close" type="button" aria-label="Close navigation" onClick={() => setMobileNav(false)}><X size={18} /></button>}
  </main>;
}

function LockGlyph() { return <span className="admin-lock-glyph" aria-hidden="true"><ShieldCheck size={14} /></span>; }

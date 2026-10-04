"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UserRound, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";

export function AuthExperience({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const copy = useMemo(() => mode === "login"
    ? {
        title: "Sign In",
        eyebrow: "WELCOME BACK",
        intro: "Enter your workspace credentials to continue.",
        switchLabel: "Create account",
        switchHref: "/signup",
        switchPrefix: "Don't have an account?",
        button: "Sign In",
      }
    : {
        title: "Sign Up",
        eyebrow: "HELLO, FRIEND!",
        intro: "Enter your personal details to start your inspection journey.",
        switchLabel: "Login",
        switchHref: "/login",
        switchPrefix: "Already have an account?",
        button: "Sign Up",
      }, [mode]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");

    if (!supabase) {
      router.push("/dashboard");
      return;
    }

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name.trim() } },
      });
      if (signUpError) {
        setError(signUpError.message);
      } else if (data.session) {
        router.push("/onboarding");
      } else {
        setSuccess("Account created. Check your email if confirmation is enabled, then sign in.");
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) setError(signInError.message);
      else router.push("/dashboard");
    }
    setBusy(false);
  }

  return (
    <main className="om-auth-page">
      <div className="om-circuit om-circuit-a" />
      <div className="om-circuit om-circuit-b" />
      <div className="om-circuit om-circuit-c" />
      <div className="om-auth-noise" />

      <section className="om-auth-card">
        <div className="om-auth-copy">
          <div className="om-brand-line"><span className="om-brand-mark">OM</span><span>OM Car Inspection</span></div>
          <div className="om-copy-center">
            <div className="om-copy-eyebrow">INSPECTION OPERATIONS</div>
            <h1>{copy.eyebrow}</h1>
            <p>{copy.intro}</p>
          </div>
          <div className="om-trust"><ShieldCheck size={15} /> Secure workspace • evidence-first • audit-ready</div>
        </div>

        <div className="om-auth-form-pane">
          <div className="om-form-heading">
            <div className="om-wrench"><Wrench size={19} /></div>
            <div>
              <div className="om-form-eyebrow">{mode === "login" ? "FIELD ACCESS" : "TEAM ACCESS"}</div>
              <h2>{copy.title}</h2>
            </div>
          </div>

          <form onSubmit={submit} className="om-auth-form">
            {mode === "signup" && (
              <div className="om-input-wrap">
                <UserRound size={18} />
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Username" autoComplete="name" required />
              </div>
            )}

            <div className="om-input-wrap">
              <Mail size={18} />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" autoComplete="email" required />
            </div>

            <div className="om-input-wrap">
              <LockKeyhole size={18} />
              <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} required />
              <button type="button" className="om-eye" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {error && <div className="om-auth-message error">{error}</div>}
            {success && <div className="om-auth-message success">{success}</div>}

            <button className="om-submit" disabled={busy}>
              <span>{busy ? "Working…" : copy.button}</span>
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="om-auth-switch">
            <span>{copy.switchPrefix}</span>
            <button type="button" onClick={() => router.push(copy.switchHref)}>{copy.switchLabel}</button>
          </div>
        </div>
      </section>

      <div className="om-auth-footer">OM • Vehicle intelligence platform</div>

      <style jsx global>{`
        .om-auth-page{min-height:100svh;position:relative;overflow:hidden;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 50% 20%,#33080d 0%,#120204 42%,#050101 100%);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#fff}
        .om-auth-noise{position:absolute;inset:0;pointer-events:none;opacity:.4;background:repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 1px,transparent 1px 4px)}
        .om-circuit{position:absolute;inset:-15%;opacity:.85;pointer-events:none;background-repeat:no-repeat}
        .om-circuit-a{background-image:linear-gradient(#7f1018,#7f1018),linear-gradient(90deg,#7f1018,#7f1018),linear-gradient(#7f1018,#7f1018),linear-gradient(90deg,#7f1018,#7f1018),radial-gradient(circle at 12% 23%,#ff4a53 0 4px,transparent 7px);background-size:34% 2px,2px 26%,26% 2px,2px 22%,100% 100%;background-position:0 23%,34% 0,34% 49%,60% 49%,0 0;animation:omPulseCircuit 4.5s ease-in-out infinite}
        .om-circuit-b{transform:rotate(7deg) scale(1.1);background-image:linear-gradient(90deg,#5e0d13,#5e0d13),linear-gradient(#5e0d13,#5e0d13),radial-gradient(circle at 75% 70%,#ff3944 0 3px,transparent 7px);background-size:2px 100%,100% 2px,100% 100%;background-position:74% 0,0 70%,0 0;animation:omDrift 12s linear infinite}
        .om-circuit-c{background-image:radial-gradient(circle at 50% 50%,rgba(255,46,56,.13),transparent 35%);animation:omGlow 5s ease-in-out infinite}
        @keyframes omPulseCircuit{0%,100%{opacity:.55;filter:brightness(.8)}50%{opacity:1;filter:brightness(1.5)}}
        @keyframes omDrift{0%{transform:rotate(7deg) translate3d(0,0,0)}50%{transform:rotate(7deg) translate3d(-1.5%,1%,0)}100%{transform:rotate(7deg) translate3d(0,0,0)}}
        @keyframes omGlow{0%,100%{transform:scale(1);opacity:.35}50%{transform:scale(1.12);opacity:.8}}
        .om-auth-card{position:relative;z-index:2;width:min(940px,100%);min-height:440px;display:grid;grid-template-columns:1.03fr .97fr;overflow:hidden;border:1px solid rgba(255,91,98,.38);border-radius:21px;background:linear-gradient(120deg,rgba(75,25,28,.82),rgba(17,3,5,.94));box-shadow:0 0 0 1px rgba(255,70,80,.05),0 30px 90px rgba(0,0,0,.65),0 0 80px rgba(255,34,45,.1);backdrop-filter:blur(14px);animation:omCardIn .8s cubic-bezier(.2,.8,.2,1)}
        .om-auth-card:before{content:"";position:absolute;left:0;top:0;bottom:0;width:53%;background:linear-gradient(130deg,rgba(255,255,255,.06),rgba(255,255,255,.01));clip-path:polygon(0 0,85% 0,100% 100%,0 100%);pointer-events:none}
        .om-auth-card:after{content:"";position:absolute;left:52.5%;top:0;bottom:0;width:2px;background:linear-gradient(180deg,rgba(255,92,101,.1),rgba(255,92,101,.65),rgba(255,92,101,.1));transform:skewX(14deg);transform-origin:top}
        @keyframes omCardIn{0%{opacity:0;transform:translateY(20px) scale(.985)}100%{opacity:1;transform:translateY(0) scale(1)}}
        .om-auth-copy{position:relative;z-index:1;display:flex;flex-direction:column;justify-content:space-between;padding:42px 42px 30px;min-height:440px}
        .om-brand-line{display:flex;align-items:center;gap:12px;font-weight:800;font-size:15px;letter-spacing:.01em}.om-brand-mark{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,#ff5b63,#b41420);box-shadow:0 0 24px rgba(255,53,63,.25);font-weight:950}
        .om-copy-center{max-width:410px;margin-top:20px}.om-copy-eyebrow,.om-form-eyebrow{font-size:10px;letter-spacing:.18em;font-weight:800;color:#ff7c84}.om-copy-center h1{font-size:35px;line-height:1.05;margin:10px 0 12px;letter-spacing:-.03em}.om-copy-center p{margin:0;color:#f1dadd;line-height:1.65;font-size:14px;max-width:330px}
        .om-trust{display:flex;align-items:center;gap:8px;color:#bda3a7;font-size:11px}.om-trust svg{color:#ff6c74}
        .om-auth-form-pane{position:relative;z-index:1;padding:36px 44px 30px;display:flex;flex-direction:column;justify-content:center;background:linear-gradient(180deg,rgba(0,0,0,.1),rgba(0,0,0,.22))}
        .om-form-heading{display:flex;align-items:center;gap:13px;margin-bottom:26px}.om-wrench{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;color:#ff6d75;background:rgba(255,70,80,.08);border:1px solid rgba(255,84,95,.2)}.om-form-heading h2{margin:4px 0 0;font-size:31px;letter-spacing:-.035em}
        .om-auth-form{display:grid;gap:14px}.om-input-wrap{display:flex;align-items:center;gap:10px;height:58px;padding:0 14px;border-radius:12px;border:1px solid rgba(255,89,98,.26);background:rgba(81,26,30,.62);box-shadow:inset 0 0 0 1px rgba(255,255,255,.02);transition:.22s ease}.om-input-wrap:focus-within{border-color:#ff4752;box-shadow:0 0 0 3px rgba(255,56,66,.12),0 0 30px rgba(255,40,50,.12)}.om-input-wrap svg{color:#9f7378;flex:0 0 auto}.om-input-wrap:focus-within svg{color:#ff5360}.om-input-wrap input{border:0!important;outline:0!important;background:transparent!important;color:#fff!important;box-shadow:none!important;padding:0!important}.om-input-wrap input::placeholder{color:#af8b8f}.om-eye{border:0;background:transparent;color:#aa7d82;display:grid;place-items:center;padding:5px}.om-eye:hover{color:#ff6470}
        .om-submit{height:56px;border:0;border-radius:28px;background:linear-gradient(90deg,#ff414c,#d7212d);color:#fff;font-weight:850;font-size:15px;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 12px 26px rgba(226,35,47,.24);transition:.2s ease;position:relative;overflow:hidden}.om-submit:before{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent 20%,rgba(255,255,255,.28) 50%,transparent 80%);transform:translateX(-120%);animation:omShimmer 3.4s ease-in-out infinite}.om-submit:hover{transform:translateY(-1px);box-shadow:0 16px 32px rgba(226,35,47,.34)}.om-submit:disabled{opacity:.7;cursor:wait}.om-submit span,.om-submit svg{position:relative;z-index:1}
        @keyframes omShimmer{0%,55%{transform:translateX(-120%)}70%,100%{transform:translateX(120%)}}
        .om-auth-switch{margin-top:20px;text-align:center;font-size:12px;color:#ae9498}.om-auth-switch button{border:0;background:none;color:#ff6670;font-weight:800;margin-left:5px}.om-auth-switch button:hover{text-decoration:underline}
        .om-auth-message{padding:11px 12px;border-radius:10px;font-size:12px;line-height:1.5}.om-auth-message.error{background:rgba(255,55,69,.08);border:1px solid rgba(255,73,84,.22);color:#ff9da3}.om-auth-message.success{background:rgba(73,190,131,.08);border:1px solid rgba(73,190,131,.2);color:#a8e9cc}
        .om-auth-footer{position:absolute;z-index:2;bottom:12px;left:50%;transform:translateX(-50%);font-size:10px;letter-spacing:.15em;color:#75464b;text-transform:uppercase;white-space:nowrap}
        @media(max-width:760px){.om-auth-page{padding:14px}.om-auth-card{grid-template-columns:1fr;min-height:auto;max-width:480px}.om-auth-card:before,.om-auth-card:after{display:none}.om-auth-copy{min-height:auto;padding:28px 28px 16px}.om-copy-center{margin-top:30px}.om-copy-center h1{font-size:30px}.om-copy-center p{font-size:13px}.om-trust{margin-top:20px}.om-auth-form-pane{padding:22px 28px 28px}.om-form-heading h2{font-size:28px}.om-auth-footer{display:none}}
        @media(prefers-reduced-motion:reduce){.om-auth-card,.om-circuit-a,.om-circuit-b,.om-circuit-c,.om-submit:before{animation:none!important}}
      `}
      </style>
    </main>
  );
}

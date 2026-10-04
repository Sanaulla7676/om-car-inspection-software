"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
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

  const isSignup = mode === "signup";
  const leftTitle = isSignup ? "HELLO, FRIEND!" : "WELCOME BACK";
  const leftText = isSignup
    ? "Enter your personal details to start your journey with us."
    : "Sign in with your workspace credentials to continue your inspection workflow.";
  const formTitle = isSignup ? "Sign Up" : "Login";
  const switchLabel = isSignup ? "Login" : "Sign Up";
  const switchHref = isSignup ? "/login" as const : "/signup" as const;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");

    if (!supabase) {
      router.push("/dashboard");
      return;
    }

    if (isSignup) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
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
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) setError(signInError.message);
      else router.push("/dashboard");
    }

    setBusy(false);
  }

  return (
    <main className="om-auth">
      <div className="om-auth-grid" aria-hidden="true">
        <span className="om-trace om-trace-1" />
        <span className="om-trace om-trace-2" />
        <span className="om-trace om-trace-3" />
        <span className="om-trace om-trace-4" />
        <span className="om-trace om-trace-5" />
        <span className="om-trace om-trace-6" />
        <span className="om-node om-node-1" />
        <span className="om-node om-node-2" />
        <span className="om-node om-node-3" />
        <span className="om-node om-node-4" />
        <span className="om-node om-node-5" />
      </div>

      <section className="om-auth-card">
        <div className="om-auth-left">
          <div className="om-left-copy">
            <h1>{leftTitle}</h1>
            <p>{leftText}</p>
          </div>
        </div>

        <div className="om-auth-right">
          <div className="om-auth-form-head">
            <h2>{formTitle}</h2>
          </div>

          <form onSubmit={submit} className="om-auth-form">
            {isSignup && (
              <label className="om-field">
                <UserRound size={18} aria-hidden="true" />
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Username"
                  autoComplete="name"
                  required
                />
              </label>
            )}

            <label className="om-field">
              <Mail size={18} aria-hidden="true" />
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                type="email"
                autoComplete="email"
                required
              />
            </label>

            <label className="om-field">
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                autoComplete={isSignup ? "new-password" : "current-password"}
                minLength={6}
                required
              />
              <button
                type="button"
                className="om-password-toggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </label>

            {error && <div className="om-auth-message error">{error}</div>}
            {success && <div className="om-auth-message success">{success}</div>}

            <button className="om-auth-submit" disabled={busy}>
              {busy ? "Please wait…" : formTitle}
            </button>
          </form>

          <div className="om-auth-switch">
            <span>{isSignup ? "Already have an account?" : "Don't have an account?"}</span>
            <button type="button" onClick={() => router.push(switchHref)}>{switchLabel}</button>
          </div>
        </div>
      </section>

      <div className="om-auth-sheen" aria-hidden="true" />
      <div className="om-auth-vignette" aria-hidden="true" />

      <style jsx global>{`
        .om-auth{
          min-height:100svh;
          position:relative;
          overflow:hidden;
          display:grid;
          place-items:center;
          padding:24px;
          background:
            radial-gradient(circle at 50% 45%,rgba(97,5,10,.42),transparent 30%),
            radial-gradient(circle at 12% 20%,rgba(255,32,48,.08),transparent 18%),
            radial-gradient(circle at 88% 78%,rgba(255,25,38,.06),transparent 20%),
            #050001;
          color:#fff;
          isolation:isolate;
        }

        .om-auth::before{
          content:"";
          position:absolute;
          inset:0;
          background:
            linear-gradient(90deg,rgba(255,255,255,.014) 1px,transparent 1px) 0 0/110px 100%,
            linear-gradient(rgba(255,255,255,.012) 1px,transparent 1px) 0 0/100% 110px;
          opacity:.32;
          pointer-events:none;
        }

        .om-auth-grid{
          position:absolute;
          inset:0;
          pointer-events:none;
          opacity:.84;
          filter:drop-shadow(0 0 7px rgba(255,35,48,.08));
        }

        .om-trace,.om-node{position:absolute;display:block}
        .om-trace{
          height:2px;
          background:linear-gradient(90deg,rgba(255,46,59,0),rgba(255,53,66,.55),rgba(255,53,66,.95),rgba(255,46,59,0));
          box-shadow:0 0 12px rgba(255,45,58,.35);
          transform-origin:left center;
          animation:omLinePulse 4.8s ease-in-out infinite;
        }
        .om-trace-1{width:46%;left:-3%;top:30.5%;transform:rotate(0deg)}
        .om-trace-2{width:37%;right:-4%;top:30.5%;transform:rotate(0deg);animation-delay:.9s}
        .om-trace-3{width:31%;left:4%;top:68%;transform:rotate(0deg);animation-delay:1.6s}
        .om-trace-4{width:42%;right:-2%;top:68%;transform:rotate(0deg);animation-delay:2.2s}
        .om-trace-5{width:18%;left:16.8%;top:15%;transform:rotate(90deg);transform-origin:left center;animation-delay:1.1s}
        .om-trace-6{width:19%;right:16%;top:55%;transform:rotate(90deg);transform-origin:left center;animation-delay:2.6s}

        .om-node{
          width:8px;height:8px;border-radius:50%;
          background:#ff5862;
          box-shadow:0 0 0 4px rgba(255,44,57,.10),0 0 18px rgba(255,44,57,.85),0 0 34px rgba(255,35,48,.4);
          animation:omNodePulse 2.9s ease-in-out infinite;
        }
        .om-node-1{left:3.15%;top:30.1%}
        .om-node-2{left:16.3%;top:14.2%;animation-delay:.5s}
        .om-node-3{right:1.8%;top:30.1%;animation-delay:1.2s}
        .om-node-4{left:4%;top:67.5%;animation-delay:1.9s}
        .om-node-5{right:16%;top:54.5%;animation-delay:2.4s}

        @keyframes omLinePulse{0%,100%{opacity:.34}50%{opacity:1}}
        @keyframes omNodePulse{0%,100%{transform:scale(.72);opacity:.65}50%{transform:scale(1.16);opacity:1}}

        .om-auth-card{
          position:relative;
          z-index:5;
          width:min(760px,calc(100vw - 40px));
          min-height:426px;
          display:grid;
          grid-template-columns:1.09fr .91fr;
          overflow:hidden;
          border:1px solid rgba(255,82,91,.34);
          border-radius:18px;
          background:linear-gradient(130deg,rgba(57,18,20,.86),rgba(13,2,4,.96));
          box-shadow:
            0 0 0 1px rgba(255,52,64,.05),
            0 28px 70px rgba(0,0,0,.72),
            0 0 55px rgba(255,31,44,.11);
          backdrop-filter:blur(15px);
          animation:omCardIn .68s cubic-bezier(.2,.82,.18,1);
        }

        .om-auth-card::before{
          content:"";
          position:absolute;
          inset:0 auto 0 0;
          width:54%;
          background:linear-gradient(125deg,rgba(255,255,255,.07),rgba(255,255,255,.02));
          clip-path:polygon(0 0,78% 0,100% 100%,0 100%);
          pointer-events:none;
        }

        .om-auth-card::after{
          content:"";
          position:absolute;
          top:-10%;
          left:51%;
          width:1px;
          height:120%;
          background:linear-gradient(180deg,transparent,rgba(255,91,100,.66),transparent);
          transform:skewX(13deg);
          pointer-events:none;
        }

        @keyframes omCardIn{
          from{opacity:0;transform:translateY(18px) scale(.985)}
          to{opacity:1;transform:translateY(0) scale(1)}
        }

        .om-auth-left{
          position:relative;
          z-index:1;
          min-height:426px;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:36px 42px 36px 36px;
          text-align:center;
        }

        .om-left-copy{
          width:min(315px,100%);
          transform:translateY(3px);
          animation:omLeftIn .75s .08s both cubic-bezier(.2,.8,.2,1);
        }

        .om-left-copy h1{
          margin:0 0 14px;
          font-size:31px;
          font-weight:900;
          line-height:1.03;
          letter-spacing:.015em;
          text-shadow:0 0 22px rgba(255,255,255,.06);
        }

        .om-left-copy p{
          margin:0;
          color:#f0d7da;
          font-size:14px;
          line-height:1.55;
        }

        @keyframes omLeftIn{
          from{opacity:0;transform:translateY(13px)}
          to{opacity:1;transform:translateY(3px)}
        }

        .om-auth-right{
          position:relative;
          z-index:2;
          display:flex;
          flex-direction:column;
          justify-content:center;
          padding:34px 48px 30px 30px;
        }

        .om-auth-form-head{
          display:flex;
          justify-content:center;
          margin-bottom:25px;
        }

        .om-auth-form-head h2{
          margin:0;
          font-size:31px;
          font-weight:850;
          letter-spacing:-.03em;
        }

        .om-auth-form{
          display:grid;
          gap:17px;
        }

        .om-field{
          height:57px;
          display:flex;
          align-items:center;
          gap:11px;
          padding:0 13px;
          border-radius:12px;
          border:1px solid rgba(255,102,110,.2);
          background:rgba(73,24,27,.62);
          box-shadow:inset 0 0 0 1px rgba(255,255,255,.015);
          transition:border-color .2s ease,box-shadow .2s ease,transform .2s ease;
        }

        .om-field:focus-within{
          border-color:#ff535d;
          box-shadow:0 0 0 2px rgba(255,67,78,.14),0 0 24px rgba(255,44,56,.16);
          transform:translateY(-1px);
        }

        .om-field>svg{color:#95747a;flex:0 0 auto;transition:color .2s ease}
        .om-field:focus-within>svg{color:#ff5963}
        .om-field input{
          min-width:0;
          width:100%;
          border:0!important;
          outline:0!important;
          background:transparent!important;
          color:#fff!important;
          box-shadow:none!important;
          padding:0!important;
          font-size:14px;
        }
        .om-field input::placeholder{color:#ad8d92}
        .om-password-toggle{
          display:grid;
          place-items:center;
          padding:4px;
          border:0;
          background:transparent;
          color:#9d777d;
          cursor:pointer;
        }
        .om-password-toggle:hover{color:#ff616b}

        .om-auth-submit{
          height:55px;
          margin-top:2px;
          border:0;
          border-radius:28px;
          background:linear-gradient(90deg,#ff414c,#d6222d);
          color:#fff;
          font-weight:800;
          font-size:15px;
          cursor:pointer;
          box-shadow:0 11px 28px rgba(226,35,47,.25);
          transition:transform .2s ease,box-shadow .2s ease,filter .2s ease;
          position:relative;
          overflow:hidden;
        }

        .om-auth-submit::after{
          content:"";
          position:absolute;
          inset:0;
          background:linear-gradient(115deg,transparent 23%,rgba(255,255,255,.22) 50%,transparent 77%);
          transform:translateX(-120%);
          animation:omShimmer 3.6s ease-in-out infinite;
        }

        .om-auth-submit:hover{
          transform:translateY(-1px);
          filter:brightness(1.04);
          box-shadow:0 15px 32px rgba(226,35,47,.34);
        }
        .om-auth-submit:disabled{opacity:.7;cursor:wait}
        @keyframes omShimmer{0%,58%{transform:translateX(-120%)}72%,100%{transform:translateX(120%)}}

        .om-auth-switch{
          margin-top:18px;
          text-align:center;
          font-size:12px;
          color:#bca2a6;
        }
        .om-auth-switch button{
          margin-left:5px;
          border:0;
          background:none;
          color:#ff5964;
          font-weight:800;
          cursor:pointer;
        }
        .om-auth-switch button:hover{text-decoration:underline}

        .om-auth-message{
          padding:10px 11px;
          border-radius:10px;
          font-size:11px;
          line-height:1.45;
        }
        .om-auth-message.error{
          color:#ffabb0;
          background:rgba(255,57,70,.08);
          border:1px solid rgba(255,74,85,.2);
        }
        .om-auth-message.success{
          color:#b0ead0;
          background:rgba(72,192,132,.08);
          border:1px solid rgba(72,192,132,.2);
        }

        .om-auth-sheen{
          position:absolute;
          z-index:3;
          width:55%;
          height:65%;
          left:22%;
          top:15%;
          background:radial-gradient(circle,rgba(255,44,57,.08),transparent 64%);
          filter:blur(7px);
          pointer-events:none;
          animation:omSheen 5.8s ease-in-out infinite;
        }
        @keyframes omSheen{0%,100%{opacity:.35;transform:scale(.94)}50%{opacity:.8;transform:scale(1.07)}}

        .om-auth-vignette{
          position:absolute;
          inset:0;
          z-index:4;
          pointer-events:none;
          background:radial-gradient(circle at center,transparent 45%,rgba(0,0,0,.46) 100%);
        }

        @media(max-width:760px){
          .om-auth{padding:15px}
          .om-auth-card{
            width:min(460px,100%);
            min-height:auto;
            grid-template-columns:1fr;
          }
          .om-auth-card::before,.om-auth-card::after{display:none}
          .om-auth-left{
            min-height:170px;
            padding:26px 25px 12px;
          }
          .om-left-copy{width:100%}
          .om-left-copy h1{font-size:28px}
          .om-left-copy p{font-size:12px}
          .om-auth-right{padding:23px 25px 28px}
          .om-auth-form-head h2{font-size:28px}
          .om-auth-form{gap:13px}
          .om-field{height:55px}
          .om-auth-submit{height:54px}
          .om-trace-5,.om-trace-6,.om-node-2,.om-node-5{display:none}
        }

        @media(prefers-reduced-motion:reduce){
          .om-auth-card,.om-left-copy,.om-trace,.om-node,.om-auth-submit::after,.om-auth-sheen{animation:none!important}
        }
      `}
      </style>
    </main>
  );
}

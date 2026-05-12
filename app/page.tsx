"use client";

import { useState } from "react";

const STATES_BY_REGION = [
  { region: "Southeast", states: ["Alabama","Florida","Georgia","Kentucky","Mississippi","North Carolina","South Carolina","Tennessee","Virginia","West Virginia"] },
  { region: "Northeast", states: ["Connecticut","Delaware","Maine","Maryland","Massachusetts","New Hampshire","New Jersey","New York","Pennsylvania","Rhode Island","Vermont"] },
  { region: "Midwest", states: ["Illinois","Indiana","Iowa","Kansas","Michigan","Minnesota","Missouri","Nebraska","North Dakota","Ohio","South Dakota","Wisconsin"] },
  { region: "Southwest", states: ["Arkansas","Louisiana","Oklahoma","Texas"] },
  { region: "Mountain", states: ["Arizona","Colorado","Idaho","Montana","Nevada","New Mexico","Utah","Wyoming"] },
  { region: "West", states: ["Alaska","California","Hawaii","Oregon","Washington"] },
];

export default function Home() {
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", state: "", timing: "", injuries: [] as string[] });
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const toggleInjury = (injury: string) => {
    setForm(f => ({
      ...f,
      injuries: f.injuries.includes(injury)
        ? f.injuries.filter(i => i !== injury)
        : [...f.injuries, injury]
    }));
  };

  const formatPhone = (val: string) => {
    const v = val.replace(/\D/g, "").slice(0, 10);
    if (v.length >= 6) return `(${v.slice(0,3)}) ${v.slice(3,6)}-${v.slice(6)}`;
    if (v.length >= 3) return `(${v.slice(0,3)}) ${v.slice(3)}`;
    return v;
  };

  const handleSubmit = async () => {
    if (!form.firstName || !form.phone || !form.state || !form.timing) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    setErrorMsg("");
    setStatus("loading");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const injuries = ["🦴 Back / Neck","🧠 Head / Brain","🦾 Broken Bones","💊 Soft Tissue","😟 Emotional","❓ Not Sure"];

  return (
    <main style={{ minHeight: "100vh", background: "#07090f", color: "#f0f4ff", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .display { font-family: 'Bebas Neue', cursive; }
        input, select { background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 13px 16px; color: #f0f4ff; font-family: 'DM Sans', sans-serif; font-size: 15px; width: 100%; outline: none; appearance: none; transition: border-color 0.2s, box-shadow 0.2s; }
        input::placeholder { color: #3d4556; }
        input:focus, select:focus { border-color: #2dffd0; box-shadow: 0 0 0 3px rgba(45,255,208,0.08); }
        .injury-btn { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.04); border: 1.5px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 13px; cursor: pointer; font-size: 13px; font-weight: 500; color: #8892a4; transition: all 0.15s; user-select: none; }
        .injury-btn:hover { border-color: rgba(255,255,255,0.2); color: #f0f4ff; }
        .injury-btn.active { border-color: #2dffd0; background: rgba(45,255,208,0.08); color: #f0f4ff; }
        .submit-btn { width: 100%; background: #2dffd0; color: #07090f; border: none; border-radius: 14px; padding: 17px; font-family: 'Bebas Neue', cursive; font-size: 22px; letter-spacing: 2px; cursor: pointer; transition: all 0.15s; margin-top: 16px; margin-bottom: 12px; }
        .submit-btn:hover { background: #4fffd8; box-shadow: 0 4px 32px rgba(45,255,208,0.25); transform: translateY(-1px); }
        .trust-pill { display: flex; align-items: center; gap: 7px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 100px; padding: 7px 14px; font-size: 13px; color: #c0c8d8; font-weight: 500; }
        .state-tag { padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; transition: transform 0.1s; cursor: default; }
        .state-tag:hover { transform: scale(1.05); }
        .reg-se { background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.25); color: #fbbf24; }
        .reg-ne { background: rgba(79,158,255,0.1); border: 1px solid rgba(79,158,255,0.25); color: #4f9eff; }
        .reg-mw { background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.25); color: #34d399; }
        .reg-sw { background: rgba(255,122,47,0.1); border: 1px solid rgba(255,122,47,0.25); color: #ff7a2f; }
        .reg-mt { background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.25); color: #f87171; }
        .reg-w  { background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.25); color: #a78bfa; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .dot { width: 6px; height: 6px; border-radius: 50%; background: #2dffd0; animation: blink 1.8s infinite; }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
      `}</style>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 28px", maxWidth: 680, margin: "0 auto" }}>
        <div className="display" style={{ fontSize: 28, letterSpacing: 3 }}>
          Injured<span style={{ color: "#2dffd0" }}>Help</span>
          <sup style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, color: "#2dffd0", letterSpacing: 1 }}>.ai</sup>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(45,255,208,0.08)", border: "1px solid rgba(45,255,208,0.25)", borderRadius: 100, padding: "5px 14px", fontSize: 11, fontWeight: 700, color: "#2dffd0", letterSpacing: 1, textTransform: "uppercase" }}>
          <div className="dot" /> Free Help Now
        </div>
      </nav>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 64px", position: "relative", zIndex: 1 }}>

        {/* Hero */}
        <section style={{ padding: "44px 0 36px", textAlign: "center" }}>
          <div className="fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,122,47,0.1)", border: "1px solid rgba(255,122,47,0.3)", borderRadius: 100, padding: "6px 16px", fontSize: 11, fontWeight: 700, color: "#ff7a2f", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 28 }}>
            🇺🇸 All 50 States · No Cost · No Obligation
          </div>

          <h1 className="display fade-up" style={{ fontSize: "clamp(50px,12vw,70px)", lineHeight: 0.97, letterSpacing: 1, marginBottom: 24 }}>
            You&apos;re Hurt.<br />
            <span style={{ color: "#2dffd0" }}>We&apos;re Here.</span><br />
            Let&apos;s Get You Help.
          </h1>

          <p className="fade-up" style={{ color: "#8892a4", fontSize: 17, lineHeight: 1.75, maxWidth: 500, margin: "0 auto 32px" }}>
            If you&apos;ve been injured in a car accident, you may be owed <strong style={{ color: "#f0f4ff" }}>significant compensation</strong>. Our team connects you with the right attorney in your state — for free, in seconds.
          </p>

          <div className="fade-up" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 40 }}>
            {["Zero upfront cost","Attorney reviewed","Call + text in seconds","Contingency only"].map(t => (
              <div key={t} className="trust-pill">
                <svg width="14" height="14" fill="#2dffd0" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                {t}
              </div>
            ))}
          </div>

          {/* Form */}
          {status === "success" ? (
            <div style={{ background: "rgba(45,255,208,0.05)", border: "1px solid rgba(45,255,208,0.25)", borderRadius: 24, padding: "48px 32px", textAlign: "center" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🤝</div>
              <div className="display" style={{ fontSize: 36, color: "#2dffd0", letterSpacing: 1, marginBottom: 12 }}>Help Is On The Way</div>
              <p style={{ color: "#8892a4", fontSize: 16, lineHeight: 1.7 }}>An attorney&apos;s team is calling you <strong style={{ color: "#2dffd0" }}>right now</strong>. We also just texted you a confirmation. You&apos;re in good hands.</p>
            </div>
          ) : (
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 32, textAlign: "left", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: "linear-gradient(90deg,transparent,#2dffd0,transparent)", opacity: 0.4 }} />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div className="display" style={{ fontSize: 24, letterSpacing: 1 }}>Get Free Help Right Now</div>
                <div style={{ background: "rgba(45,255,208,0.1)", border: "1px solid rgba(45,255,208,0.25)", color: "#2dffd0", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "4px 10px", borderRadius: 6 }}>FREE</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#8892a4", marginBottom: 6 }}>First Name</label>
                  <input type="text" placeholder="John" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#8892a4", marginBottom: 6 }}>Last Name</label>
                  <input type="text" placeholder="Smith" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#8892a4", marginBottom: 6 }}>Phone Number</label>
                  <input type="tel" placeholder="(555) 000-0000" value={form.phone} onChange={e => setForm({...form, phone: formatPhone(e.target.value)})} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#8892a4", marginBottom: 6 }}>Your State</label>
                  <div style={{ position: "relative" }}>
                    <select value={form.state} onChange={e => setForm({...form, state: e.target.value})}>
                      <option value="" disabled>Select state…</option>
                      {STATES_BY_REGION.map(r => (
                        <optgroup key={r.region} label={`— ${r.region}`}>
                          {r.states.map(s => <option key={s}>{s}</option>)}
                        </optgroup>
                      ))}
                    </select>
                    <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#8892a4", pointerEvents: "none", fontSize: 12 }}>▾</span>
                  </div>
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#8892a4", marginBottom: 6 }}>When did your accident happen?</label>
                  <div style={{ position: "relative" }}>
                    <select value={form.timing} onChange={e => setForm({...form, timing: e.target.value})}>
                      <option value="" disabled>Select timeframe…</option>
                      <option>Within the last 30 days</option>
                      <option>1–3 months ago</option>
                      <option>3–6 months ago</option>
                      <option>6–12 months ago</option>
                      <option>Over a year ago</option>
                    </select>
                    <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#8892a4", pointerEvents: "none", fontSize: 12 }}>▾</span>
                  </div>
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#8892a4", marginBottom: 6 }}>Type of injury (select all that apply)</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {injuries.map(inj => (
                      <div key={inj} className={`injury-btn${form.injuries.includes(inj) ? " active" : ""}`} onClick={() => toggleInjury(inj)}>{inj}</div>
                    ))}
                  </div>
                </div>
              </div>

              {errorMsg && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 8 }}>{errorMsg}</p>}
              {status === "error" && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 8 }}>Something went wrong. Please try again.</p>}

              <button className="submit-btn" onClick={handleSubmit} disabled={status === "loading"}>
                {status === "loading" ? "Connecting You Now..." : "GET FREE HELP NOW →"}
              </button>
              <p style={{ textAlign: "center", fontSize: 11, color: "#3d4556", lineHeight: 1.6 }}>By submitting you agree to be contacted by phone and SMS. No spam. No fees unless you win.</p>
            </div>
          )}
        </section>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, overflow: "hidden", margin: "0 0 48px" }}>
          {[["$2.4M+","teal","Avg. settlement recovered"],["50","orange","States covered nationwide"],["<60s","blue","To reach attorney team"]].map(([val,color,desc]) => (
            <div key={val} style={{ background: "#07090f", padding: "24px 16px", textAlign: "center" }}>
              <div className="display" style={{ fontSize: "clamp(28px,6vw,38px)", letterSpacing: 1, lineHeight: 1, marginBottom: 6, color: color === "teal" ? "#2dffd0" : color === "orange" ? "#ff7a2f" : "#4f9eff" }}>{val}</div>
              <div style={{ fontSize: 11, color: "#8892a4", lineHeight: 1.4 }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* States */}
        <div style={{ marginBottom: 48 }}>
          <div className="display" style={{ fontSize: 13, letterSpacing: 3, color: "#8892a4", textAlign: "center", marginBottom: 20 }}>We&apos;re Available In All 50 States</div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 16 }}>
            {[["#fbbf24","Southeast"],["#4f9eff","Northeast"],["#34d399","Midwest"],["#ff7a2f","Southwest"],["#f87171","Mountain"],["#a78bfa","West"]].map(([color,label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#8892a4", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />{label}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {[["Alabama","se"],["Florida","se"],["Georgia","se"],["Kentucky","se"],["Mississippi","se"],["N. Carolina","se"],["S. Carolina","se"],["Tennessee","se"],["Virginia","se"],["W. Virginia","se"],
              ["Connecticut","ne"],["Delaware","ne"],["Maine","ne"],["Maryland","ne"],["Massachusetts","ne"],["New Hampshire","ne"],["New Jersey","ne"],["New York","ne"],["Pennsylvania","ne"],["Rhode Island","ne"],["Vermont","ne"],
              ["Illinois","mw"],["Indiana","mw"],["Iowa","mw"],["Kansas","mw"],["Michigan","mw"],["Minnesota","mw"],["Missouri","mw"],["Nebraska","mw"],["N. Dakota","mw"],["Ohio","mw"],["S. Dakota","mw"],["Wisconsin","mw"],
              ["Arkansas","sw"],["Louisiana","sw"],["Oklahoma","sw"],["Texas","sw"],
              ["Arizona","mt"],["Colorado","mt"],["Idaho","mt"],["Montana","mt"],["Nevada","mt"],["New Mexico","mt"],["Utah","mt"],["Wyoming","mt"],
              ["Alaska","w"],["California","w"],["Hawaii","w"],["Oregon","w"],["Washington","w"]
            ].map(([state, reg]) => (
              <span key={state} className={`state-tag reg-${reg}`}>{state}</span>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div style={{ marginBottom: 48 }}>
          <div className="display" style={{ fontSize: 34, letterSpacing: 1, textAlign: "center", marginBottom: 20 }}>How We Help You</div>
          {[
            ["01","Tell Us What Happened","30 seconds. Just your name, phone, state, and when it happened. No documents, no stress."],
            ["02","We Reach You Instantly","Our team calls and texts you simultaneously within seconds — a real person ready to listen and help."],
            ["03","Get the Right Attorney Fighting for You","We match you with a licensed personal injury attorney in your state. Contingency only — you pay nothing unless you win."],
          ].map(([n,t,b]) => (
            <div key={n} style={{ display: "flex", gap: 18, padding: 20, background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, marginBottom: 10 }}>
              <div className="display" style={{ fontSize: 40, lineHeight: 1, minWidth: 42, color: "rgba(45,255,208,0.18)" }}>{n}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{t}</div>
                <div style={{ fontSize: 13, color: "#8892a4", lineHeight: 1.6 }}>{b}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.09)", padding: "28px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div className="display" style={{ fontSize: 20, letterSpacing: 2, color: "#3d4556", marginBottom: 8 }}>
          Injured<span style={{ color: "rgba(45,255,208,0.3)" }}>Help</span>.ai
        </div>
        <p style={{ fontSize: 11, color: "#3d4556", lineHeight: 1.7 }}>
          © 2026 InjuredHelp.ai — All rights reserved.<br />
          InjuredHelp.ai is a legal matching service, not a law firm. Available in all 50 states. Results vary by case.
        </p>
      </footer>
    </main>
  );
}

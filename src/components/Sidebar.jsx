import { SCENARIOS, ANOMALIES, C } from "../constants";

function SectionDivider({ label }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "8px",
      padding: "12px 14px 5px",
    }}>
      <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
      <span style={{ fontSize: "7px", letterSpacing: "3px", color: "#1e2535", textTransform: "uppercase" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" }} />
    </div>
  );
}

export function Sidebar({ scenario, setSc, anomaly, setAn, useCust, setUC, showSl, setSSl, cBpm, setCBpm }) {
  const an = anomaly ? ANOMALIES[anomaly] : null;

  const scenarioBtn = (k, s) => {
    const active = scenario === k && !anomaly;
    return (
      <button
        key={k}
        onClick={() => { setSc(k); setAn(null); setUC(false); }}
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          width: "100%", padding: "7px 14px", textAlign: "left",
          background: active ? `${C.y}0f` : "transparent",
          border: "none",
          borderLeft: `2px solid ${active ? C.y : "transparent"}`,
          color: active ? C.y : "#3a4560",
          fontFamily: "monospace", fontSize: "11px",
          cursor: "pointer", transition: "all 0.15s",
          letterSpacing: "0.5px",
        }}
      >
        <span style={{ fontSize: "7px", color: active ? C.y : "#1e2535" }}>{active ? "●" : "○"}</span>
        <span style={{ flex: 1 }}>{s.label}</span>
        <span style={{ fontSize: "9px", color: active ? `${C.y}88` : "#1e2535" }}>{s.tag}</span>
      </button>
    );
  };

  const anomalyBtn = (k, a) => {
    const active = anomaly === k;
    return (
      <button
        key={k}
        onClick={() => { setAn(anomaly === k ? null : k); if (anomaly === k) setSc("normal"); setUC(false); }}
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          width: "100%", padding: "7px 14px", textAlign: "left",
          background: active ? `${a.color}12` : "transparent",
          border: "none",
          borderLeft: `2px solid ${active ? a.color : "transparent"}`,
          color: active ? a.color : "#3a2535",
          fontFamily: "monospace", fontSize: "11px",
          cursor: "pointer", transition: "all 0.15s",
          letterSpacing: "0.5px",
        }}
      >
        <span style={{ fontSize: "7px", color: active ? a.color : "#2a1520" }}>{active ? "●" : "○"}</span>
        <span style={{ flex: 1 }}>{a.label}</span>
        <span style={{ fontSize: "9px", color: active ? `${a.color}88` : "#2a1520" }}>{a.tag}</span>
      </button>
    );
  };

  return (
    <aside style={{
      width: "220px",
      flexShrink: 0,
      borderRight: "1px solid rgba(255,255,255,0.05)",
      background: "rgba(0,0,0,0.15)",
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
      overflowX: "hidden",
    }}>
      {/* Scenarios */}
      <SectionDivider label="Escenarios fisiológicos" />
      {Object.entries(SCENARIOS).map(([k, s]) => scenarioBtn(k, s))}

      {/* Manual BPM */}
      <div style={{ padding: "8px 12px", borderTop: "1px solid rgba(255,255,255,0.03)", marginTop: "4px" }}>
        <button
          onClick={() => { setSSl(v => !v); setUC(true); }}
          style={{
            width: "100%", padding: "6px 10px",
            background: useCust && !anomaly ? "rgba(192,136,255,0.1)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${useCust && !anomaly ? "rgba(192,136,255,0.3)" : "rgba(255,255,255,0.06)"}`,
            color: useCust && !anomaly ? "#c088ff" : "#3a4560",
            fontFamily: "monospace", fontSize: "10px", letterSpacing: "1px",
            cursor: "pointer", borderRadius: "4px",
            transition: "all 0.15s",
          }}
        >
          BPM MANUAL
        </button>
        {showSl && !anomaly && (
          <div style={{
            marginTop: "8px", padding: "10px",
            background: "rgba(192,136,255,0.04)",
            border: "1px solid rgba(192,136,255,0.12)",
            borderRadius: "5px",
          }}>
            <div style={{
              display: "flex", alignItems: "baseline",
              justifyContent: "space-between", marginBottom: "6px",
            }}>
              <span style={{ fontSize: "8px", letterSpacing: "2px", color: "#c088ff" }}>BPM</span>
              <span style={{ fontSize: "18px", fontWeight: 700, color: "#c088ff" }}>{cBpm}</span>
            </div>
            <input
              type="range" min={30} max={200} value={cBpm}
              onChange={e => { setCBpm(Number(e.target.value)); setUC(true); }}
              style={{ width: "100%", accentColor: "#c088ff" }}
            />
            <div style={{
              display: "flex", justifyContent: "space-between",
              fontSize: "7px", color: "#3a4560", marginTop: "3px",
            }}>
              <span>30</span><span>200</span>
            </div>
          </div>
        )}
      </div>

      {/* Anomalies */}
      <SectionDivider label="Condiciones patológicas" />
      {Object.entries(ANOMALIES).map(([k, a]) => anomalyBtn(k, a))}

      {/* Anomaly info */}
      {anomaly && an && (
        <div style={{
          margin: "10px 10px 14px",
          background: `${an.color}0a`,
          border: `1px solid ${an.color}28`,
          borderRadius: "6px",
          padding: "10px 12px",
        }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ width: "2px", background: an.color, borderRadius: "2px", flexShrink: 0, alignSelf: "stretch" }} />
            <div>
              <div style={{
                color: an.color, fontSize: "10px",
                fontWeight: 700, letterSpacing: "1px", marginBottom: "5px",
              }}>
                {an.label.toUpperCase()}
              </div>
              <div style={{ color: "#8899bb", fontSize: "9px", lineHeight: 1.6, marginBottom: "5px" }}>
                {an.desc}
              </div>
              <div style={{ color: "#3a4560", fontSize: "8px", lineHeight: 1.5 }}>
                {an.detail}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: "auto", padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
        <div style={{ fontSize: "7px", color: "#0e1420", letterSpacing: "1px", lineHeight: 1.7 }}>
          Eje Z sagital · dorso-ventral<br />
          240 Hz · Nyquist &lt; 120 Hz
        </div>
      </div>
    </aside>
  );
}

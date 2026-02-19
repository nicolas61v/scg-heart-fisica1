import { C } from "../constants";

export function StatBar({ bpmV, phase, beatN, acol, useCust }) {
  const stats = [
    { label: "FREC. CARDÍACA", value: `${bpmV} BPM`, color: useCust ? "#c088ff" : acol },
    { label: "FASE CARDÍACA",  value: phase,           color: phase === "Systole" ? "#e05060" : C.y },
    { label: "N° LATIDO",      value: String(beatN).padStart(4, "0"), color: "#3a4a70" },
    { label: "MUESTREO",       value: "240 Hz",        color: C.z },
    { label: "NYQUIST",        value: "CUMPLE ✓",      color: C.x },
  ];

  return (
    <div style={{
      display: "flex",
      flexShrink: 0,
      height: "46px",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      background: "rgba(0,0,0,0.2)",
    }}>
      {stats.map(({ label, value, color }, i) => (
        <div key={label} style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
          padding: "0 8px",
        }}>
          <div style={{
            fontSize: "6px", letterSpacing: "2px",
            color: "#1e2535", textTransform: "uppercase", marginBottom: "3px",
          }}>
            {label}
          </div>
          <div style={{ fontSize: "13px", fontWeight: 700, color, lineHeight: 1 }}>
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}

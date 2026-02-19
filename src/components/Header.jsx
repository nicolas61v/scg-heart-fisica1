export function Header() {
  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      height: "54px",
      flexShrink: 0,
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(255,255,255,0.01)",
    }}>
      {/* Left: logo + title */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{
          fontSize: "22px", lineHeight: 1,
          filter: "drop-shadow(0 0 6px #e05060)",
        }}>♥</div>
        <div>
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "3px", color: "#dde8ff" }}>
            SCG MONITOR
          </div>
          <div style={{ fontSize: "7px", letterSpacing: "3px", color: "#1e2535", marginTop: "2px" }}>
            SISMOCARDIOGRAFÍA
          </div>
        </div>
      </div>

      {/* Center: main title */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: "clamp(10px, 1.2vw, 14px)", fontWeight: 600,
          color: "#8899bb", letterSpacing: "1px",
        }}>
          Aceleración del Cuerpo Humano
        </div>
        <div style={{ fontSize: "7px", color: "#1e2535", letterSpacing: "3px", marginTop: "3px" }}>
          EXPOSICIÓN · TEMA 3 · FÍSICA &amp; BIOLOGÍA · EAFIT
        </div>
      </div>

      {/* Right: version / info */}
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: "9px", color: "#2a3550", letterSpacing: "2px" }}>
          INTERACTIVE MONITOR
        </div>
        <div style={{ fontSize: "8px", color: "#1e2535", letterSpacing: "2px", marginTop: "3px" }}>
          v3.0 · 240 Hz
        </div>
      </div>
    </header>
  );
}

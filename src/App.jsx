import { useSCG } from "./hooks/useSCG";
import { SCENARIOS, ANOMALIES, C } from "./constants";
import { Header }       from "./components/Header";
import { StatBar }      from "./components/StatBar";
import { Sidebar }      from "./components/Sidebar";
import { HeartScene }   from "./components/HeartScene";
import { SignalGraphs } from "./components/SignalGraphs";
import { RibbonScene }  from "./components/RibbonScene";

export default function App() {
  const {
    scenario, setSc, anomaly, setAn, cBpm, setCBpm,
    useCust, setUC, showSl, setSSl, phase, beatN, view, setView,
    cZ, cX, cY, dZ, dX, dY, bStart, bLen, bAmp, scRef, anRef, ucRef, cbRef,
  } = useSCG();

  const an   = anomaly ? ANOMALIES[anomaly] : null;
  const sc   = an || SCENARIOS[scenario];
  const bpmV = useCust ? cBpm : sc.bpm;
  const acol = an ? an.color : C.y;

  return (
    <div style={{
      height: "100vh", width: "100vw",
      display: "flex", flexDirection: "column",
      background: "#060810", color: "#c8d4f0",
      fontFamily: "monospace", overflow: "hidden",
    }}>
      <Header />

      <StatBar bpmV={bpmV} phase={phase} beatN={beatN} acol={acol} useCust={useCust} />

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        <Sidebar
          scenario={scenario} setSc={setSc}
          anomaly={anomaly}   setAn={setAn}
          useCust={useCust}   setUC={setUC}
          showSl={showSl}     setSSl={setSSl}
          cBpm={cBpm}         setCBpm={setCBpm}
        />

        {/* Right column: tabs + panels */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* View tabs */}
          <div style={{
            display: "flex", alignItems: "center",
            padding: "0 12px",
            height: "40px", flexShrink: 0,
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}>
            {[["2d", "SEÑALES  2D"], ["3d", "MAPA  3D"]].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: "5px 20px",
                  fontSize: "10px", letterSpacing: "2px",
                  border: `1px solid ${view === v ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)"}`,
                  borderRadius: "4px", marginRight: "6px",
                  background: view === v ? "rgba(255,255,255,0.07)" : "transparent",
                  color: view === v ? "#dde8ff" : "#2a3550",
                  cursor: "pointer", fontFamily: "monospace",
                  transition: "all 0.15s",
                }}
              >
                {l}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <div style={{ fontSize: "7px", color: "#1e2535", letterSpacing: "2px" }}>
              {view === "2d"
                ? "SEÑAL SCG · TIEMPO REAL · 240 Hz"
                : "MAPA 3D · ARRASTRAR PARA ROTAR"}
            </div>
          </div>

          {/* Panel area — both views always mounted, toggled via opacity */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>

            {/* ── 2D View ── */}
            <div style={{
              position: "absolute", inset: 0,
              opacity: view === "2d" ? 1 : 0,
              pointerEvents: view === "2d" ? "auto" : "none",
              transition: "opacity 0.25s",
              display: "flex",
              gap: "8px",
              padding: "8px 8px 8px 8px",
            }}>
              {/* Heart 3D panel */}
              <div style={{
                width: "300px", flexShrink: 0,
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "8px", overflow: "hidden",
                position: "relative", background: "#050710",
              }}>
                <HeartScene
                  bStart={bStart} bLen={bLen} bAmp={bAmp}
                  scRef={scRef} anRef={anRef} ucRef={ucRef} cbRef={cbRef}
                />
                {/* Overlay labels */}
                <div style={{
                  position: "absolute", top: 9, left: 11,
                  fontSize: "7px", letterSpacing: "2px", color: "#1e2535",
                  pointerEvents: "none",
                }}>
                  CORAZÓN 3D · ACELERÓMETRO
                </div>
                <div style={{
                  position: "absolute", bottom: 9, right: 9,
                  fontSize: "9px", lineHeight: 2.1,
                  background: "rgba(5,7,16,0.88)",
                  padding: "5px 11px", borderRadius: "5px",
                  border: "1px solid rgba(255,255,255,0.05)",
                  pointerEvents: "none",
                }}>
                  <div style={{ color: C.x }}>─  X  Horizontal</div>
                  <div style={{ color: C.y }}>─  Y  Vertical</div>
                  <div style={{ color: C.z, fontWeight: 700 }}>─  Z  Sagital  ★</div>
                </div>
              </div>

              {/* Signal graphs */}
              <SignalGraphs cZ={cZ} cX={cX} cY={cY} />
            </div>

            {/* ── 3D Ribbon View ── */}
            <div style={{
              position: "absolute", inset: 0,
              opacity: view === "3d" ? 1 : 0,
              pointerEvents: view === "3d" ? "auto" : "none",
              transition: "opacity 0.25s",
            }}>
              <RibbonScene dZ={dZ} dX={dX} dY={dY} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

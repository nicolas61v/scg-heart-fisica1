import { useEffect, useRef, useState } from "react";
import { GP, SR, SCENARIOS, ANOMALIES, C } from "../constants";
import { scgSample, drawGraph } from "../utils/scg";

export function useSCG() {
  // Canvas refs (assigned by SignalGraphs component)
  const cZ = useRef(null);
  const cX = useRef(null);
  const cY = useRef(null);

  // Signal data buffers
  const dZ = useRef(new Float32Array(GP).fill(0));
  const dX = useRef(new Float32Array(GP).fill(0));
  const dY = useRef(new Float32Array(GP).fill(0));

  // Beat tracking
  const lastSmp = useRef(Date.now());
  const bIdx    = useRef(0);
  const bStart  = useRef(Date.now());
  const bLen    = useRef(60000 / 72);
  const bAmp    = useRef(1.0);

  // Mutable refs for animation loops (avoid stale closures)
  const scRef  = useRef("normal");
  const anRef  = useRef(null);
  const cbRef  = useRef(72);
  const ucRef  = useRef(false);

  // UI state
  const [scenario, setSc]   = useState("normal");
  const [anomaly,  setAn]   = useState(null);
  const [cBpm,     setCBpm] = useState(72);
  const [useCust,  setUC]   = useState(false);
  const [showSl,   setSSl]  = useState(false);
  const [phase,    setPh]   = useState("Diastole");
  const [beatN,    setBN]   = useState(0);
  const [view,     setView] = useState("2d");

  // Keep animation refs in sync with state
  useEffect(() => { scRef.current = scenario; anRef.current = null; }, [scenario]);
  useEffect(() => { anRef.current = anomaly; if (anomaly) scRef.current = null; }, [anomaly]);
  useEffect(() => { cbRef.current = cBpm; }, [cBpm]);
  useEffect(() => { ucRef.current = useCust; }, [useCust]);

  // Signal generation loop
  useEffect(() => {
    let af;
    const loop = () => {
      af = requestAnimationFrame(loop);
      const now = Date.now();
      const an = anRef.current;
      const sc = an ? ANOMALIES[an] : SCENARIOS[scRef.current];
      if (!sc) return;

      const bpm = ucRef.current ? cbRef.current : sc.bpm;
      const amp = ucRef.current ? 1.0 : (sc.amplitude || 1.0);
      const nz  = sc.noise || 0.05;

      if (now - bStart.current >= bLen.current) {
        bIdx.current += 1;
        setBN(bIdx.current);
        const bi = bIdx.current;
        let na = amp, ni = 1.0;
        if (an && ANOMALIES[an]) {
          na = ANOMALIES[an].modifyBeat(bi, 0, amp);
          ni = ANOMALIES[an].modifyInterval(bi);
        }
        bLen.current  = (60000 / bpm) * ni;
        bStart.current = now;
        bAmp.current   = na;
      }

      const bp = Math.min((now - bStart.current) / bLen.current, 1.0);
      setPh(bp < 0.35 ? "Systole" : "Diastole");

      const toAdd = Math.floor((now - lastSmp.current) / (1000 / SR));
      if (toAdd > 0) {
        lastSmp.current = now;
        for (let i = 0; i < Math.min(toAdd, 12); i++) {
          const s = scgSample(bp, bAmp.current, nz + (an === "fibrilacion" ? .1 : 0));
          dZ.current.copyWithin(0, 1); dZ.current[GP - 1] = s.z;
          dX.current.copyWithin(0, 1); dX.current[GP - 1] = s.x;
          dY.current.copyWithin(0, 1); dY.current[GP - 1] = s.y;
        }
        drawGraph(cZ.current, dZ.current, C.z, "Z", true);
        drawGraph(cX.current, dX.current, C.x, "X", false);
        drawGraph(cY.current, dY.current, C.y, "Y", false);
      }
    };
    af = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(af);
  }, []);

  return {
    // State
    scenario, setSc,
    anomaly, setAn,
    cBpm, setCBpm,
    useCust, setUC,
    showSl, setSSl,
    phase, beatN,
    view, setView,
    // Canvas refs (for SignalGraphs)
    cZ, cX, cY,
    // Data refs (for RibbonScene)
    dZ, dX, dY,
    // Beat refs (for HeartScene animation)
    bStart, bLen, bAmp,
    // Reactive refs (for HeartScene animation)
    scRef, anRef, ucRef, cbRef,
  };
}

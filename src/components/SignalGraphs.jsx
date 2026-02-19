import { useLayoutEffect, useRef } from "react";
import { C } from "../constants";

export function SignalGraphs({ cZ, cX, cY }) {
  const zWrap = useRef(null);
  const xWrap = useRef(null);
  const yWrap = useRef(null);

  // Keep canvas pixel dimensions in sync with layout
  useLayoutEffect(() => {
    const resize = () => {
      const pairs = [
        [cZ.current, zWrap.current],
        [cX.current, xWrap.current],
        [cY.current, yWrap.current],
      ];
      for (const [canvas, container] of pairs) {
        if (canvas && container) {
          canvas.width  = container.clientWidth;
          canvas.height = container.clientHeight;
        }
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    [zWrap.current, xWrap.current, yWrap.current].forEach(el => el && ro.observe(el));
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      padding: "6px 8px 6px 0",
      overflow: "hidden",
      minWidth: 0,
    }}>
      {/* Z axis label */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <div style={{ width: "14px", height: "2px", background: C.z, flexShrink: 0 }} />
        <span style={{ fontSize: "8px", letterSpacing: "2px", color: C.z }}>Z — SAGITAL (eje principal)</span>
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.04)" }} />
        <span style={{ fontSize: "7px", letterSpacing: "2px", color: "#1e2535" }}>SEÑAL EN TIEMPO REAL</span>
      </div>

      {/* Z canvas */}
      <div
        ref={zWrap}
        style={{
          flex: 1,
          background: `${C.z}07`,
          border: `1px solid ${C.z}22`,
          borderRadius: "6px",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        <canvas ref={cZ} style={{ display: "block" }} />
      </div>

      {/* X and Y row */}
      <div style={{ display: "flex", gap: "6px", height: "100px", flexShrink: 0 }}>
        {/* X */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "3px", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
            <div style={{ width: "10px", height: "1.5px", background: C.x, flexShrink: 0 }} />
            <span style={{ fontSize: "7px", letterSpacing: "1.5px", color: C.x }}>X — HORIZONTAL</span>
          </div>
          <div
            ref={xWrap}
            style={{
              flex: 1,
              background: `${C.x}06`,
              border: `1px solid ${C.x}1c`,
              borderRadius: "5px",
              overflow: "hidden",
              minHeight: 0,
            }}
          >
            <canvas ref={cX} style={{ display: "block" }} />
          </div>
        </div>

        {/* Y */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "3px", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
            <div style={{ width: "10px", height: "1.5px", background: C.y, flexShrink: 0 }} />
            <span style={{ fontSize: "7px", letterSpacing: "1.5px", color: C.y }}>Y — VERTICAL</span>
          </div>
          <div
            ref={yWrap}
            style={{
              flex: 1,
              background: `${C.y}06`,
              border: `1px solid ${C.y}1c`,
              borderRadius: "5px",
              overflow: "hidden",
              minHeight: 0,
            }}
          >
            <canvas ref={cY} style={{ display: "block" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

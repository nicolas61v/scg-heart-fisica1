import { useEffect, useRef } from "react";
import * as THREE from "three";
import { C, RP } from "../constants";

export function RibbonScene({ dZ, dX, dY }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let cleanupFn = null;

    const tid = setTimeout(() => {
      const W = el.clientWidth  || 800;
      const H = el.clientHeight || 400;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x060810);
      scene.fog = new THREE.Fog(0x060810, 12, 26);

      const cam = new THREE.PerspectiveCamera(45, W / H, .1, 100);
      cam.position.set(0, 4, 9);
      cam.lookAt(0, 0, 0);

      const ren = new THREE.WebGLRenderer({ antialias: true });
      ren.setSize(W, H);
      ren.setPixelRatio(Math.min(devicePixelRatio, 2));
      el.appendChild(ren.domElement);

      scene.add(new THREE.AmbientLight(0xffffff, .5));
      const dl = new THREE.DirectionalLight(0xffffff, 1);
      dl.position.set(4, 8, 4);
      scene.add(dl);
      scene.add(new THREE.GridHelper(20, 20, 0x0e1028, 0x090b1e));

      // YS: visual scale — higher = taller/more dramatic waves in 3D
      const YS = 2.5;

      // Horizontal reference lines + labels
      [-1, -.5, 0, .5, 1].forEach(v => {
        const yy = v * YS;
        const geo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-6.5, yy, 0),
          new THREE.Vector3(6.5,  yy, 0),
        ]);
        scene.add(new THREE.Line(geo, new THREE.LineBasicMaterial({
          color: v === 0 ? 0x1e2e6e : 0x10142a,
          transparent: true, opacity: v === 0 ? .5 : .3,
        })));
        const cv = document.createElement("canvas");
        cv.width = 64; cv.height = 26;
        const cx2 = cv.getContext("2d");
        cx2.fillStyle = v === 0 ? "#5566aa" : "#223";
        cx2.font = "bold 12px monospace";
        cx2.textAlign = "center";
        cx2.fillText(v > 0 ? `+${v}` : v === 0 ? "0" : `${v}`, 32, 20);
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true }));
        sp.scale.set(.6, .28, 1);
        sp.position.set(-7.2, yy, 0);
        scene.add(sp);
      });

      const makeLabel = (text, col, px, py, pz, w = 160) => {
        const cv = document.createElement("canvas");
        cv.width = w; cv.height = 26;
        const cx2 = cv.getContext("2d");
        cx2.fillStyle = col;
        cx2.font = "bold 11px monospace";
        cx2.textAlign = "left";
        cx2.fillText(text, 2, 19);
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true }));
        sp.scale.set(w / 90, .28, 1);
        sp.position.set(px, py, pz);
        scene.add(sp);
      };
      makeLabel("Z  Sagital",    C.z,  7.5,  0,    0);
      makeLabel("X  Horizontal", C.x,  7.5,  0,    1.6);
      makeLabel("Y  Vertical",   C.y,  7.5,  0,   -1.6);
      makeLabel("m/s²",         "#334466", -7.2, YS + .6, 0, 64);
      makeLabel("tiempo (s) →", "#2a3444",  0,  -2.4,    0, 140);

      // Ribbon maker (main line + soft glow)
      const makeRib = (col, z) => {
        const pts = [];
        for (let i = 0; i < RP; i++) pts.push(new THREE.Vector3(0, 0, 0));
        const geo  = new THREE.BufferGeometry().setFromPoints(pts);
        const geo2 = new THREE.BufferGeometry().setFromPoints(pts.map(p => p.clone()));
        const line = new THREE.Line(geo,  new THREE.LineBasicMaterial({ color: new THREE.Color(col), linewidth: 2 }));
        const glow = new THREE.Line(geo2, new THREE.LineBasicMaterial({ color: new THREE.Color(col), linewidth: 6, transparent: true, opacity: .18 }));
        line.position.z = z;
        glow.position.z = z;
        scene.add(line);
        scene.add(glow);
        return { geo, geo2 };
      };
      const gZ = makeRib(C.z, 0);
      const gX = makeRib(C.x, 1.6);
      const gY = makeRib(C.y, -1.6);

      // Smoothing
      const WINDOW = 8;
      const smooth = (src, i) => {
        const center = Math.floor((i / RP) * src.length);
        let sum = 0, count = 0;
        for (let w = -WINDOW; w <= WINDOW; w++) {
          const idx = center + w;
          if (idx >= 0 && idx < src.length) {
            const weight = 1 - Math.abs(w) / (WINDOW + 1);
            sum += src[idx] * weight;
            count += weight;
          }
        }
        return count > 0 ? sum / count : 0;
      };

      const smZ = new Float32Array(RP);
      const smX = new Float32Array(RP);
      const smY = new Float32Array(RP);

      const upd = (rib, src, sm) => {
        const pa  = rib.geo.attributes.position;
        const pa2 = rib.geo2.attributes.position;
        for (let i = 0; i < RP; i++) sm[i] = smooth(src, i);
        for (let i = 0; i < RP; i++) {
          const raw = i === 0 ? sm[i] : i === RP - 1 ? sm[i] : sm[i - 1] * .25 + sm[i] * .5 + sm[i + 1] * .25;
          // Soft-clamp to ±1.8 so waves stay visible and don't fly off-screen
          const v = Math.sign(raw) * Math.min(Math.abs(raw), 1.8);
          const x = -6.5 + (i / (RP - 1)) * 13;
          pa.setXYZ(i, x, v * YS, 0);
          pa2.setXYZ(i, x, v * YS, 0);
        }
        pa.needsUpdate  = true;
        pa2.needsUpdate = true;
      };

      // Camera — raised to see taller waves comfortably
      const RADIUS = 10;
      let ang = 0.42;
      cam.position.set(Math.sin(ang) * RADIUS, 5, Math.cos(ang) * RADIUS);
      cam.lookAt(0, 0, 0);

      // Drag to rotate
      let drag = false, lx = 0, ly = 0;
      const onDown = e => { drag = true; lx = e.clientX; ly = e.clientY; el.style.cursor = "grabbing"; };
      const onUp   = () => { drag = false; el.style.cursor = "grab"; };
      const onMove = e => {
        if (!drag) return;
        ang += (e.clientX - lx) * .012;
        cam.position.x = Math.sin(ang) * RADIUS;
        cam.position.z = Math.cos(ang) * RADIUS;
        cam.position.y = Math.max(1, Math.min(8, cam.position.y - (e.clientY - ly) * .04));
        lx = e.clientX; ly = e.clientY;
        cam.lookAt(0, 0, 0);
      };
      el.addEventListener("mousedown", onDown);
      window.addEventListener("mouseup", onUp);
      window.addEventListener("mousemove", onMove);

      let af;
      const loop = () => {
        af = requestAnimationFrame(loop);
        upd(gZ, dZ.current, smZ);
        upd(gX, dX.current, smX);
        upd(gY, dY.current, smY);
        ren.render(scene, cam);
      };
      loop();

      cleanupFn = () => {
        cancelAnimationFrame(af);
        el.removeEventListener("mousedown", onDown);
        window.removeEventListener("mouseup", onUp);
        window.removeEventListener("mousemove", onMove);
        ren.dispose();
        if (el.contains(ren.domElement)) el.removeChild(ren.domElement);
      };
    }, 100);

    return () => {
      clearTimeout(tid);
      cleanupFn?.();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Hint */}
      <div style={{
        padding: "6px 14px", flexShrink: 0,
        fontSize: "8px", color: "#1e2535", letterSpacing: "3px",
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <span>MAPA 3D · ARRASTRAR PARA ROTAR</span>
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.04)" }} />
        {[[C.z, "Z — Sagital"], [C.x, "X — Horizontal"], [C.y, "Y — Vertical"]].map(([col, l]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "12px", height: "1.5px", background: col }} />
            <span style={{ color: col }}>{l}</span>
          </div>
        ))}
      </div>
      {/* Mount point */}
      <div
        ref={mountRef}
        style={{
          flex: 1,
          borderRadius: "6px",
          overflow: "hidden",
          cursor: "grab",
          margin: "0 8px 8px",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      />
    </div>
  );
}

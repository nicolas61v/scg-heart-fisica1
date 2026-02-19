import { useEffect, useRef } from "react";
import * as THREE from "three";
import { C, SCENARIOS, ANOMALIES } from "../constants";

export function HeartScene({ bStart, bLen, bAmp, scRef, anRef, ucRef, cbRef }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let cleanupFn = null;

    const tid = setTimeout(() => {
      const W = el.clientWidth  || 280;
      const H = el.clientHeight || 400;

      const scene = new THREE.Scene();
      const cam   = new THREE.PerspectiveCamera(45, W / H, .1, 100);
      cam.position.set(0, 0, 5);

      const ren = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      ren.setSize(W, H);
      ren.setPixelRatio(Math.min(devicePixelRatio, 2));
      el.appendChild(ren.domElement);

      // Lights
      scene.add(new THREE.AmbientLight(0xffffff, .25));
      [[[3, 3, 3], 0xff2244, 3], [[-3, -2, 2], 0x3344ff, 1]].forEach(([[x, y, z], col, i]) => {
        const pl = new THREE.PointLight(col, i === 0 ? 3 : 1, 20);
        pl.position.set(x, y, z);
        scene.add(pl);
      });
      const dl = new THREE.DirectionalLight(0xffffff, .6);
      dl.position.set(0, 5, -2);
      scene.add(dl);

      // Heart shape
      const hs = new THREE.Shape();
      hs.moveTo(0, 0);
      hs.bezierCurveTo(0, .4, .8, .8, .8, 1.4);
      hs.bezierCurveTo(.8, 2, 0, 2.2, 0, 2.8);
      hs.bezierCurveTo(0, 2.2, -.8, 2, -.8, 1.4);
      hs.bezierCurveTo(-.8, .8, 0, .4, 0, 0);
      const hg  = new THREE.ExtrudeGeometry(hs, { depth: .55, bevelEnabled: true, bevelSegments: 6, steps: 2, bevelSize: .15, bevelThickness: .15 });
      hg.center();
      const mat = new THREE.MeshPhongMaterial({
        color: 0xcc1133, emissive: 0x440011, specular: 0xffffff,
        shininess: 120, transparent: true, opacity: .95,
      });
      const heart = new THREE.Mesh(hg, mat);
      heart.rotation.x = Math.PI;
      heart.scale.set(.52, .52, .52);
      scene.add(heart);

      // Glow sphere
      const gm = new THREE.MeshBasicMaterial({ color: 0xff1133, transparent: true, opacity: .05, side: THREE.BackSide });
      scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.6, 28, 28), gm));

      // Grid
      const grid = new THREE.GridHelper(6, 6, 0x111122, 0x0d0d1a);
      grid.position.y = -1.6;
      scene.add(grid);

      // Axis arrows
      [[1, 0, 0, C.x], [0, 1, 0, C.y], [0, 0, 1, C.z]].forEach(([x, y, z, c]) =>
        scene.add(new THREE.ArrowHelper(
          new THREE.Vector3(x, y, z), new THREE.Vector3(), 1.8,
          new THREE.Color(c), .12, .06,
        ))
      );

      // Particles
      const pp = new Float32Array(80 * 3);
      for (let i = 0; i < pp.length; i++) pp[i] = (Math.random() - .5) * 7;
      const pg = new THREE.BufferGeometry();
      pg.setAttribute("position", new THREE.BufferAttribute(pp, 3));
      const pts = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xff2244, size: .03, transparent: true, opacity: .3 }));
      scene.add(pts);

      let af;
      const animate = () => {
        af = requestAnimationFrame(animate);
        const an = anRef.current;
        const sc = an ? ANOMALIES[an] : SCENARIOS[scRef.current];
        if (!sc) { ren.render(scene, cam); return; }

        const bpm = ucRef.current ? cbRef.current : sc.bpm;
        const bp  = Math.min((Date.now() - bStart.current) / bLen.current, 1.0);
        const ba  = bAmp.current;

        let s = .52;
        if (ba < .05) s = .50;
        else if (bp < .15) s = .52 + Math.sin((bp / .15) * Math.PI) * (.09 + ba * .05);
        else if (bp < .35) s = .52 + Math.sin(((bp - .15) / .20) * Math.PI) * .04;

        heart.scale.set(s, s, s);
        gm.opacity = .03 + (s - .52) * .45;
        mat.emissive.setRGB((s - .52) * 1.0, 0, .04);
        heart.rotation.y += .003 + (bpm / 200) * .01;
        pts.rotation.y += .0006;
        ren.render(scene, cam);
      };
      animate();

      cleanupFn = () => {
        cancelAnimationFrame(af);
        ren.dispose();
        if (el.contains(ren.domElement)) el.removeChild(ren.domElement);
      };
    }, 50);

    return () => {
      clearTimeout(tid);
      cleanupFn?.();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
  );
}

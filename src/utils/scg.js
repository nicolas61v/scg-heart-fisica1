export function scgSample(bp, amp, noise) {
  if (amp < 0.01) return {
    z: (Math.random() - .5) * noise * 3,
    x: (Math.random() - .5) * noise,
    y: (Math.random() - .5) * noise,
  };
  let z = 0, x = 0, y = 0;
  const n = () => (Math.random() - .5) * noise * 2;
  const seg = (lo, hi, fn) => {
    if (bp > lo && bp < hi) {
      const p = Math.sin((bp - lo) / (hi - lo) * Math.PI);
      fn(p);
    }
  };
  seg(.05, .15, p => { z += p * .85 * amp; x += p * .18 * amp; y += p * .22 * amp; });
  seg(.15, .32, p => { z -= p * .45 * amp; y -= p * .30 * amp; });
  seg(.32, .45, p => { z += p * .35 * amp; x += p * .12 * amp; });
  seg(.50, .65, p => { z -= p * .25 * amp; y -= p * .18 * amp; x += p * .08 * amp; });
  seg(.65, .78, p => { z += p * .15 * amp; });
  if (noise > .12) {
    z += Math.sin(bp * 47) * noise * .3;
    y += Math.sin(bp * 43) * noise * .2;
  }
  return { z: z + n(), x: x + n() * .5, y: y + n() * .7 };
}

export function drawGraph(canvas, data, color, label, showAxis) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  const PAD = showAxis ? 40 : 6;
  const pw = w - PAD - 6;
  ctx.clearRect(0, 0, w, h);
  // Range ±2.0 — accommodates max amplitude from all scenarios (ejercicio ~1.6, taquicardia ~1.4)
  const toY = v => h / 2 - (v / 2.0) * (h / 2 - 5);

  [-1, -.5, 0, .5, 1].forEach(v => {
    const cy = toY(v);
    ctx.strokeStyle = v === 0 ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.04)";
    ctx.lineWidth = v === 0 ? 1 : .7;
    ctx.beginPath(); ctx.moveTo(PAD, cy); ctx.lineTo(w - 6, cy); ctx.stroke();
    if (showAxis) {
      ctx.fillStyle = v === 0 ? "rgba(255,255,255,0.48)" : "rgba(255,255,255,0.20)";
      ctx.font = "8px monospace";
      ctx.textAlign = "right";
      ctx.fillText(v > 0 ? `+${v}` : v === 0 ? "0" : `${v}`, PAD - 4, cy + 3);
    }
  });

  if (showAxis) {
    ctx.strokeStyle = "rgba(255,255,255,0.09)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PAD, 0); ctx.lineTo(PAD, h); ctx.stroke();
    ctx.save();
    ctx.translate(10, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.font = "7px monospace";
    ctx.textAlign = "center";
    ctx.fillText("m/s²", 0, 0);
    ctx.restore();
  }

  if (label === "Z") {
    const sx = PAD + pw * .04, sw = pw * .36;
    ctx.fillStyle = "rgba(255,55,55,0.04)"; ctx.fillRect(sx, 2, sw, h - 4);
    ctx.fillStyle = "rgba(74,158,255,0.04)"; ctx.fillRect(sx + sw, 2, pw * .58, h - 4);
    ctx.font = "7px monospace"; ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,80,80,0.52)"; ctx.fillText("SYSTOLE", sx + 3, 10);
    ctx.fillStyle = "rgba(74,158,255,0.52)"; ctx.fillText("DIASTOLE", sx + sw + 3, 10);
  }

  ctx.strokeStyle = color;
  ctx.lineWidth = label === "Z" ? 2 : 1.5;
  ctx.shadowColor = color;
  ctx.shadowBlur = label === "Z" ? 6 : 2;
  ctx.beginPath();
  for (let i = 0; i < data.length; i++) {
    const px = PAD + (i / (data.length - 1)) * pw;
    const py = toY(data[i]);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "8px monospace";
  ctx.textAlign = "left";
  ctx.fillText(label, PAD + 4, h - 4);
}

export const SR = 240, GSEC = 8, GP = SR * GSEC, RP = 280;

export const C = { z: "#f5c842", x: "#3ce8a0", y: "#4a9eff" };

export const SCENARIOS = {
  reposo:      { label: "Reposo",      bpm: 60,  amplitude: 0.70, noise: 0.030, tag: "60 BPM" },
  normal:      { label: "Normal",      bpm: 72,  amplitude: 1.00, noise: 0.040, tag: "72 BPM" },
  ejercicio:   { label: "Ejercicio",   bpm: 140, amplitude: 1.60, noise: 0.100, tag: "140 BPM" },
  taquicardia: { label: "Taquicardia", bpm: 170, amplitude: 1.40, noise: 0.180, tag: "170 BPM" },
  bradicardia: { label: "Bradicardia", bpm: 40,  amplitude: 0.55, noise: 0.025, tag: "40 BPM" },
};

export const ANOMALIES = {
  bigeminismo: {
    label: "Bigeminismo", bpm: 72, noise: 0.04, tag: "2:1", color: "#e8824a",
    desc: "Latido normal alternado con latido prematuro débil. Amplitud eje Z oscila en patrón 2:1.",
    detail: "Causa: despolarización ventricular prematura de origen ectópico.",
    modifyBeat: (i, _, a) => i % 2 === 1 ? a * 0.32 : a,
    modifyInterval: (i) => i % 2 === 1 ? 0.55 : 1.0,
  },
  extrasistole: {
    label: "Extrasístole", bpm: 72, noise: 0.04, tag: "c/5", color: "#d4b94a",
    desc: "Latido prematuro cada 5 ciclos, seguido de pausa compensatoria.",
    detail: "Causa: despolarización prematura. La pausa compensatoria es diagnósticamente clave.",
    modifyBeat: (i, _, a) => i % 5 === 3 ? a * 0.26 : a,
    modifyInterval: (i) => i % 5 === 3 ? 0.50 : i % 5 === 4 ? 1.65 : 1.0,
  },
  fibrilacion: {
    label: "Fibrilación A.", bpm: 95, noise: 0.15, tag: "irr.", color: "#cc4488",
    desc: "Ritmo completamente irregular. Amplitud y timing variables.",
    detail: "Causa: actividad eléctrica caótica en aurículas. Patrón SCG no periódico.",
    modifyBeat: (_, __, a) => a * (0.4 + Math.random() * 0.9),
    modifyInterval: () => 0.55 + Math.random() * 0.95,
  },
  bloqueo: {
    label: "Bloqueo 2:1", bpm: 72, noise: 0.03, tag: "2:1", color: "#9955dd",
    desc: "Un latido ventricular se bloquea cada 2 ciclos. Pausa larga detectable.",
    detail: "Causa: fallo en conducción AV (bloqueo AV de segundo grado).",
    modifyBeat: (i, _, a) => i % 2 === 1 ? 0 : a,
    modifyInterval: (i) => i % 2 === 1 ? 1.9 : 1.0,
  },
  flutter: {
    label: "Flutter A.", bpm: 150, noise: 0.05, tag: "150", color: "#3aaa88",
    desc: "Sístoles frecuentes pero incompletas. Diástole insuficiente.",
    detail: "Causa: circuito de reentrada auricular organizado. Frecuencia auricular 250–350 lpm.",
    modifyBeat: (_, __, a) => a * 0.62,
    modifyInterval: () => 1.0,
  },
};

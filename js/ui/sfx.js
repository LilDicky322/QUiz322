// Sonidos chiptune con Web Audio (sin archivos de audio).
let ctx, muted = false;

function tone(freq, dur = 0.1, type = "square", delay = 0, vol = 0.05) {
  if (muted) return;
  ctx ||= new (window.AudioContext || window.webkitAudioContext)();
  const t = ctx.currentTime + delay, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + dur);
}

export const sfx = {
  start: () => [392, 523, 659].forEach((f, i) => tone(f, 0.1, "square", i * 0.09)),
  select: () => tone(660, 0.06),
  match: () => { tone(523, 0.08); tone(784, 0.14, "square", 0.08); },
  miss: () => tone(140, 0.25, "sawtooth"),
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, "square", i * 0.13)),
  toggle: () => (muted = !muted)
};

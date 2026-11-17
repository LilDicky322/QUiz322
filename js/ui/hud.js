import { calcScore, elapsedMs } from "../game/engine.js";

const $ = id => document.getElementById(id);
const fmt = ms => { const s = Math.floor(ms / 1000); return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); };
let timer;

export function updateHud(state) {
  $("hud-score").textContent = calcScore(state);
  $("hud-errors").textContent = state.errors;
  $("hud-time").textContent = fmt(elapsedMs(state));
}
export function startTimer(state) { stopTimer(); timer = setInterval(() => updateHud(state), 250); }
export function stopTimer() { clearInterval(timer); }

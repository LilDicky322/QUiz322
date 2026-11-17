import { loadLevels } from "./services/levels.js";
import { ensureUser } from "./services/auth.js";
import { saveScore, subscribeTop } from "./services/scores.js";
import { createState } from "./game/state.js";
import { pick, calcScore, elapsedMs } from "./game/engine.js";
import { renderBoard, itemEl } from "./ui/board.js";
import { updateHud, startTimer, stopTimer } from "./ui/hud.js";
import { renderTop } from "./ui/ranking.js";
import { show } from "./ui/screens.js";
import { sfx } from "./ui/sfx.js";

const $ = id => document.getElementById(id);
const NAME_KEY = "rc_player";
let state, levels = [], player = "", tags = {}, topRows = [], topErr = null;

const store = {
  get: () => { try { return localStorage.getItem(NAME_KEY) || ""; } catch { return ""; } },
  set: v => { try { localStorage.setItem(NAME_KEY, v); } catch {} }
};
const cleanName = s => s.normalize("NFC").replace(/[^\p{L}\p{N} .'’-]/gu, "").replace(/\s+/g, " ")
  .trim().slice(0, 20).trim().toLocaleUpperCase("es");
const drawTop = () => renderTop(topRows, topErr, tags, player);

async function init() {
  $("player-name").value = store.get();
  subscribeTop(10, (rows, err) => { topRows = rows; topErr = err || null; drawTop(); });
  try {
    levels = await loadLevels();
    levels.forEach(l => (tags[l.id] = l.tag));
    drawTop();
    renderMenu();
  } catch (e) {
    console.error(e);
    $("level-list").textContent = "ABRE EL JUEGO CON UN SERVIDOR LOCAL";
  }
  ensureUser().catch(e => console.warn("Auth:", e));
}

function renderMenu() {
  $("level-list").replaceChildren(...levels.map(lv => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn level";
    const t = document.createElement("span");
    t.textContent = lv.title + (lv.optional ? " · OPCIONAL" : "");
    const s = document.createElement("small");
    s.textContent = lv.subtitle;
    b.append(t, s);
    b.addEventListener("click", () => play(lv));
    return b;
  }));
}

function register() {
  const name = cleanName($("player-name").value);
  if (name.length < 2) { $("name-msg").textContent = "ESCRIBE TU NOMBRE (MÍN. 2 LETRAS)"; return; }
  player = name;
  store.set(name);
  $("player-name").value = name;
  $("name-msg").textContent = "";
  $("player-label").textContent = name;
  drawTop();
  sfx.start();
  show("menu");
}

function play(level) {
  state = createState(level);
  renderBoard(level, onPick);
  updateHud(state);
  startTimer(state);
  show("game");
  sfx.start();
}

function onPick(side, id) {
  if (state.locked) return;
  const ev = pick(state, side, id);
  const el = itemEl(side, id);
  switch (ev.type) {
    case "select":
      document.querySelectorAll(".item.selected").forEach(e => e.classList.remove("selected"));
      el.classList.add("selected");
      sfx.select();
      break;
    case "unselect":
      el.classList.remove("selected");
      break;
    case "match":
      [itemEl("A", id), itemEl("B", id)].forEach(e => { e.classList.remove("selected"); e.classList.add("matched"); });
      sfx.match();
      updateHud(state);
      if (ev.done) setTimeout(finish, 500);
      break;
    case "miss": {
      const els = [itemEl(ev.a.side, ev.a.id), el];
      state.locked = true;
      els.forEach(e => e.classList.add("wrong"));
      sfx.miss();
      updateHud(state);
      setTimeout(() => { els.forEach(e => e.classList.remove("wrong", "selected")); state.locked = false; }, 450);
      break;
    }
  }
}

async function finish() {
  stopTimer();
  sfx.win();
  const score = calcScore(state);
  const next = levels[levels.findIndex(l => l.id === state.level.id) + 1];
  $("btn-next").hidden = !next;
  $("result-player").textContent = player;
  $("result-score").textContent = score;
  $("save-msg").textContent = "GUARDANDO…";
  show("result");
  try {
    const r = await saveScore({ levelId: state.level.id, name: player, score, errors: state.errors, timeMs: elapsedMs(state) });
    $("save-msg").textContent = r.saved ? "¡PUNTAJE GUARDADO!" : `TU MEJOR PUNTAJE EN ESTA RONDA: ${r.best}`;
  } catch (e) {
    console.warn(e);
    $("save-msg").textContent = "NO SE PUDO GUARDAR EL PUNTAJE";
  }
}

$("btn-start").addEventListener("click", register);
$("player-name").addEventListener("keydown", e => { if (e.key === "Enter") register(); });
$("btn-change").addEventListener("click", () => { show("name"); $("player-name").focus(); });
$("btn-again").addEventListener("click", () => play(state.level));
$("btn-next").addEventListener("click", () => play(levels[levels.findIndex(l => l.id === state.level.id) + 1]));
$("btn-menu").addEventListener("click", () => show("menu"));
$("btn-quit").addEventListener("click", () => { stopTimer(); show("menu"); });
$("btn-sound").addEventListener("click", () => { $("btn-sound").textContent = sfx.toggle() ? "SND OFF" : "SND ON"; });

init();

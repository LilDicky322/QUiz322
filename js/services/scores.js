import { getFirebase } from "./firebase.js";
import { ensureUser } from "./auth.js";

const KEY = "rc_scores";
const listeners = new Set();
const readLocal = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const topLocal = n => readLocal().sort((a, b) => b.score - a.score).slice(0, n);

// Un documento por jugador y ronda (id = uid_ronda): solo se reemplaza si el puntaje mejora.
// Devuelve { saved, best }.
export async function saveScore({ levelId, name, score, errors, timeMs }) {
  const fb = await getFirebase();
  if (!fb) {
    const all = readLocal();
    const prev = all.find(s => s.levelId === levelId && s.name === name);
    if (prev && prev.score >= score) return { saved: false, best: prev.score };
    localStorage.setItem(KEY, JSON.stringify([...all.filter(s => s !== prev), { levelId, name, score, errors, timeMs }]));
    listeners.forEach(f => f());
    return { saved: true, best: score };
  }
  const user = await ensureUser();
  const { db, fsMod } = fb;
  const ref = fsMod.doc(db, "scores", `${user.uid}_${levelId}`);
  const prev = await fsMod.getDoc(ref);
  if (prev.exists() && prev.data().score >= score) return { saved: false, best: prev.data().score };
  await fsMod.setDoc(ref, { uid: user.uid, levelId, name, score, errors, timeMs, updatedAt: fsMod.serverTimestamp() });
  return { saved: true, best: score };
}

// Tiempo real: llama a cb(rows) en cada cambio. Devuelve la función para cancelar.
export function subscribeTop(n, cb) {
  let unsub = () => {}, off = false;
  getFirebase().then(fb => {
    if (off) return;
    if (!fb) {
      const emit = () => cb(topLocal(n));
      listeners.add(emit);
      emit();
      unsub = () => listeners.delete(emit);
      return;
    }
    const { db, fsMod } = fb;
    const q = fsMod.query(fsMod.collection(db, "scores"), fsMod.orderBy("score", "desc"), fsMod.limit(n));
    unsub = fsMod.onSnapshot(q, snap => cb(snap.docs.map(d => d.data())), err => cb(null, err));
  }).catch(err => cb(null, err));
  return () => { off = true; unsub(); };
}

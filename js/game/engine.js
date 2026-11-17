// Lógica pura: no toca el DOM ni Firebase.
export const elapsedMs = s => (s.finishedAt ?? Date.now()) - s.startedAt;
export const calcScore = s => Math.max(0, s.hits * 100 - s.errors * 30 - Math.floor(elapsedMs(s) / 1000));

// Devuelve el evento resultante: select | unselect | match | miss | ignore
export function pick(state, side, id) {
  if (state.matched.has(id)) return { type: "ignore" };
  const sel = state.selected;
  if (!sel) { state.selected = { side, id }; return { type: "select" }; }
  if (sel.side === side) {
    if (sel.id === id) { state.selected = null; return { type: "unselect" }; }
    state.selected = { side, id };
    return { type: "select" };
  }
  state.selected = null;
  if (sel.id === id) {
    state.matched.add(id);
    state.hits++;
    const done = state.hits === state.level.pairs.length;
    if (done) state.finishedAt = Date.now();
    return { type: "match", id, done };
  }
  state.errors++;
  return { type: "miss", a: sel };
}

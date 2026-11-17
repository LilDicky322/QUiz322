import { shuffle } from "../game/shuffle.js";

const $ = id => document.getElementById(id);
export const itemEl = (side, id) => document.querySelector(`.item[data-side="${side}"][data-id="${id}"]`);

export function renderBoard(level, onPick) {
  const [la = "A", lb = "B"] = level.labels || [];
  $("label-a").textContent = la;
  $("label-b").textContent = lb;
  const make = (text, id, side) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "item";
    b.textContent = text;
    b.dataset.id = id;
    b.dataset.side = side;
    b.addEventListener("click", () => onPick(side, id));
    return b;
  };
  for (const [col, side, key] of [["col-a", "A", "a"], ["col-b", "B", "b"]]) {
    $(col).replaceChildren(...shuffle(level.pairs.map((p, i) => [p[key], i])).map(([t, i]) => make(t, i, side)));
  }
}

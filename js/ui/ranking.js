const note = text => { const e = document.createElement("li"); e.className = "muted"; e.textContent = text; return e; };

export function renderTop(rows, err, tags = {}, me = "") {
  const ol = document.getElementById("top-list");
  if (err || !rows) return ol.replaceChildren(note("RANKING NO DISPONIBLE"));
  if (!rows.length) return ol.replaceChildren(note("SÉ EL PRIMERO EN JUGAR"));
  ol.replaceChildren(...rows.map((r, i) => {
    const li = document.createElement("li");
    if (r.name === me) li.className = "me";
    for (const [cls, text] of [["rk", i + 1], ["nm", r.name], ["tg", tags[r.levelId] || "?"], ["sc", r.score]]) {
      const s = document.createElement("span");
      s.className = cls;
      s.textContent = text;
      li.append(s);
    }
    return li;
  }));
}

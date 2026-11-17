// Las rondas viven en data/levels.json; Firebase se usa solo para puntajes.
export async function loadLevels() {
  const res = await fetch("data/levels.json");
  if (!res.ok) throw new Error("No se pudieron cargar las rondas");
  return res.json();
}

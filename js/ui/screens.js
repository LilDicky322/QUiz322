export function show(name) {
  document.querySelectorAll(".screen").forEach(s => s.classList.toggle("active", s.id === `screen-${name}`));
}

export function createState(level) {
  return { level, selected: null, matched: new Set(), hits: 0, errors: 0, locked: false, startedAt: Date.now(), finishedAt: null };
}

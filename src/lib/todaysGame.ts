const selectedGames = [
  31679, 9096, 673, 30634, 24493, 13688, 19592, 6748, 8232, 6009,
] as const;

const { length } = Object.keys(selectedGames);

export function getTodaysGameId() {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const d = today.getDate();
  const seed = [y, m, d].join("");
  return selectedGames[parseInt(seed, 10) % length];
}

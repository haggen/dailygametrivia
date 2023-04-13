const selectedGames: Record<number, number> = {
  0: 2131,
  1: 138951,
  2: 1291,
  3: 9509,
};

const { length } = Object.keys(selectedGames);

export function getTodaysGameId() {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const d = today.getDate();
  return selectedGames[(y * m * d) % length];
}

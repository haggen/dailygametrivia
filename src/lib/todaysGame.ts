const selectedGames: Record<number, number> = {
  0: 117743,
  1: 15587,
  2: 1643,
  3: 673,
};

const { length } = Object.keys(selectedGames);

export function getTodaysGameId() {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const d = today.getDate();
  return selectedGames[(y * m * d) % length];
}
